import api from './api';

export const paymentService = {
  getPlans: async () => {
    const response = await api.get('/payments/plans');
    return response.data;
  },

  initiatePayment: async (plan) => {
    const response = await api.post('/payments/initiate', { plan });
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  getCurrentSubscription: async () => {
    const response = await api.get('/payments/subscription');
    return response.data;
  }
};

