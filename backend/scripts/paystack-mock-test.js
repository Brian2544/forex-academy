/**
 * Lightweight Paystack mock test
 * Run: PAYSTACK_MOCK_MODE=true node scripts/paystack-mock-test.js
 */

import { paystack } from '../src/config/paystack.js';

const runMockTest = async () => {
  if (!paystack.isConfigured()) {
    console.error('❌ Paystack is not configured. Set PAYSTACK_SECRET_KEY.');
    process.exit(1);
  }

  if (process.env.PAYSTACK_MOCK_MODE !== 'true') {
    console.error('❌ PAYSTACK_MOCK_MODE must be true for this test.');
    process.exit(1);
  }

  const init = await paystack.initializeTransaction({
    amount: 25000 * 100,
    email: 'test@example.com',
    currency: 'NGN',
    callback_url: 'http://localhost:5173/payments/status',
    metadata: {
      user_id: 'mock-user',
      course_id: 'mock-course',
      email: 'test@example.com',
    },
  });

  if (!init?.data?.authorization_url || !init?.data?.reference) {
    console.error('❌ Initialize transaction failed:', init);
    process.exit(1);
  }

  const verify = await paystack.verifyTransaction(init.data.reference);

  if (!verify?.status || verify?.data?.status !== 'success') {
    console.error('❌ Verify transaction failed:', verify);
    process.exit(1);
  }

  console.log('✅ Paystack mock test passed');
  console.log('authorization_url:', init.data.authorization_url);
  console.log('reference:', init.data.reference);
};

runMockTest().catch((error) => {
  console.error('❌ Paystack mock test error:', error.message || error);
  process.exit(1);
});
