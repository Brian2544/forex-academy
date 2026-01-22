import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  updateUserRole,
  getSettings,
  updateSettings,
  coursesHandlers,
  lessonsHandlers,
  resourcesHandlers,
  liveSessionsHandlers,
  announcementsHandlers,
  blogPostsHandlers,
  marketAnalysisHandlers,
  testimonialsHandlers,
  ensureStorageBucket,
  uploadResourceFile,
  overrideSubscription,
  getStudents,
  getStudentById,
} from './admin.controller.js';

const router = express.Router();

// All admin routes require auth and admin roles (including new admin types)
router.use(requireAuth);
router.use(requireRole('admin', 'super_admin', 'owner', 'content_admin', 'support_admin', 'finance_admin'));

// Role management (owner, super_admin) - kept for backwards compatibility
// Note: New implementations should use /owner/users/:id/role
router.post('/users/:id/role', requireRole('owner', 'super_admin'), updateUserRole);

// Subscription override (owner, admin, super_admin)
router.post('/subscription/override/:studentUserId', requireRole('owner', 'admin', 'super_admin'), overrideSubscription);

// Students management
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);

// Settings
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

// Storage
router.post('/storage/bucket', ensureStorageBucket);
router.post('/resources/upload', express.raw({ type: '*/*', limit: '100mb' }), uploadResourceFile);

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

// Resources CRUD
router.get('/resources', resourcesHandlers.list);
router.get('/resources/:id', resourcesHandlers.get);
router.post('/resources', resourcesHandlers.create);
router.patch('/resources/:id', resourcesHandlers.update);
router.delete('/resources/:id', resourcesHandlers.delete);

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

