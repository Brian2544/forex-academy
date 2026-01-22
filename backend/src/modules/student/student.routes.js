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

// GET /student/access - Get subscription status
router.get('/access', requireAuth, async (req, res) => {
  const { supabaseAdmin } = await import('../../config/supabaseAdmin.js');
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, plan_id')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  res.json({
    success: true,
    data: {
      access: subscription?.status || 'inactive',
      subscription,
    },
  });
});

// All content routes - subscription requirement removed (payment integration on hold)
// All courses and content are now accessible to authenticated users
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

