import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { getUsers, updateUserRole } from './owner.controller.js';

const router = express.Router();

// All owner routes require auth
router.use(requireAuth);

// GET /owner/users - List users (owner, super_admin, finance_admin)
router.get('/users', requireRole('owner', 'super_admin', 'finance_admin'), getUsers);

// POST /owner/users/:id/role - Update user role (owner, super_admin)
router.post('/users/:id/role', requireRole('owner', 'super_admin'), updateUserRole);

export default router;

