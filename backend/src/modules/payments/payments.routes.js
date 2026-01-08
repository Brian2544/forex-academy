import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getPlans, checkout, verify, getMySubscription } from './payments.controller.js';
import { handleWebhook } from './payments.webhook.js';

const router = express.Router();

// Public webhook endpoint (no auth)
// Paystack sends raw JSON, we need to capture it for signature verification
// Note: express.raw() is applied in app.js before express.json() for this route
// The handler will use the raw buffer for signature verification
router.post('/webhook', handleWebhook);

// GET /billing/plans - Get available plans
router.get('/plans', getPlans);

// GET /billing/me - Get current user subscription
router.get('/me', requireAuth, getMySubscription);

// GET /billing/verify - Verify transaction after callback
router.get('/verify', requireAuth, verify);

// POST /payments/checkout - Initialize payment/subscription
router.post('/checkout', requireAuth, checkout);

export default router;

