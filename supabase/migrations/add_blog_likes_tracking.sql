-- Migration: Add blog likes tracking functionality
-- This migration creates a table to track individual likes and functions to handle like/unlike

-- Create blog_likes table to track which users have liked which posts
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    guest_id TEXT, -- For anonymous users, store a unique identifier (e.g., from localStorage)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, user_id), -- One like per authenticated user per blog
    UNIQUE(blog_id, guest_id), -- One like per guest user per blog
    CHECK (
        (user_id IS NOT NULL AND guest_id IS NULL) OR 
        (user_id IS NULL AND guest_id IS NOT NULL)
    ) -- Must have either user_id or guest_id, but not both
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_guest_id ON blog_likes(guest_id);

-- Function to toggle like (like if not liked, unlike if liked)
CREATE OR REPLACE FUNCTION toggle_blog_like(
    blog_id_param UUID,
    user_id_param UUID DEFAULT NULL,
    guest_id_param TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    existing_like RECORD;
    new_likes_count INTEGER;
    is_liked BOOLEAN;
BEGIN
    -- Validate input
    IF (user_id_param IS NULL AND guest_id_param IS NULL) THEN
        RAISE EXCEPTION 'Either user_id or guest_id must be provided';
    END IF;

    -- Check if like already exists
    IF user_id_param IS NOT NULL THEN
        SELECT * INTO existing_like 
        FROM blog_likes 
        WHERE blog_id = blog_id_param AND user_id = user_id_param;
    ELSE
        SELECT * INTO existing_like 
        FROM blog_likes 
        WHERE blog_id = blog_id_param AND guest_id = guest_id_param;
    END IF;

    -- Toggle like
    IF existing_like IS NULL THEN
        -- Like: Insert new like
        INSERT INTO blog_likes (blog_id, user_id, guest_id)
        VALUES (blog_id_param, user_id_param, guest_id_param);
        
        -- Increment likes count
        UPDATE blogs 
        SET likes = likes + 1,
            updated_at = NOW()
        WHERE id = blog_id_param
        RETURNING likes INTO new_likes_count;
        
        is_liked := TRUE;
    ELSE
        -- Unlike: Delete existing like
        DELETE FROM blog_likes 
        WHERE id = existing_like.id;
        
        -- Decrement likes count
        UPDATE blogs 
        SET likes = GREATEST(likes - 1, 0), -- Ensure it doesn't go below 0
            updated_at = NOW()
        WHERE id = blog_id_param
        RETURNING likes INTO new_likes_count;
        
        is_liked := FALSE;
    END IF;

    -- Return result
    RETURN json_build_object(
        'likes', COALESCE(new_likes_count, 0),
        'is_liked', is_liked
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a blog
CREATE OR REPLACE FUNCTION check_blog_like(
    blog_id_param UUID,
    user_id_param UUID DEFAULT NULL,
    guest_id_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    IF user_id_param IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM blog_likes 
            WHERE blog_id = blog_id_param AND user_id = user_id_param
        ) INTO like_exists;
    ELSIF guest_id_param IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM blog_likes 
            WHERE blog_id = blog_id_param AND guest_id = guest_id_param
        ) INTO like_exists;
    ELSE
        RETURN FALSE;
    END IF;

    RETURN COALESCE(like_exists, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION toggle_blog_like(UUID, UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_blog_like(UUID, UUID, TEXT) TO anon, authenticated;

-- Enable RLS on blog_likes table
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert likes (for both authenticated and anonymous users)
CREATE POLICY "Anyone can like blogs" ON blog_likes
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Anyone can delete their own likes
CREATE POLICY "Users can delete their own likes" ON blog_likes
    FOR DELETE
    TO public
    USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        (auth.uid() IS NULL AND guest_id IS NOT NULL)
    );

-- Policy: Anyone can read likes (for checking if they've liked)
CREATE POLICY "Anyone can read likes" ON blog_likes
    FOR SELECT
    TO public
    USING (true);

-- Ensure likes column has proper defaults and constraints
DO $$ 
BEGIN
    -- Set likes to 0 for any NULL values
    UPDATE blogs SET likes = 0 WHERE likes IS NULL;
    
    -- Add constraint to ensure likes are non-negative
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'non_negative_likes' AND table_name = 'blogs'
    ) THEN
        ALTER TABLE blogs ADD CONSTRAINT non_negative_likes CHECK (likes >= 0);
    END IF;
END $$;

