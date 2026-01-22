import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this file (ES module way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory (one level up from src/config)
dotenv.config({ path: join(__dirname, '..', '..', '.env') });
// Optionally load local.env for machine-specific secrets
dotenv.config({ path: join(__dirname, '..', 'config', 'local.env') });

// Ensure OWNER_EMAILS is available (don't crash if absent)
const ownerEmails = process.env.OWNER_EMAILS || '';

export const config = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY, // Fallback to secret key if webhook secret not set
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

