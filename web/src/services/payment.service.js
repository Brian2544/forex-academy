import api from './api';

export const paymentService = {
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

