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

  // Get user email
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Get user email from auth.users (via Supabase Admin)
  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = user?.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'User email not found',
    });
  }

  // Calculate amount in cents (USD)
  const amountInCents = Math.round(plan.price_usd * 100);

  // Initialize Paystack transaction
  try {
    const paystackResponse = await paystack.initializeTransaction({
      amount: amountInCents,
      email,
      callback_url: `${config.appBaseUrl}/billing/success`,
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
        },
      });
    } else {
      throw new Error('Invalid Paystack response');
    }
  } catch (error) {
    logger.error('Paystack checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize payment',
    });
  }
});

