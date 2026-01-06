import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

// Role management
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const currentUserId = req.userId;

  if (!['student', 'admin', 'owner'].includes(role)) {
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

  if (currentUser?.role !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Only owner can assign roles',
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

  // Log audit (optional - create audit_logs table if needed)
  logger.info(`User ${currentUserId} updated role of user ${id} to ${role}`);

  res.json({
    success: true,
    data: updated,
  });
});

// Settings management
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

