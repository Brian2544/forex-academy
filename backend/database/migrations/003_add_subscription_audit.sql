-- Migration: Add subscription_audit table for tracking subscription overrides
-- Run this in your Supabase SQL Editor

-- Create subscription_audit table for tracking subscription status changes by admins/owners
CREATE TABLE IF NOT EXISTS subscription_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_role TEXT NOT NULL,
  actor_name TEXT,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_name TEXT,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscription_audit_actor ON subscription_audit(actor_id);
CREATE INDEX IF NOT EXISTS idx_subscription_audit_target ON subscription_audit(target_id);
CREATE INDEX IF NOT EXISTS idx_subscription_audit_created ON subscription_audit(created_at DESC);

