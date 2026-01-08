import { paystack } from '../../config/paystack.js';
import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { config } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

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
    logger.error('Paystack checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize payment',
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

