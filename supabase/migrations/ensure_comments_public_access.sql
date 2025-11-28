-- Migration: Ensure comments have proper public access for submission and viewing
-- This migration ensures RLS policies allow public comment submission and viewing of approved comments

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read approved comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- Public read access to approved comments on published blogs only
CREATE POLICY "Public read approved comments" ON comments
    FOR SELECT 
    TO public
    USING (
        is_approved = true AND 
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE blogs.id = comments.blog_id 
            AND blogs.status = 'published'
        )
    );

-- Anyone can insert comments (they require approval by default)
CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Ensure is_approved defaults to false
ALTER TABLE comments ALTER COLUMN is_approved SET DEFAULT false;

-- Ensure author_name is required
ALTER TABLE comments ALTER COLUMN author_name SET NOT NULL;

