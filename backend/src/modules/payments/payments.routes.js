import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getPlans, checkout } from './payments.controller.js';
import { handleWebhook } from './payments.webhook.js';

const router = express.Router();

// Public webhook endpoint (no auth)
// Paystack sends raw JSON, we need to capture it for signature verification
// Note: express.raw() is applied in app.js before express.json() for this route
// The handler will use the raw buffer for signature verification
router.post('/webhook', handleWebhook);

// GET /billing/plans - Get available plans
router.get('/plans', getPlans);

// POST /payments/checkout - Initialize payment
router.post('/checkout', requireAuth, checkout);

export default router;

