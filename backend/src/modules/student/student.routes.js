import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription.js';
import {
  getDashboard,
  getCourses,
  getCourse,
  getLessons,
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

// All content routes require active subscription
router.get('/courses', requireAuth, requireActiveSubscription, getCourses);
router.get('/courses/:id', requireAuth, requireActiveSubscription, getCourse);
router.get('/lessons', requireAuth, requireActiveSubscription, getLessons);
router.get('/live-classes', requireAuth, requireActiveSubscription, getLiveSessions);
router.get('/announcements', requireAuth, requireActiveSubscription, getAnnouncements);
router.get('/blog', requireAuth, requireActiveSubscription, getBlogPosts);
router.get('/blog/:id', requireAuth, requireActiveSubscription, getBlogPost);
router.get('/market-analysis', requireAuth, requireActiveSubscription, getMarketAnalysis);
router.get('/testimonials', requireAuth, requireActiveSubscription, getTestimonials);

export default router;

