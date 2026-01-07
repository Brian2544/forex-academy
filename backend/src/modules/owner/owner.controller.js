import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';
import { canAssignRole, ROLES } from '../../utils/roleUtils.js';
import { bootstrapProfile } from '../../utils/profileBootstrap.js';

/**
 * Get list of users with pagination and search
 * Allowed: owner, super_admin, finance_admin (read-only)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.userId;
  const currentUserRole = req.userRole;
  
  // Get current user profile to check role
  const { data: currentUser } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', currentUserId)
    .single();

  const role = currentUser?.role || currentUserRole;

  // Check permissions
  if (!['owner', 'super_admin', 'finance_admin'].includes(role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
    });
  }

  const { search = '', page = 1, limit = 50 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  // Build query - profiles table doesn't have email, we'll fetch from auth.users
  let query = supabaseAdmin
    .from('profiles')
    .select('id, first_name, last_name, role, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limitNum - 1);

  // Add search filter if provided (search by name only, email search done after)
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  const { data: users, error, count } = await query;

  if (error) {
    logger.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }

  // Get emails from auth.users
  const userIds = users.map(u => u.id);
  const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = authUsersData?.users || [];

  // Map emails to users and apply email search filter if needed
  let usersWithEmail = users.map(user => {
    const authUser = authUsers.find(au => au.id === user.id);
    return {
      ...user,
      email: authUser?.email || 'N/A',
    };
  });

  // Apply email search filter if search term provided and not already filtered
  if (search) {
    const searchLower = search.toLowerCase();
    usersWithEmail = usersWithEmail.filter(user => 
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower)
    );
  }

  // Recalculate total if email search was applied (client-side filtering)
  // For accurate pagination with email search, we'd need to fetch all and filter
  // For now, return the filtered results with approximate total
  const finalTotal = search ? usersWithEmail.length : (count || 0);

  res.json({
    success: true,
    data: {
      users: usersWithEmail,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limitNum) || 1,
      },
    },
  });
});

/**
 * Update user role
 * Allowed: owner, super_admin (with restrictions)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, reason } = req.body;
  const currentUserId = req.userId;

  // Validate role
  const validRoles = [
    ROLES.STUDENT,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.CONTENT_ADMIN,
    ROLES.SUPPORT_ADMIN,
    ROLES.FINANCE_ADMIN,
  ];

  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  // Get current user role
  const { data: currentUser } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', currentUserId)
    .single();

  if (!currentUser) {
    return res.status(403).json({
      success: false,
      message: 'Current user profile not found',
    });
  }

  const actorRole = currentUser.role;

  // Check if actor can assign roles
  if (!['owner', 'super_admin'].includes(actorRole)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to assign roles',
    });
  }

  // Get target user's current role - bootstrap if missing
  let { data: targetUser } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', id)
    .maybeSingle();

  // If profile doesn't exist, bootstrap it
  if (!targetUser) {
    logger.warn(`Profile missing for user ${id} during role update, bootstrapping...`);
    try {
      // Get user email from auth.users
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
      if (!authUser?.user?.email) {
        return res.status(404).json({
          success: false,
          message: 'User not found in auth system',
        });
      }
      
      // Bootstrap profile
      const bootstrappedProfile = await bootstrapProfile(id, authUser.user.email);
      targetUser = bootstrappedProfile;
    } catch (bootstrapError) {
      logger.error('Failed to bootstrap profile during role update:', bootstrapError);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  }

  const targetOldRole = targetUser.role || ROLES.STUDENT;

  // Check if assignment is allowed
  if (!canAssignRole(actorRole, targetOldRole, role)) {
    return res.status(403).json({
      success: false,
      message: `You cannot assign role '${role}' to this user`,
    });
  }

  // Update role
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    logger.error('Role update error:', updateError);
    return res.status(500).json({
      success: false,
      message: 'Failed to update role',
    });
  }

  // Log to role_audit table
  try {
    await supabaseAdmin
      .from('role_audit')
      .insert({
        actor_id: currentUserId,
        target_id: id,
        old_role: targetOldRole,
        new_role: role,
        reason: reason || null,
        created_at: new Date().toISOString(),
      });
  } catch (auditError) {
    // Log error but don't fail the request
    logger.error('Failed to log role audit:', auditError);
  }

  logger.info(`User ${currentUserId} (${actorRole}) updated role of user ${id} from ${targetOldRole} to ${role}`);

  res.json({
    success: true,
    data: updated,
  });
});

