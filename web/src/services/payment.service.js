import api from './api';
import { appEnv } from '../config/appEnv';

let cachedPublicKey = appEnv.paystackPublicKey || '';

export const paymentService = {
  initializeCoursePayment: async (courseId, courseLevel, courseTitle) => {
    if (!cachedPublicKey) {
      try {
        const keyResponse = await api.get('/payments/paystack/public-key');
        cachedPublicKey = keyResponse.data?.data?.publicKey || '';
      } catch (error) {
        cachedPublicKey = '';
      }
    }

    if (!cachedPublicKey && import.meta.env.DEV) {
      console.warn('[Paystack] Public key missing; proceeding with backend init.');
    }

    const response = await api.post('/payments/paystack/initialize', {
      courseId,
      courseLevel,
      courseTitle,
    });
    return response.data;
  },

  verifyCoursePayment: async (reference) => {
    const response = await api.get(`/payments/paystack/verify/${reference}`);
    return response.data;
  },

  getCourseEntitlements: async () => {
    const response = await api.get('/payments/paystack/entitlements');
    return response.data;
  },

  getPlans: async () => {
    const response = await api.get('/billing/plans');
    return response.data;
  },

  initiatePayment: async (planId) => {
    const response = await api.post('/billing/checkout', { planId });
    return response.data;
  },

  verifyPayment: async (reference) => {
    const response = await api.get(`/billing/verify?reference=${reference}`);
    return response.data;
  },

  getMySubscription: async () => {
    const response = await api.get('/billing/me');
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  getCurrentSubscription: async () => {
    const response = await api.get('/billing/me');
    return response.data;
  }
};

