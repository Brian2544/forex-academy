import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  updateUserRole,
  updateSettings,
  coursesHandlers,
  lessonsHandlers,
  liveSessionsHandlers,
  announcementsHandlers,
  blogPostsHandlers,
  marketAnalysisHandlers,
  testimonialsHandlers,
} from './admin.controller.js';

const router = express.Router();

// All admin routes require auth and admin/owner role
router.use(requireAuth);
router.use(requireRole('admin', 'owner'));

// Role management (owner only)
router.post('/users/:id/role', requireRole('owner'), updateUserRole);

// Settings
router.patch('/settings', updateSettings);

// Courses CRUD
router.get('/courses', coursesHandlers.list);
router.get('/courses/:id', coursesHandlers.get);
router.post('/courses', coursesHandlers.create);
router.patch('/courses/:id', coursesHandlers.update);
router.delete('/courses/:id', coursesHandlers.delete);

// Lessons CRUD
router.get('/lessons', lessonsHandlers.list);
router.get('/lessons/:id', lessonsHandlers.get);
router.post('/lessons', lessonsHandlers.create);
router.patch('/lessons/:id', lessonsHandlers.update);
router.delete('/lessons/:id', lessonsHandlers.delete);

// Live Sessions CRUD
router.get('/live-sessions', liveSessionsHandlers.list);
router.get('/live-sessions/:id', liveSessionsHandlers.get);
router.post('/live-sessions', liveSessionsHandlers.create);
router.patch('/live-sessions/:id', liveSessionsHandlers.update);
router.delete('/live-sessions/:id', liveSessionsHandlers.delete);

// Announcements CRUD
router.get('/announcements', announcementsHandlers.list);
router.get('/announcements/:id', announcementsHandlers.get);
router.post('/announcements', announcementsHandlers.create);
router.patch('/announcements/:id', announcementsHandlers.update);
router.delete('/announcements/:id', announcementsHandlers.delete);

// Blog Posts CRUD
router.get('/blog-posts', blogPostsHandlers.list);
router.get('/blog-posts/:id', blogPostsHandlers.get);
router.post('/blog-posts', blogPostsHandlers.create);
router.patch('/blog-posts/:id', blogPostsHandlers.update);
router.delete('/blog-posts/:id', blogPostsHandlers.delete);

// Market Analysis CRUD
router.get('/market-analysis', marketAnalysisHandlers.list);
router.get('/market-analysis/:id', marketAnalysisHandlers.get);
router.post('/market-analysis', marketAnalysisHandlers.create);
router.patch('/market-analysis/:id', marketAnalysisHandlers.update);
router.delete('/market-analysis/:id', marketAnalysisHandlers.delete);

// Testimonials CRUD
router.get('/testimonials', testimonialsHandlers.list);
router.get('/testimonials/:id', testimonialsHandlers.get);
router.post('/testimonials', testimonialsHandlers.create);
router.patch('/testimonials/:id', testimonialsHandlers.update);
router.delete('/testimonials/:id', testimonialsHandlers.delete);

export default router;

