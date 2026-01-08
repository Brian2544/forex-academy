import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Get user role - admins and owners bypass subscription requirement
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', req.userId)
    .maybeSingle();

  const userRole = profile?.role?.toLowerCase();
  
  // Admin and owner roles bypass subscription check
  if (['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin'].includes(userRole)) {
    return next();
  }

  // Check for active subscription or active trial
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, trial_ends_at')
    .eq('user_id', req.userId)
    .maybeSingle();

  if (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking subscription',
    });
  }

  // Check if user has active subscription or active trial
  const hasActiveSubscription = subscription?.status === 'active';
  const now = new Date();
  const hasActiveTrial = subscription?.trial_ends_at && new Date(subscription.trial_ends_at) > now;
  const hasValidPeriod = subscription?.current_period_end && new Date(subscription.current_period_end) > now;

  if (!hasActiveSubscription && !hasActiveTrial && !hasValidPeriod) {
    return res.status(402).json({
      success: false,
      message: 'Active subscription required',
      code: 'SUBSCRIPTION_REQUIRED',
    });
  }

  next();
});

