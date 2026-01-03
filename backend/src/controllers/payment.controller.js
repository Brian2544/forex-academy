const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Payment plans configuration
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      'Beginner course access',
      'Limited videos',
      'Community access',
      'FAQs'
    ]
  },
  monthly: {
    name: 'Monthly Subscription',
    price: 29.99,
    currency: 'USD',
    features: [
      'Intermediate & Advanced courses',
      'Strategy library',
      'Recorded live classes',
      'Certificates',
      'Full community access'
    ]
  },
  premium: {
    name: 'Premium',
    price: 99.99,
    currency: 'USD',
    features: [
      'All Monthly features',
      'Live signals',
      'Trade explanations',
      'Mentorship sessions',
      'Priority support'
    ]
  },
  lifetime: {
    name: 'Lifetime Access',
    price: 499.99,
    currency: 'USD',
    features: [
      'All Premium features',
      'Lifetime access',
      'Future updates included',
      'Exclusive content'
    ]
  }
};

// Get all payment plans
const getPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        plans: PLANS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
      error: error.message
    });
  }
};

// Initiate payment
const initiatePayment = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const selectedPlan = PLANS[plan];

    if (plan === 'free') {
      // Free plan - activate immediately
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: 'free',
          subscriptionStatus: 'active'
        }
      });

      return res.json({
        success: true,
        data: {
          message: 'Free plan activated',
          plan: 'free'
        }
      });
    }

    // For paid plans, create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        plan,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        status: 'pending',
        paymentMethod: 'paypal' // Default to PayPal
      }
    });

    // In production, integrate with PayPal SDK here
    // For now, return a payment link structure
    const paymentLink = `${process.env.FRONTEND_URL}/payment/process?paymentId=${payment.id}&plan=${plan}`;

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        paymentLink,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        plan
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
};

// Verify payment (callback from PayPal)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment || payment.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // In production, verify with PayPal API
    // For now, mark as completed
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        transactionId: transactionId || 'test-transaction',
        completedAt: new Date()
      }
    });

    // Update user subscription
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: payment.plan,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: payment.plan === 'lifetime' 
          ? null 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for monthly/premium
      }
    });

    res.json({
      success: true,
      data: {
        message: 'Payment verified and subscription activated'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        payments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

// Get current subscription
const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true
      }
    });

    res.json({
      success: true,
      data: {
        plan: user.subscriptionPlan || 'free',
        status: user.subscriptionStatus || 'inactive',
        expiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message
    });
  }
};

module.exports = {
  getPlans,
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  getCurrentSubscription
};

