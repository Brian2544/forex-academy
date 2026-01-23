-- Migration: Add entitlement expiry tracking

ALTER TABLE entitlements
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at ON entitlements(expires_at);
