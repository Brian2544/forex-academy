import axios from 'axios';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const mockTransactions = new Map();

const getSecretKey = () => {
  const envSecret = (process.env.PAYSTACK_SECRET_KEY || '').trim();
  return envSecret || config.paystack.secretKey;
};

// Check if Paystack is configured
const isPaystackConfigured = () => {
  const secretKey = getSecretKey();
  return !!(secretKey && secretKey !== 'your_paystack_secret_key_here');
};

export const paystack = {
  // Initialize transaction
  async initializeTransaction(data) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured. Please add PAYSTACK_SECRET_KEY to your .env file');
    }

    try {
      if (config.paystack.mockMode) {
        const reference = `mock_${Date.now()}`;
        mockTransactions.set(reference, {
          reference,
          amount: data.amount,
          currency: data.currency || 'NGN',
          status: 'success',
          metadata: data.metadata || {},
          paid_at: new Date().toISOString(),
        });
        return {
          status: true,
          data: {
            authorization_url: `https://paystack.com/pay/${reference}`,
            reference,
          },
        };
      }

      const payload = {
        amount: data.amount, // in kobo
        email: data.email,
        currency: data.currency || config.paystack.currency || 'KES',
        callback_url: data.callback_url,
        metadata: data.metadata,
      };

      if (Array.isArray(config.paystack.channels) && config.paystack.channels.length > 0) {
        payload.channels = config.paystack.channels;
      }

      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
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
      if (config.paystack.mockMode) {
        const transaction = mockTransactions.get(reference);
        if (!transaction) {
          return {
            status: false,
            message: 'Mock reference not found',
            data: { status: 'failed' },
          };
        }
        return {
          status: true,
          data: {
            reference,
            amount: transaction.amount,
            currency: transaction.currency,
            status: 'success',
            metadata: transaction.metadata,
            paid_at: transaction.paid_at,
          },
        };
      }

      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack verify error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create or get customer
  async createCustomer(email, firstName, lastName) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured');
    }

    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/customer`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      // If customer already exists, fetch it
      if (error.response?.status === 422) {
        const fetchResponse = await axios.get(
          `${PAYSTACK_BASE_URL}/customer/${email}`,
          {
            headers: {
              Authorization: `Bearer ${getSecretKey()}`,
            },
          }
        );
        return fetchResponse.data;
      }
      logger.error('Paystack create customer error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create subscription
  async createSubscription(customerCode, planCode) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured');
    }

    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/subscription`,
        {
          customer: customerCode,
          plan: planCode,
        },
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack create subscription error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get subscription
  async getSubscription(subscriptionCode) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured');
    }

    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/subscription/${subscriptionCode}`,
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack get subscription error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Disable subscription
  async disableSubscription(subscriptionCode, token) {
    if (!isPaystackConfigured()) {
      throw new Error('Paystack is not configured');
    }

    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/subscription/disable`,
        {
          code: subscriptionCode,
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${getSecretKey()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Paystack disable subscription error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if Paystack is configured
  isConfigured: isPaystackConfigured,
};

