-- Add missing columns for lessons
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
