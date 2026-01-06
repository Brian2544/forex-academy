import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { requireActiveSubscription } from '../../middleware/requireActiveSubscription.js';
import {
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
router.post('/admin/groups', requireAuth, requireRole('admin', 'owner'), createGroup);
router.patch('/admin/groups/:id', requireAuth, requireRole('admin', 'owner'), updateGroup);
router.delete('/admin/groups/:id', requireAuth, requireRole('admin', 'owner'), deleteGroup);
router.post('/admin/groups/:id/members', requireAuth, requireRole('admin', 'owner'), addMember);
router.delete('/admin/groups/:id/members/:userId', requireAuth, requireRole('admin', 'owner'), removeMember);

// Student routes (require active subscription)
router.get('/groups', requireAuth, requireActiveSubscription, getMyGroups);
router.get('/groups/:id/messages', requireAuth, requireActiveSubscription, getMessages);
router.post('/groups/:id/messages', requireAuth, requireActiveSubscription, sendMessage);

export default router;

