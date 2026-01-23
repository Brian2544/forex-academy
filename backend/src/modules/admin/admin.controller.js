import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';
import pg from 'pg';
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

const { Pool } = pg;
const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '';
const dbPool = dbUrl ? new Pool({ connectionString: dbUrl }) : null;

const ensureBucketExists = async (bucketName) => {
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  const exists = (buckets || []).some((bucket) => bucket.name === bucketName);
  if (!exists) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true,
    });
    if (createError) {
      throw createError;
    }
  }

  return exists;
};

const isMissingTableError = (error) => {
  const code = error?.code || '';
  const message = error?.message || '';
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('relation "resources"') ||
    message.includes('schema cache')
  );
};

const ensureResourcesTable = async () => {
  if (!dbPool) {
    return false;
  }

  const sql = `
    CREATE TABLE IF NOT EXISTS resources (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('document', 'video', 'image', 'link', 'other')),
      url TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
    CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
  `;

  try {
    await dbPool.query(sql);
    return true;
  } catch (error) {
    logger.error('Failed to ensure resources table:', error);
    return false;
  }
};

const ensureLessonsColumns = async () => {
  if (!dbPool) {
    return false;
  }

  const sql = `
    ALTER TABLE lessons
      ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
      ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
  `;

  try {
    await dbPool.query(sql);
    return true;
  } catch (error) {
    logger.error('Failed to ensure lessons columns:', error);
    return false;
  }
};

const createCRUDHandlers = (tableName) => {
  return {
    list: asyncHandler(async (req, res) => {
      const { page, limit, type, course_id } = req.query;
      const pageNum = page ? parseInt(page, 10) : null;
      const limitNum = limit ? parseInt(limit, 10) : null;

      let query = supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (tableName === 'resources') {
        if (type) query = query.eq('type', type);
        if (course_id) query = query.eq('course_id', course_id);
      }

      if (pageNum && limitNum) {
        const offset = (pageNum - 1) * limitNum;
        query = query.range(offset, offset + limitNum - 1);
      }

      let { data, error, count } = await query;

      if (error && tableName === 'resources' && isMissingTableError(error)) {
        const ensured = await ensureResourcesTable();
        if (ensured) {
          const retry = await query;
          data = retry.data;
          error = retry.error;
          count = retry.count;
        }
      }

      if (error && tableName === 'lessons' && isMissingTableError(error)) {
        const ensured = await ensureLessonsColumns();
        if (ensured) {
          const retry = await query;
          data = retry.data;
          error = retry.error;
          count = retry.count;
        }
      }

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
        ...(count !== null && count !== undefined && pageNum && limitNum ? {
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: count,
            totalPages: Math.ceil(count / limitNum),
          },
        } : {}),
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
      const payload = {
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let { data: created, error } = await supabaseAdmin
        .from(tableName)
        .insert(payload)
        .select()
        .single();

      if (error && tableName === 'resources' && isMissingTableError(error)) {
        const ensured = await ensureResourcesTable();
        if (ensured) {
          const retry = await supabaseAdmin
            .from(tableName)
            .insert(payload)
            .select()
            .single();
          created = retry.data;
          error = retry.error;
        }
      }

      if (error && tableName === 'lessons' && isMissingTableError(error)) {
        const ensured = await ensureLessonsColumns();
        if (ensured) {
          const retry = await supabaseAdmin
            .from(tableName)
            .insert(payload)
            .select()
            .single();
          created = retry.data;
          error = retry.error;
        }
      }

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
export const resourcesHandlers = createCRUDHandlers('resources');
export const liveSessionsHandlers = createCRUDHandlers('live_sessions');
export const announcementsHandlers = createCRUDHandlers('announcements');
export const blogPostsHandlers = createCRUDHandlers('blog_posts');
export const marketAnalysisHandlers = createCRUDHandlers('market_analysis');
export const testimonialsHandlers = createCRUDHandlers('testimonials');

export const ensureStorageBucket = asyncHandler(async (req, res) => {
  const { name } = req.body || {};
  const bucketName = name || 'course-materials';

  try {
    const existed = await ensureBucketExists(bucketName);

    res.json({
      success: true,
      data: { bucket: bucketName, existed },
    });
  } catch (error) {
    logger.error('Error ensuring storage bucket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify storage bucket',
    });
  }
});

export const uploadResourceFile = asyncHandler(async (req, res) => {
  const bucketName = req.query.bucket || req.headers['x-bucket-name'] || 'course-materials';
  const originalName = req.headers['x-file-name'] || 'resource';
  const safeName = String(originalName).replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const filePath = `resources/${Date.now()}-${safeName}`;
  const contentType = req.headers['content-type'] || 'application/octet-stream';

  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'File payload is required',
    });
  }

  try {
    await ensureBucketExists(bucketName);
  } catch (error) {
    logger.error('Error ensuring storage bucket for upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to prepare storage bucket',
    });
  }

  const { error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, req.body, {
      contentType,
      upsert: true,
      cacheControl: '3600',
    });

  if (error) {
    logger.error('Storage upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resource file',
    });
  }

  const { data } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);

  res.json({
    success: true,
    data: {
      url: data?.publicUrl || null,
      path: filePath,
      bucket: bucketName,
    },
  });
});

/**
 * Get list of students with pagination and search
 * Allowed: admin, super_admin, owner
 */
export const getStudents = asyncHandler(async (req, res) => {
  const { search = '', country = '', status = '', page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  // Build query - only students
  let query = supabaseAdmin
    .from('profiles')
    .select('id, first_name, last_name, country, created_at', { count: 'exact' })
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .range(offset, offset + limitNum - 1);

  // Add search filter
  if (search && search.trim()) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  // Add country filter
  if (country && country.trim()) {
    query = query.eq('country', country);
  }

  const { data: students, error, count } = await query;

  if (error) {
    logger.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }

  if (!students || students.length === 0) {
    return res.json({
      success: true,
      data: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        pages: 0,
      },
    });
  }

  // Get emails from auth.users
  const studentIds = students.map(s => s.id);
  const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = authUsersData?.users || [];

  // Get subscription data (including trial info)
  const { data: subscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, status, trial_ends_at, current_period_end')
    .in('user_id', studentIds);

  // Get course entitlements
  const { data: entitlements } = await supabaseAdmin
    .from('entitlements')
    .select('user_id, course_id, status, activated_at, expires_at, source_payment_reference')
    .in('user_id', studentIds);

  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select('id, title');

  const courseMap = new Map((courses || []).map((course) => [course.id, course.title]));

  // Get payment totals (if payments table exists)
  let payments = [];
  try {
    const { data: paymentsData, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .select('user_id, amount')
      .in('user_id', studentIds);
    
    if (!paymentsError && paymentsData) {
      payments = paymentsData;
    }
  } catch (err) {
    // Gracefully handle if table doesn't exist
    logger.warn('Payments table query failed (may not exist):', err.message);
    payments = [];
  }

  // Calculate total paid per user
  const totalPaidMap = {};
  payments?.forEach(payment => {
    if (!totalPaidMap[payment.user_id]) {
      totalPaidMap[payment.user_id] = 0;
    }
    totalPaidMap[payment.user_id] += parseFloat(payment.amount || 0);
  });

  // Map emails, subscriptions, and totals to students
  let studentsWithData = students.map(student => {
    const authUser = authUsers.find(au => au.id === student.id);
    const subscription = subscriptions?.find(s => s.user_id === student.id);
    const studentEntitlements = (entitlements || []).filter((ent) => ent.user_id === student.id);
    const latestEntitlement = studentEntitlements
      .sort((a, b) => new Date(b.activated_at || 0) - new Date(a.activated_at || 0))[0];
    const totalPaid = totalPaidMap[student.id] || 0;

    let subscriptionStatus = subscription?.status || 'inactive';
    
    // Apply status filter if provided
    if (status && status.trim() && subscriptionStatus !== status) {
      return null; // Filter out
    }

    const email = authUser?.email || 'N/A';

    // Apply email search filter if search term provided and not already filtered by name
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      const matchesName = (student.first_name || '').toLowerCase().includes(searchLower) ||
                         (student.last_name || '').toLowerCase().includes(searchLower);
      const matchesEmail = email.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail) {
        return null; // Filter out
      }
    }

    return {
      ...student,
      email,
      subscription_status: subscriptionStatus,
      total_paid: totalPaid,
      course_subscription: latestEntitlement ? {
        course_id: latestEntitlement.course_id,
        course_title: courseMap.get(latestEntitlement.course_id) || 'N/A',
        status: latestEntitlement.status || 'active',
        activated_at: latestEntitlement.activated_at,
        expires_at: latestEntitlement.expires_at,
        reference: latestEntitlement.source_payment_reference || null,
      } : null,
    };
  }).filter(Boolean); // Remove nulls from filtering

  // Recalculate total if status filter was applied
  const finalTotal = status ? studentsWithData.length : (count || 0);

  res.json({
    success: true,
    data: studentsWithData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: finalTotal,
      pages: Math.ceil(finalTotal / limitNum) || 1,
    },
  });
});

/**
 * Get student detail by ID
 * Allowed: admin, super_admin, owner
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'student')
    .single();

  if (profileError || !profile) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  // Get email
  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
  profile.email = authUser?.user?.email || 'N/A';

  // Get subscriptions
  const { data: subscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('*, plan:plans(*)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  // Format subscriptions
  const formattedSubscriptions = subscriptions?.map(sub => ({
    id: sub.id,
    plan_type: sub.plan?.name || 'N/A',
    status: sub.status,
    started_at: sub.created_at,
    expires_at: sub.current_period_end,
  })) || [];

  // Get payments
  let payments = [];
  try {
    const { data: paymentsData, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });
    
    if (!paymentsError && paymentsData) {
      payments = paymentsData;
    }
  } catch (err) {
    // Gracefully handle if table doesn't exist
    logger.warn('Payments table query failed (may not exist):', err.message);
    payments = [];
  }

  // Calculate stats
  const totalPaid = payments?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
  const activeSubscriptions = formattedSubscriptions.filter(s => s.status === 'active').length;

  res.json({
    success: true,
    data: {
      profile,
      subscriptions: formattedSubscriptions,
      payments: payments || [],
      groups: [],
      tickets: [],
      stats: {
        totalPaid,
        totalPayments: payments?.length || 0,
        activeSubscriptions,
      },
    },
  });
});

/**
 * Override student subscription status (owner/admin only)
 * Allowed: owner, admin, super_admin
 */
export const overrideSubscription = asyncHandler(async (req, res) => {
  const { studentUserId } = req.params;
  const { active, reason, trialDays } = req.body;
  const currentUserId = req.userId;

  // Validate input
  if (trialDays !== undefined && trialDays !== null) {
    // Granting trial - validate trialDays
    if (![1, 7, 30].includes(trialDays)) {
      return res.status(400).json({
        success: false,
        message: 'trialDays must be 1, 7, or 30',
      });
    }
  } else if (typeof active !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'active must be a boolean when not granting trial',
    });
  }

  // Get current user role
  const { data: currentUser } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name, email')
    .eq('id', currentUserId)
    .single();

  if (!currentUser) {
    return res.status(403).json({
      success: false,
      message: 'Current user profile not found',
    });
  }

  const actorRole = currentUser.role?.toLowerCase();

  // Check permissions - owner and admins can override
  if (!['owner', 'admin', 'super_admin'].includes(actorRole)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to override subscription',
    });
  }

  // Get target user profile
  const { data: targetUser, error: targetError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, first_name, last_name, email')
    .eq('id', studentUserId)
    .single();

  if (targetError || !targetUser) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  // Only allow overriding subscriptions for students
  if (targetUser.role?.toLowerCase() !== 'student') {
    return res.status(400).json({
      success: false,
      message: 'Can only override subscriptions for students',
    });
  }

  // Get current subscription
  const { data: currentSubscription } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', studentUserId)
    .maybeSingle();

  const oldStatus = currentSubscription?.status || 'inactive';
  let newStatus = active ? 'active' : 'inactive';
  let trialEndsAt = null;

  // Handle trial granting
  if (trialDays !== undefined && trialDays !== null) {
    // Granting trial - set trial_ends_at
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);
    trialEndsAt = trialEndDate.toISOString();
    newStatus = 'active'; // Trial grants active access
  }

  // Update or create subscription
  const subscriptionData = {
    user_id: studentUserId,
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  // Set trial_ends_at if granting trial
  if (trialEndsAt) {
    subscriptionData.trial_ends_at = trialEndsAt;
  }

  // If activating (or granting trial), set a default plan if none exists
  if ((active || trialEndsAt) && !currentSubscription?.plan_id) {
    // Get a default plan (one-time access)
    const { data: defaultPlan } = await supabaseAdmin
      .from('plans')
      .select('id')
      .eq('is_active', true)
      .eq('interval', 'one_time')
      .limit(1)
      .maybeSingle();

    if (defaultPlan) {
      subscriptionData.plan_id = defaultPlan.id;
      // For trials, set current_period_end to trial end; for regular activation, set far future
      subscriptionData.current_period_end = trialEndsAt || new Date('2099-12-31').toISOString();
    }
  } else if (currentSubscription?.plan_id) {
    subscriptionData.plan_id = currentSubscription.plan_id;
    // Preserve existing current_period_end unless granting trial
    subscriptionData.current_period_end = trialEndsAt || currentSubscription.current_period_end;
  }

  const { data: updatedSubscription, error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'user_id',
    })
    .select()
    .single();

  if (updateError) {
    logger.error('Subscription override error:', updateError);
    return res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
    });
  }

  // Log to subscription_audit table
  try {
    await supabaseAdmin
      .from('subscription_audit')
      .insert({
        actor_id: currentUserId,
        actor_role: actorRole,
        actor_name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email,
        target_id: studentUserId,
        target_name: `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim() || targetUser.email,
        old_status: oldStatus,
        new_status: newStatus,
        reason: reason || null,
        trial_days: trialDays || null,
        trial_ends_at: trialEndsAt,
        created_at: new Date().toISOString(),
      });
  } catch (auditError) {
    // Log error but don't fail the request
    logger.error('Failed to log subscription audit:', auditError);
  }

  const action = trialDays ? `granted ${trialDays}-day trial` : (active ? 'activated' : 'deactivated');
  logger.info(`User ${currentUserId} (${actorRole}) ${action} subscription for student ${studentUserId}`);

  res.json({
    success: true,
    data: {
      subscription: updatedSubscription,
      actor: {
        id: currentUserId,
        role: actorRole,
        name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email,
      },
    },
  });
});

