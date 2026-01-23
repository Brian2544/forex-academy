import { paystack } from '../../config/paystack.js';
import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { config } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

const ADMIN_ROLES = new Set([
  'admin',
  'super_admin',
  'owner',
  'content_admin',
  'support_admin',
  'finance_admin',
]);

const isAdminRole = (role) => ADMIN_ROLES.has((role || '').toLowerCase());

const getUserRole = async (userId) => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return profile?.role || 'student';
};

const getCourseById = async (courseId) => {
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('is_active', true)
    .single();

  if (error || !course) {
    return null;
  }

  return course;
};

const getCourseByLevel = async (courseLevel) => {
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('level', courseLevel)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !course) {
    return null;
  }

  return course;
};

const getCourseByTitle = async (courseTitle) => {
  if (!courseTitle) {
    return null;
  }
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('title', courseTitle)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !course) {
    return null;
  }

  return course;
};

const isUuid = (value) => /^[0-9a-fA-F-]{36}$/.test(String(value || ''));

const getFallbackPrice = (level) => {
  switch ((level || '').toLowerCase()) {
    case 'beginner':
      return 15000;
    case 'intermediate':
      return 30000;
    case 'advanced':
      return 50000;
    default:
      return 25000;
  }
};

const normalizeCoursePricing = (course) => {
  const priceFromDb = Number(course?.price_ngn);
  const price_ngn = Number.isFinite(priceFromDb) && priceFromDb > 0
    ? priceFromDb
    : getFallbackPrice(course?.level);
  const currency = (config.paystack.currency || 'KES').toUpperCase();
  return { ...course, price_ngn, currency };
};

const resolvePaystackCurrency = () => {
  const allowed = ['KES'];
  const configured = (config.paystack.currency || 'KES').toUpperCase();
  return allowed.includes(configured) ? configured : 'KES';
};

const toMinorUnit = (amountMajor) => Math.round(Number(amountMajor) * 100);

const resolveAccessDays = (course) => {
  const explicitDays = Number(course?.duration_days || course?.access_days);
  if (Number.isFinite(explicitDays) && explicitDays > 0) {
    return explicitDays;
  }
  const level = (course?.level || '').toLowerCase();
  if (level === 'beginner') return 30;
  if (level === 'intermediate') return 60;
  if (level === 'advanced') return 90;
  return Number(config.paystack.accessDays || 365);
};

const getChannelErrorMessage = (paystackError) => {
  const message = (paystackError?.message || '').toLowerCase();
  if (!message) return '';
  if (message.includes('channel')) {
    return 'Payment channel configuration rejected by Paystack. Please check enabled channels for this merchant.';
  }
  return '';
};

const getPaymentIntentByReference = async (reference) => {
  if (!reference) return null;
  const { data, error } = await supabaseAdmin
    .from('payment_intents')
    .select('reference, user_id, course_id, amount_kobo, currency')
    .eq('reference', reference)
    .maybeSingle();
  if (error) {
    logger.warn('Payment intent lookup failed:', error.message);
    return null;
  }
  return data || null;
};

const upsertPaymentIntent = async ({ reference, userId, courseId, amountMinor, currency }) => {
  if (!reference || !userId || !courseId) {
    return { error: null };
  }
  const { error } = await supabaseAdmin
    .from('payment_intents')
    .upsert(
      {
        reference,
        user_id: userId,
        course_id: courseId,
        amount_kobo: amountMinor,
        currency: (currency || 'KES').toUpperCase(),
      },
      { onConflict: 'reference' }
    );
  return { error };
};

const isMissingColumnError = (error) => {
  const message = error?.message || '';
  return error?.code === '42703' || message.includes('column') || message.includes('does not exist');
};

const upsertPaymentAndEntitlement = async ({
  userId,
  email,
  course,
  reference,
  transaction,
  accessDays,
}) => {
  const amountNgn = Number(course.price_ngn || 0);
  const amountMinor = Math.round(amountNgn * 100);

  const paymentPayload = {
    user_id: userId,
    email,
    course_id: course.id,
    reference,
    amount: amountNgn,
    amount_kobo: transaction?.amount || amountMinor,
    currency: transaction?.currency || course.currency || 'NGN',
    status: transaction?.status || 'success',
    paid_at: transaction?.paid_at || new Date().toISOString(),
    raw_event: transaction || null,
    provider: 'paystack',
    metadata: transaction || null,
    updated_at: new Date().toISOString(),
  };

  let paymentError = null;
  const { error: initialPaymentError } = await supabaseAdmin
    .from('payments')
    .upsert(
      paymentPayload,
      { onConflict: 'reference' }
    );

  if (initialPaymentError && isMissingColumnError(initialPaymentError)) {
    const minimalPaymentPayload = {
      user_id: userId,
      reference,
      amount_kobo: transaction?.amount || amountMinor,
      currency: transaction?.currency || course.currency || 'NGN',
      status: transaction?.status || 'success',
      provider: 'paystack',
      metadata: transaction || null,
    };
    const { error: retryPaymentError } = await supabaseAdmin
      .from('payments')
      .upsert(minimalPaymentPayload, { onConflict: 'reference' });
    paymentError = retryPaymentError || null;
  } else {
    paymentError = initialPaymentError || null;
  }

  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt);
  const resolvedAccessDays = Number(accessDays || config.paystack.accessDays || 365);
  expiresAt.setDate(expiresAt.getDate() + resolvedAccessDays);

  const entitlementPayload = {
    user_id: userId,
    course_id: course.id,
    active: true,
    status: 'active',
    activated_at: activatedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    source_payment_reference: reference,
  };

  let entitlementError = null;
  const { error: initialEntitlementError } = await supabaseAdmin
    .from('entitlements')
    .upsert(
      entitlementPayload,
      { onConflict: 'user_id,course_id' }
    );

  if (initialEntitlementError && isMissingColumnError(initialEntitlementError)) {
    const minimalEntitlementPayload = {
      user_id: userId,
      course_id: course.id,
      active: true,
      activated_at: activatedAt.toISOString(),
      source_payment_reference: reference,
    };
    const { error: retryEntitlementError } = await supabaseAdmin
      .from('entitlements')
      .upsert(minimalEntitlementPayload, { onConflict: 'user_id,course_id' });
    entitlementError = retryEntitlementError || null;
  } else {
    entitlementError = initialEntitlementError || null;
  }

  return { paymentError, entitlementError, activatedAt, expiresAt };
};

export const getPlans = asyncHandler(async (req, res) => {
  const { data: plans, error } = await supabaseAdmin
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price_usd', { ascending: true });

  if (error) {
    logger.error('Error fetching plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
    });
  }

  res.json({
    success: true,
    data: plans || [],
  });
});

export const checkout = asyncHandler(async (req, res) => {
  // Check if Paystack is configured
  if (!paystack.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment system is not configured. Please contact support.',
      code: 'PAYMENT_NOT_CONFIGURED',
    });
  }

  const { planId } = req.body;
  const userId = req.userId;

  if (!planId) {
    return res.status(400).json({
      success: false,
      message: 'Plan ID is required',
    });
  }

  // Get plan details
  const { data: plan, error: planError } = await supabaseAdmin
    .from('plans')
    .select('*')
    .eq('id', planId)
    .eq('is_active', true)
    .single();

  if (planError || !plan) {
    return res.status(404).json({
      success: false,
      message: 'Plan not found',
    });
  }

  // Determine environment (test or live)
  const isTest = config.paystack.secretKey?.startsWith('sk_test_');
  const planCode = isTest ? plan.paystack_plan_code_test : plan.paystack_plan_code_live;

  if (!planCode) {
    return res.status(400).json({
      success: false,
      message: `Paystack plan code not configured for ${isTest ? 'test' : 'live'} environment`,
    });
  }

  // Get user profile and email
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = user?.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'User email not found',
    });
  }

  try {
    // Create or get Paystack customer
    const customerResponse = await paystack.createCustomer(
      email,
      profile?.first_name || '',
      profile?.last_name || ''
    );

    if (!customerResponse.status || !customerResponse.data?.customer_code) {
      throw new Error('Failed to create/get Paystack customer');
    }

    const customerCode = customerResponse.data.customer_code;

    // Store customer code in subscription if exists
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSub && !existingSub.paystack_customer_code) {
      await supabaseAdmin
        .from('subscriptions')
        .update({ paystack_customer_code: customerCode })
        .eq('user_id', userId);
    }

    // For monthly subscriptions, create Paystack subscription
    if (plan.interval === 'monthly') {
      const subscriptionResponse = await paystack.createSubscription(customerCode, planCode);

      if (subscriptionResponse.status && subscriptionResponse.data) {
        const subscriptionData = subscriptionResponse.data;
        
        // Store subscription in database
        await supabaseAdmin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              plan_id: planId,
              paystack_customer_code: customerCode,
              paystack_subscription_code: subscriptionData.subscription_code,
              status: 'active',
              provider: 'paystack',
              current_period_end: subscriptionData.next_payment_date 
                ? new Date(subscriptionData.next_payment_date).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        return res.json({
          success: true,
          data: {
            authorization_url: subscriptionData.authorization_url,
            reference: subscriptionData.subscription_code,
            type: 'subscription',
          },
        });
      } else {
        throw new Error('Failed to create Paystack subscription');
      }
    } else {
      // For one-time payments, use transaction initialization
      const amountInCents = Math.round(plan.price_usd * 100);
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Paystack checkout init payload', {
          amount: amountInCents,
          currency: config.paystack.currency || 'KES',
          email,
          callback_url: `${config.appBaseUrl}/billing/callback`,
          metadataKeys: ['userId', 'planId', 'planName'],
          channels: Array.isArray(config.paystack.channels) && config.paystack.channels.length > 0
            ? config.paystack.channels
            : null,
        });
      }
      const paystackResponse = await paystack.initializeTransaction({
        amount: amountInCents,
        email,
        callback_url: `${config.appBaseUrl}/billing/callback`,
        metadata: {
          userId,
          planId,
          planName: plan.name,
        },
      });

      if (paystackResponse.status && paystackResponse.data) {
        res.json({
          success: true,
          data: {
            authorization_url: paystackResponse.data.authorization_url,
            reference: paystackResponse.data.reference,
            type: 'transaction',
          },
        });
      } else {
        throw new Error('Invalid Paystack response');
      }
    }
  } catch (error) {
    const paystackError = error.response?.data;
    logger.error('Paystack checkout error:', paystackError || error.message);
    const channelMessage = getChannelErrorMessage(paystackError);
    if (channelMessage) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_CHANNELS',
        message: channelMessage,
      });
    }
    res.status(500).json({
      success: false,
      message: paystackError?.message || error.message || 'Failed to initialize payment',
    });
  }
});

// Verify transaction/subscription after callback
export const verify = asyncHandler(async (req, res) => {
  if (!paystack.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment system is not configured',
    });
  }

  const { reference } = req.query;
  if (!reference) {
    return res.status(400).json({
      success: false,
      message: 'Reference is required',
    });
  }

  const userId = req.userId;

  try {
    // Try to verify as transaction first
    const verifyResponse = await paystack.verifyTransaction(reference);
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Paystack verify response', {
        status: verifyResponse?.status,
        transactionStatus: verifyResponse?.data?.status,
        currency: verifyResponse?.data?.currency,
        amount: verifyResponse?.data?.amount,
        metadataKeys: Object.keys(verifyResponse?.data?.metadata || {}),
      });
    }

    if (verifyResponse.status && verifyResponse.data.status === 'success') {
      const transaction = verifyResponse.data;
      const metadata = transaction.metadata || {};
      const planId = metadata.planId;

      if (!planId) {
        return res.status(400).json({
          success: false,
          message: 'Plan ID not found in transaction',
        });
      }

      // Get plan
      const { data: plan } = await supabaseAdmin
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found',
        });
      }

      // Store payment
      await supabaseAdmin.from('payments').insert({
        user_id: userId,
        plan_id: planId,
        reference: transaction.reference,
        amount_kobo: transaction.amount,
        currency: transaction.currency,
        status: 'success',
        provider: 'paystack',
        metadata: transaction,
      });

      // Update subscription
      let currentPeriodEnd = new Date();
      if (plan.interval === 'monthly') {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd = new Date('2099-12-31');
      }

      await supabaseAdmin
        .from('subscriptions')
        .upsert(
          {
            user_id: userId,
            plan_id: planId,
            status: 'active',
            provider: 'paystack',
            provider_ref: transaction.reference,
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      return res.json({
        success: true,
        data: {
          status: 'success',
          subscription: {
            status: 'active',
            plan_id: planId,
          },
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Transaction verification failed',
      });
    }
  } catch (error) {
    logger.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed',
    });
  }
});

// Get current user subscription status
export const getMySubscription = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error('Error fetching subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
    });
  }

  res.json({
    success: true,
    data: subscription || null,
  });
});

// Initialize Paystack transaction for course payments
export const initializeCoursePayment = asyncHandler(async (req, res) => {
  if (!paystack.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment system is not configured. Please contact support.',
      code: 'PAYMENT_NOT_CONFIGURED',
    });
  }

  const { courseId, course_id: courseIdLegacy, id: courseIdAlias, courseLevel, courseTitle } = req.body;
  const userId = req.userId;
  const userEmail = req.user?.email;

  const resolvedCourseId = courseId || courseIdLegacy || courseIdAlias;

  if (!resolvedCourseId && !courseLevel && !courseTitle) {
    return res.status(400).json({
      success: false,
      message: 'Course ID, level, or title is required',
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Paystack init payload', {
      courseId: resolvedCourseId,
      courseLevel,
      courseTitle,
    });
  }

  let course = null;

  if (resolvedCourseId && isUuid(resolvedCourseId)) {
    course = await getCourseById(resolvedCourseId);
  }

  if (!course && courseLevel) {
    course = await getCourseByLevel(courseLevel);
  }

  if (!course && courseTitle) {
    course = await getCourseByTitle(courseTitle);
  }
  if (!course) {
    return res.status(400).json({
      success: false,
      message: 'Course not found',
    });
  }

  course = normalizeCoursePricing(course);
  const amountKes = Number(course.price_ngn || 0);
  if (!Number.isFinite(amountKes) || amountKes <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Course pricing is not configured. Please contact support.',
    });
  }

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: 'User email not found',
    });
  }

  const currency = resolvePaystackCurrency();
  const amountMinor = toMinorUnit(amountKes);

  if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment amount',
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Paystack course init payload', {
      amount: amountMinor,
      currency,
      email: userEmail,
      callback_url: `${config.appBaseUrl}/payments/status`,
      metadataKeys: ['user_id', 'email', 'course_id', 'course_title', 'course_level'],
      channels: Array.isArray(config.paystack.channels) && config.paystack.channels.length > 0
        ? config.paystack.channels
        : null,
    });
  }

  try {
    const response = await paystack.initializeTransaction({
      amount: amountMinor,
      email: userEmail,
      currency,
      callback_url: `${config.appBaseUrl}/payments/status`,
      metadata: {
        user_id: userId,
        email: userEmail,
        course_id: course.id,
        course_title: course.title,
        course_level: course.level,
      },
    });

    if (!response.status || !response.data) {
      return res.status(500).json({
        success: false,
        message: 'Invalid Paystack response',
      });
    }

    try {
      const { error: intentError } = await upsertPaymentIntent({
        reference: response.data.reference,
        userId,
        courseId: course.id,
        amountMinor,
        currency,
      });
      if (intentError) {
        logger.warn('Payment intent upsert failed:', intentError.message);
      }
    } catch (intentException) {
      logger.warn('Payment intent upsert exception:', intentException.message);
    }

    res.json({
      success: true,
      data: {
        authorization_url: response.data.authorization_url,
        reference: response.data.reference,
      },
    });
  } catch (error) {
    const paystackError = error.response?.data;
    logger.error('Paystack course initialize error:', paystackError || error.message);
    const channelMessage = getChannelErrorMessage(paystackError);
    if (channelMessage) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_CHANNELS',
        message: channelMessage,
      });
    }
    if (paystackError?.code === 'unsupported_currency') {
      return res.status(400).json({
        success: false,
        code: 'UNSUPPORTED_CURRENCY',
        message: `Payment cannot be initialized: currency ${currency} not supported by merchant. Please contact support.`,
      });
    }
    res.status(500).json({
      success: false,
      message: paystackError?.message || 'Failed to initialize payment',
    });
  }
});

// Verify Paystack transaction for course payments
export const verifyCoursePayment = asyncHandler(async (req, res) => {
  if (!paystack.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment system is not configured',
    });
  }

  const { reference } = req.params;
  const userId = req.userId;
  const userEmail = req.user?.email;

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: 'Reference is required',
    });
  }

  try {
    const verifyResponse = await paystack.verifyTransaction(reference);

    if (!verifyResponse.status || verifyResponse.data?.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Transaction verification failed',
      });
    }

    const transaction = verifyResponse.data;
    const metadata = transaction.metadata || {};
    const metadataCourseId = metadata.course_id || metadata.courseId;
    const metadataUserId = metadata.user_id || metadata.userId;
    let resolvedCourseId = metadataCourseId;
    let resolvedUserId = metadataUserId;

    if (!resolvedCourseId || !resolvedUserId) {
      const intent = await getPaymentIntentByReference(reference);
      if (intent) {
        resolvedCourseId = resolvedCourseId || intent.course_id;
        resolvedUserId = resolvedUserId || intent.user_id;
      }
    }

    if (!resolvedCourseId || !resolvedUserId) {
      return res.status(400).json({
        success: false,
        message: 'Course metadata missing from transaction',
      });
    }

    if (resolvedUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Transaction does not belong to this user',
      });
    }

    const course = await getCourseById(resolvedCourseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const normalizedCourse = normalizeCoursePricing(course);
    const currency = resolvePaystackCurrency();
    const amountKes = Number(normalizedCourse.price_ngn || 0);
    const expectedMinor = toMinorUnit(amountKes);

    if (transaction.amount !== expectedMinor) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
      });
    }

    if ((transaction.currency || '').toUpperCase() !== currency) {
      return res.status(400).json({
        success: false,
        message: 'Payment currency mismatch',
      });
    }

    const accessDays = resolveAccessDays(course);

    const { error: eventError } = await supabaseAdmin
      .from('payment_events')
      .upsert(
        {
          provider: 'paystack',
          event_id: transaction.reference,
          payload_json: transaction,
        },
        { onConflict: 'provider,event_id' }
      );

    if (eventError) {
      logger.warn('Payment event upsert failed:', eventError.message);
    }

    const { paymentError, entitlementError, activatedAt, expiresAt } = await upsertPaymentAndEntitlement({
      userId,
      email: userEmail || metadata.email,
      course: normalizedCourse,
      reference: transaction.reference,
      transaction,
      accessDays,
    });

    if (paymentError || entitlementError) {
      logger.error('Entitlement activation failed:', {
        paymentError,
        entitlementError,
      });
      return res.status(500).json({
        success: false,
        code: 'ENTITLEMENT_WRITE_FAILED',
        message: 'Payment verified but access could not be activated. Please contact support.',
      });
    }

    return res.json({
      success: true,
      data: {
        status: 'success',
        courseId: course.id,
        courseLevel: course.level,
        entitlementActive: true,
        activatedAt: activatedAt?.toISOString(),
        expiresAt: expiresAt?.toISOString(),
        reference: transaction.reference,
      },
    });
  } catch (error) {
    logger.error('Verify course payment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
    });
  }
});

// Get current user entitlements
export const getMyEntitlements = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const userRole = await getUserRole(userId);

  if (isAdminRole(userRole)) {
    const { data: courses } = await supabaseAdmin
      .from('courses')
      .select('id, title, level, price_ngn, currency')
      .eq('is_active', true);

    return res.json({
      success: true,
      data: {
        entitlements: (courses || []).map((course) => ({
          course_id: course.id,
          active: true,
        })),
        allAccess: true,
      },
    });
  }

  const now = new Date().toISOString();
  const { data: entitlements, error } = await supabaseAdmin
    .from('entitlements')
    .select('course_id, active, activated_at, status, expires_at')
    .eq('user_id', userId)
    .eq('active', true);

  if (error) {
    logger.error('Error fetching entitlements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch entitlements',
    });
  }

  const activeEntitlements = (entitlements || [])
    .filter((entitlement) => entitlement.status !== 'expired')
    .filter((entitlement) => !entitlement.expires_at || entitlement.expires_at > now);

  res.json({
    success: true,
    data: {
      entitlements: activeEntitlements,
      allAccess: false,
    },
  });
});

// Public endpoint to fetch Paystack public key (safe to expose)
export const getPaystackPublicKey = asyncHandler(async (req, res) => {
  const publicKey = config.paystack.publicKey;
  if (!publicKey) {
    return res.status(404).json({
      success: false,
      message: 'Paystack public key not configured',
    });
  }
  res.json({
    success: true,
    data: {
      publicKey,
    },
  });
});

