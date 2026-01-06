import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check for active subscription
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('user_id', req.userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking subscription',
    });
  }

  if (!subscription) {
    return res.status(402).json({
      success: false,
      message: 'Active subscription required',
      code: 'SUBSCRIPTION_REQUIRED',
    });
  }

  next();
});

