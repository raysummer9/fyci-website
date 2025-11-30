-- Migration: Add blog_categories junction table for many-to-many relationship
-- This allows blogs to be assigned to multiple categories

-- Create blog_categories junction table (similar to blog_tags)
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, category_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_categories_blog_id ON blog_categories(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_category_id ON blog_categories(category_id);

-- Migrate existing data: Copy category_id from blogs to blog_categories
INSERT INTO blog_categories (blog_id, category_id)
SELECT id, category_id
FROM blogs
WHERE category_id IS NOT NULL
ON CONFLICT (blog_id, category_id) DO NOTHING;

-- Add RLS policies for blog_categories
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read blog_categories (for public access)
CREATE POLICY "Public can read blog_categories"
ON blog_categories
FOR SELECT
TO public
USING (true);

-- Policy: Admins and editors can manage blog_categories
CREATE POLICY "Admins and editors can manage blog_categories"
ON blog_categories
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'editor')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'editor')
  )
);

