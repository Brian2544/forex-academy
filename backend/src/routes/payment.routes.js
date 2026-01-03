const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/plans', paymentController.getPlans);

// Protected routes
router.post('/initiate', authMiddleware, paymentController.initiatePayment);
router.get('/verify', authMiddleware, paymentController.verifyPayment);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);
router.get('/subscription', authMiddleware, paymentController.getCurrentSubscription);

module.exports = router;

