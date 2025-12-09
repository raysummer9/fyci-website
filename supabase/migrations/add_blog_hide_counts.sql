-- Migration: Add hide_counts field to blogs table
-- This allows admins to control whether views, likes, and comment counts are displayed on a blog post

-- Add hide_counts column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'hide_counts'
    ) THEN
        ALTER TABLE blogs ADD COLUMN hide_counts BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN blogs.hide_counts IS 'If true, views, likes, and comment counts will be hidden on the blog post';

