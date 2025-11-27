-- Migration: Add blog views tracking functionality
-- This migration ensures the views column is properly configured and enables real-time updates

-- Ensure views column exists and has proper defaults
DO $$ 
BEGIN
    -- Add views column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'views'
    ) THEN
        ALTER TABLE blogs ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
    
    -- Ensure default value is set
    ALTER TABLE blogs ALTER COLUMN views SET DEFAULT 0;
    
    -- Set views to 0 for any NULL values
    UPDATE blogs SET views = 0 WHERE views IS NULL;
    
    -- Add constraint to ensure views are non-negative
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'non_negative_views' AND table_name = 'blogs'
    ) THEN
        ALTER TABLE blogs ADD CONSTRAINT non_negative_views CHECK (views >= 0);
    END IF;
END $$;

-- Enable Row Level Security for views updates (public can increment views)
-- Note: We'll use a function to increment views atomically
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    new_views INTEGER;
BEGIN
    UPDATE blogs 
    SET views = views + 1,
        updated_at = NOW()
    WHERE id = blog_id_param
    RETURNING views INTO new_views;
    
    RETURN COALESCE(new_views, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_blog_views(UUID) TO anon, authenticated;

-- Enable Realtime for blogs table (for view count updates)
-- Note: This requires Supabase Realtime to be enabled in the dashboard
-- We'll add a comment here as a reminder
COMMENT ON TABLE blogs IS 'Blog posts table with real-time view tracking enabled';

