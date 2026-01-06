import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getMe } from './users.controller.js';

const router = express.Router();

// GET /users/me - Get current user profile
router.get('/me', requireAuth, getMe);

export default router;

