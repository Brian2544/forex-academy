/**
 * Authorization middleware
 * Checks if user has required permission(s)
 * Usage: authorize(PERMISSIONS.MANAGE_USERS) or authorize([PERMISSIONS.MANAGE_USERS, PERMISSIONS.VIEW_ANALYTICS])
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions.js';
import { ensureProfileExists } from '../utils/profileBootstrap.js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

/**
 * Create authorize middleware
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {object} options - Options
 * @param {boolean} options.requireAll - If true, requires all permissions. If false (default), requires any permission.
 */
export const authorize = (requiredPermissions, options = {}) => {
  const { requireAll = false } = options;
  
  return asyncHandler(async (req, res, next) => {
    if (!req.userId || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Ensure profile exists
    const profile = await ensureProfileExists(req.userId, req.user.email);
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Get fresh role from database
    const { data: freshProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.userId)
      .single();

    const userRole = freshProfile?.role || profile.role;
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'User role not found',
      });
    }

    // Normalize permissions to array
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Check permissions
    let hasAccess = false;
    if (requireAll) {
      hasAccess = hasAllPermissions(userRole, permissions);
    } else {
      hasAccess = hasAnyPermission(userRole, permissions);
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    // Attach role to request for downstream use
    req.userRole = userRole;
    next();
  });
};

