import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Get user profile with role
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || !profile) {
      return res.status(403).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!allowedRoles.includes(profile.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    req.userRole = profile.role;
    next();
  });
};

