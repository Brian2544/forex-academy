import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // Get subscription status
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get app settings (WhatsApp URL)
  const { data: settings } = await supabaseAdmin
    .from('app_settings')
    .select('whatsapp_channel_url')
    .eq('id', 1)
    .maybeSingle();

  // Get counts (only if subscription is active)
  let counts = {
    new_lessons: 0,
    upcoming_classes: 0,
    announcements: 0,
  };

  let next_sessions = [];

  if (subscription?.status === 'active') {
    // Count new lessons (created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: lessonsCount } = await supabaseAdmin
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Count upcoming live sessions
    const { count: sessionsCount } = await supabaseAdmin
      .from('live_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', new Date().toISOString());

    // Count recent announcements
    const { count: announcementsCount } = await supabaseAdmin
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    counts = {
      new_lessons: lessonsCount || 0,
      upcoming_classes: sessionsCount || 0,
      announcements: announcementsCount || 0,
    };

    // Get next sessions
    const { data: sessions } = await supabaseAdmin
      .from('live_sessions')
      .select('id, title, scheduled_at')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5);

    next_sessions = sessions || [];
  }

  res.json({
    success: true,
    data: {
      access: subscription?.status || 'inactive',
      whatsapp_channel_url: settings?.whatsapp_channel_url || null,
      counts,
      next_sessions,
    },
  });
});

// Student content handlers (all require active subscription via middleware)
export const getCourses = asyncHandler(async (req, res) => {
  const { level } = req.query;
  let query = supabaseAdmin
    .from('courses')
    .select('*')
    .eq('is_active', true);

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  res.json({
    success: true,
    data,
  });
});

export const getLessons = asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  let query = supabaseAdmin
    .from('lessons')
    .select('*');

  if (courseId) {
    query = query.eq('course_id', courseId);
  }

  const { data, error } = await query.order('order_index', { ascending: true });

  if (error) {
    logger.error('Error fetching lessons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getLiveSessions = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('live_sessions')
    .select('*')
    .eq('is_active', true)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true });

  if (error) {
    logger.error('Error fetching live sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch live sessions',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getAnnouncements = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getBlogPosts = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching blog posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      message: 'Blog post not found',
    });
  }

  res.json({
    success: true,
    data,
  });
});

export const getMarketAnalysis = asyncHandler(async (req, res) => {
  const { type } = req.query;
  let query = supabaseAdmin
    .from('market_analysis')
    .select('*');

  if (type) {
    query = query.eq('analysis_type', type);
  }

  const { data, error } = await query.order('published_date', { ascending: false });

  if (error) {
    logger.error('Error fetching market analysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch market analysis',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching testimonials:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
    });
  }

  res.json({
    success: true,
    data: data || [],
  });
});

