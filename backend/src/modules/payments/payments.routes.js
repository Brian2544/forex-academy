import express from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { getPlans, checkout, verify, getMySubscription, initializeCoursePayment, verifyCoursePayment, getMyEntitlements, getPaystackPublicKey } from './payments.controller.js';
import { handleWebhook, handleCoursePaymentWebhook } from './payments.webhook.js';

const router = express.Router();

// Public webhook endpoint (no auth)
// Paystack sends raw JSON, we need to capture it for signature verification
// Note: express.raw() is applied in app.js before express.json() for this route
// The handler will use the raw buffer for signature verification
router.post('/webhook', handleWebhook);
router.post('/paystack/webhook', handleCoursePaymentWebhook);

// GET /billing/plans - Get available plans
router.get('/plans', getPlans);

// GET /billing/me - Get current user subscription
router.get('/me', requireAuth, getMySubscription);

// GET /billing/verify - Verify transaction after callback
router.get('/verify', requireAuth, verify);

// POST /payments/checkout - Initialize payment/subscription
router.post('/checkout', requireAuth, checkout);

// Paystack course payments
router.post('/paystack/initialize', requireAuth, initializeCoursePayment);
router.get('/paystack/verify/:reference', requireAuth, verifyCoursePayment);
router.get('/paystack/entitlements', requireAuth, getMyEntitlements);
router.get('/paystack/public-key', getPaystackPublicKey);

export default router;

