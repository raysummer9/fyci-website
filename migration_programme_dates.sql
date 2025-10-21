-- Migration: Add programme dates and update status options
-- Run this in your Supabase SQL editor or via CLI

-- Add start_date and end_date columns to programmes table
ALTER TABLE programmes 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Update the content_status enum to include new values
-- Add 'ongoing' and 'completed' to the existing content_status enum
-- Note: These commands may fail if the values already exist, which is expected

-- First, check if we need to add 'ongoing'
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'content_status'::regtype AND enumlabel = 'ongoing') THEN
        ALTER TYPE content_status ADD VALUE 'ongoing';
    END IF;
END $$;

-- Then, check if we need to add 'completed'
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'content_status'::regtype AND enumlabel = 'completed') THEN
        ALTER TYPE content_status ADD VALUE 'completed';
    END IF;
END $$;

-- Update the check constraint to include the new status values
-- Drop the existing constraint first
ALTER TABLE programmes DROP CONSTRAINT IF EXISTS valid_programme_status;

-- Add the updated constraint with new status values
ALTER TABLE programmes ADD CONSTRAINT valid_programme_status 
    CHECK (status IN ('draft', 'published', 'archived', 'ongoing', 'completed'));

-- Optional: Add indexes for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_programmes_start_date ON programmes(start_date);
CREATE INDEX IF NOT EXISTS idx_programmes_end_date ON programmes(end_date);
CREATE INDEX IF NOT EXISTS idx_programmes_status ON programmes(status);
