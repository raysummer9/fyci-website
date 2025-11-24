-- Migration: Add 'ongoing' and 'completed' statuses to content_status enum
-- This migration extends the content_status enum to support programmes and other content
-- that can be in 'ongoing' or 'completed' states while still being visible on the website
-- 
-- Date: 2024
-- Purpose: Fix bug where programmes/competitions marked as 'completed' disappear from homepage

DO $$ 
BEGIN
    -- Add 'ongoing' status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'ongoing' 
        AND enumtypid = 'content_status'::regtype
    ) THEN
        ALTER TYPE content_status ADD VALUE 'ongoing';
    END IF;

    -- Add 'completed' status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'completed' 
        AND enumtypid = 'content_status'::regtype
    ) THEN
        ALTER TYPE content_status ADD VALUE 'completed';
    END IF;
END $$;

-- Verify the enum values were added
-- You can run this query to see all content_status enum values:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'content_status'::regtype ORDER BY enumsortorder;

