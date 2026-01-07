-- Migration: Auto-create profiles on auth.users insert
-- This ensures every auth user automatically gets a profile row
-- Run this in your Supabase SQL Editor

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  is_owner_email BOOLEAN := false;
  owner_emails_list TEXT[];
  final_role TEXT := 'student';
BEGIN
  -- Get email from auth.users
  user_email := NEW.email;
  
  -- Check if email is in owner allowlist (from environment variable)
  -- Note: In production, this should be set via Supabase secrets or env vars
  -- For now, we'll check against a hardcoded list or use a settings table
  -- The backend will handle owner role assignment via bootstrap endpoint
  
  -- Insert profile with default role 'student'
  -- The backend bootstrap endpoint will upgrade to 'owner' if email is in allowlist
  INSERT INTO public.profiles (id, role, created_at, updated_at)
  VALUES (
    NEW.id,
    'student',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


