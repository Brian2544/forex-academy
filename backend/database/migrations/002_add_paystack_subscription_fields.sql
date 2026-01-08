-- Migration: Add Paystack subscription fields for auto-renew
-- Run this in Supabase SQL Editor

-- Add Paystack plan codes to plans table
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS paystack_plan_code_test TEXT,
ADD COLUMN IF NOT EXISTS paystack_plan_code_live TEXT;

-- Add Paystack customer and subscription codes to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_paystack_customer_code ON subscriptions(paystack_customer_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paystack_subscription_code ON subscriptions(paystack_subscription_code);

-- Optional: Create payments table for transaction history
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  reference TEXT UNIQUE NOT NULL,
  amount_kobo INTEGER NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT NOT NULL,
  provider TEXT DEFAULT 'paystack',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

