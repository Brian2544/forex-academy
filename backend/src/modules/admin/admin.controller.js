import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';
import { canAssignRole, ROLES } from '../../utils/roleUtils.js';
import { bootstrapProfile } from '../../utils/profileBootstrap.js';

// Role management (kept for backwards compatibility)
// Note: New role assignments should use /owner/users/:id/role
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

  // Check permissions - owner and super_admin can assign roles
  if (!['owner', 'super_admin'].includes(actorRole)) {
    return res.status(403).json({
      success: false,
      message: 'Only owner or super_admin can assign roles',
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
  const { data: updated, error } = await supabaseAdmin
    .from('profiles')
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Role update error:', error);
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

// Settings management
export const getSettings = asyncHandler(async (req, res) => {
  const { data: settings, error } = await supabaseAdmin
    .from('app_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Settings fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    });
  }

  res.json({
    success: true,
    data: settings || { whatsapp_channel_url: null },
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { whatsapp_channel_url } = req.body;

  const { data: settings, error } = await supabaseAdmin
    .from('app_settings')
    .upsert(
      {
        id: 1,
        whatsapp_channel_url,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    )
    .select()
    .single();

  if (error) {
    logger.error('Settings update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    });
  }

  res.json({
    success: true,
    data: settings,
  });
});

// CRUD operations for courses, lessons, live_sessions, announcements, blog_posts, market_analysis, testimonials
// These follow similar patterns - I'll create generic handlers

const createCRUDHandlers = (tableName) => {
  return {
    list: asyncHandler(async (req, res) => {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error(`Error listing ${tableName}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to fetch ${tableName}`,
        });
      }

      res.json({
        success: true,
        data: data || [],
      });
    }),

    get: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          message: `${tableName} not found`,
        });
      }

      res.json({
        success: true,
        data,
      });
    }),

    create: asyncHandler(async (req, res) => {
      const { data: created, error } = await supabaseAdmin
        .from(tableName)
        .insert({
          ...req.body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error(`Error creating ${tableName}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to create ${tableName}`,
        });
      }

      res.status(201).json({
        success: true,
        data: created,
      });
    }),

    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { data: updated, error } = await supabaseAdmin
        .from(tableName)
        .update({
          ...req.body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) {
        return res.status(404).json({
          success: false,
          message: `${tableName} not found`,
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    }),

    delete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting ${tableName}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to delete ${tableName}`,
        });
      }

      res.json({
        success: true,
        message: `${tableName} deleted successfully`,
      });
    }),
  };
};

// Export CRUD handlers for each table
export const coursesHandlers = createCRUDHandlers('courses');
export const lessonsHandlers = createCRUDHandlers('lessons');
export const liveSessionsHandlers = createCRUDHandlers('live_sessions');
export const announcementsHandlers = createCRUDHandlers('announcements');
export const blogPostsHandlers = createCRUDHandlers('blog_posts');
export const marketAnalysisHandlers = createCRUDHandlers('market_analysis');
export const testimonialsHandlers = createCRUDHandlers('testimonials');

