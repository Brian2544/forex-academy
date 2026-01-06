import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  },
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
};

// Validate required env vars (Paystack is optional for now)
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.warn(`⚠️  Missing required environment variables: ${missing.join(', ')}`);
}

// Warn about Paystack if not configured (but don't block startup)
if (!process.env.PAYSTACK_SECRET_KEY || !process.env.PAYSTACK_WEBHOOK_SECRET) {
  console.warn(`ℹ️  Paystack keys not configured - payment features will be disabled until configured`);
}

