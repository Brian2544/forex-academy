-- Migration: Add role_audit table and update profiles role constraint
-- Run this in your Supabase SQL Editor

-- Create role_audit table for tracking role changes
CREATE TABLE IF NOT EXISTS role_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_role TEXT,
  new_role TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_role_audit_actor ON role_audit(actor_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_target ON role_audit(target_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_created ON role_audit(created_at DESC);

-- Update profiles table to support new roles
-- First, drop the existing constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with all supported roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN (
    'student',
    'admin',
    'super_admin',
    'owner',
    'content_admin',
    'support_admin',
    'finance_admin'
  ));

