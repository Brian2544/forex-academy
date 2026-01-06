import axios from 'axios';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Check if Paystack is configured
const isPaystackConfigured = () => {
  return !!(config.paystack.secretKey && config.paystack.secretKey !== 'your_paystack_secret_key_here');
};

export const paystack = {
  // Initialize transaction
  async initializeTransaction(data) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured. Please add PAYSTACK_SECRET_KEY to your .env file');
    }

    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          amount: data.amount, // in kobo
          email: data.email,
          currency: 'USD',
          callback_url: data.callback_url,
          metadata: data.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack initialize error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify transaction
  async verifyTransaction(reference) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured');
    }

    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack verify error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if Paystack is configured
  isConfigured: isPaystackConfigured,
};

