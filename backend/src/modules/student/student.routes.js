import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
// requireActiveSubscription middleware kept for future payment integration
// import { requireActiveSubscription } from '../../middleware/requireActiveSubscription.js';
import {
  getDashboard,
  getCourses,
  getCourse,
  getLessons,
  getResources,
  getLiveSessions,
  getAnnouncements,
  getBlogPosts,
  getBlogPost,
  getMarketAnalysis,
  getTestimonials,
} from './student.controller.js';

const router = express.Router();

// GET /student/dashboard - Get dashboard data (no subscription required)
router.get('/dashboard', requireAuth, getDashboard);

// GET /student/access - Get subscription status and course access
router.get('/access', requireAuth, async (req, res) => {
  const { supabaseAdmin } = await import('../../config/supabaseAdmin.js');
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', req.userId)
    .maybeSingle();
  const userRole = profile?.role?.toLowerCase();
  const isAdmin = ['admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin'].includes(userRole);

  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, plan_id')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date().toISOString();
  const { data: entitlements } = await supabaseAdmin
    .from('entitlements')
    .select('course_id, active, activated_at, status, expires_at')
    .eq('user_id', req.userId)
    .eq('active', true);

  const activeEntitlements = (entitlements || [])
    .filter((ent) => ent.status !== 'expired')
    .filter((ent) => !ent.expires_at || ent.expires_at > now);

  const hasCourseAccess = isAdmin || activeEntitlements.length > 0;

  res.json({
    success: true,
    data: {
      access: hasCourseAccess ? 'active' : (subscription?.status || 'inactive'),
      subscription,
      entitlements: activeEntitlements,
      courseAccess: hasCourseAccess,
    },
  });
});

// All content routes - course access enforced in controllers
router.get('/courses', requireAuth, getCourses);
router.get('/courses/:id', requireAuth, getCourse);
router.get('/lessons', requireAuth, getLessons);
router.get('/resources', requireAuth, getResources);
router.get('/live-classes', requireAuth, getLiveSessions);
router.get('/announcements', requireAuth, getAnnouncements);
router.get('/blog', requireAuth, getBlogPosts);
router.get('/blog/:id', requireAuth, getBlogPost);
router.get('/market-analysis', requireAuth, getMarketAnalysis);
router.get('/testimonials', requireAuth, getTestimonials);

export default router;

