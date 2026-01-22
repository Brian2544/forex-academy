import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
// requireActiveSubscription middleware kept for future payment integration
// import { requireActiveSubscription } from '../../middleware/requireActiveSubscription.js';
import {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  getMyGroups,
  getMessages,
  sendMessage,
} from './chat.controller.js';

const router = express.Router();

// Admin routes
router.get('/admin/groups', requireAuth, requireRole('admin', 'owner'), getAllGroups);
router.post('/admin/groups', requireAuth, requireRole('admin', 'owner'), createGroup);
router.patch('/admin/groups/:id', requireAuth, requireRole('admin', 'owner'), updateGroup);
router.delete('/admin/groups/:id', requireAuth, requireRole('admin', 'owner'), deleteGroup);
router.post('/admin/groups/:id/members', requireAuth, requireRole('admin', 'owner'), addMember);
router.delete('/admin/groups/:id/members/:userId', requireAuth, requireRole('admin', 'owner'), removeMember);

// Student routes - subscription requirement removed (payment integration on hold)
// All chat features are now accessible to authenticated users
router.get('/groups', requireAuth, getMyGroups);
router.get('/groups/:id/messages', requireAuth, getMessages);
router.post('/groups/:id/messages', requireAuth, sendMessage);

export default router;

