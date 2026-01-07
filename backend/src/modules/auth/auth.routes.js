import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { register, bootstrapProfileHandler } from './auth.controller.js';

const router = express.Router();

// POST /auth/register - Register new user (public)
router.post('/register', register);

// POST /auth/bootstrap - Create or update user profile (requires auth)
router.post('/bootstrap', requireAuth, bootstrapProfileHandler);

export default router;

