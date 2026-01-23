-- Migration: Add course payments and entitlements
-- Run this in Supabase SQL Editor

-- Ensure courses have pricing fields
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS price_ngn NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'NGN';

-- Set default pricing for existing courses if missing
UPDATE courses
SET price_ngn = CASE
  WHEN level = 'beginner' THEN 15000
  WHEN level = 'intermediate' THEN 30000
  WHEN level = 'advanced' THEN 50000
  ELSE 25000
END
WHERE price_ngn IS NULL;

UPDATE courses
SET currency = COALESCE(currency, 'NGN');

-- Create payments table if it doesn't exist (keeps existing columns)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  course_id UUID REFERENCES courses(id),
  email TEXT,
  reference TEXT UNIQUE NOT NULL,
  amount NUMERIC(10, 2),
  amount_kobo INTEGER,
  currency TEXT DEFAULT 'NGN',
  status TEXT NOT NULL,
  provider TEXT DEFAULT 'paystack',
  paid_at TIMESTAMPTZ,
  raw_event JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if payments table exists
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id),
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS raw_event JSONB;

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments(course_id);

-- Entitlements table for course access
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  activated_at TIMESTAMPTZ,
  source_payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_course_id ON entitlements(course_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON entitlements(active);

-- Enable RLS on entitlements
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- Users can read their own entitlements
CREATE POLICY "Users can read own entitlements" ON entitlements
  FOR SELECT USING (auth.uid() = user_id);

-- Ensure RLS on payments remains enabled and allow reads for owners
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments (if policy doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can read own payments'
  ) THEN
    CREATE POLICY "Users can read own payments" ON payments
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
