-- Migration: Add trial support to subscriptions table
-- Run this in your Supabase SQL Editor

-- Add trial_ends_at column to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Create index for faster trial expiry queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_ends_at ON subscriptions(trial_ends_at);

-- Update subscription_audit to track trial grants
ALTER TABLE subscription_audit
ADD COLUMN IF NOT EXISTS trial_days INTEGER,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

