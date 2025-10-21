-- Enhanced Row Level Security (RLS) Policies
-- This script enforces strict permissions as requested:
-- - Public users can read only published items
-- - Admins (role='admin') can read/write everything  
-- - Authors (role='author') can modify only their own blog posts

-- ==============================================
-- DROP EXISTING POLICIES TO AVOID CONFLICTS
-- ==============================================

-- Drop ALL existing policies to avoid conflicts
-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile and public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything with profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Only admins can insert profiles" ON profiles;

-- Programme areas policies
DROP POLICY IF EXISTS "Public read access for active programme areas" ON programme_areas;
DROP POLICY IF EXISTS "Public read active programme areas" ON programme_areas;
DROP POLICY IF EXISTS "Admins and editors full access to programme areas" ON programme_areas;
DROP POLICY IF EXISTS "Only admins can manage programme areas" ON programme_areas;

-- Programmes policies
DROP POLICY IF EXISTS "Public read access for published programmes" ON programmes;
DROP POLICY IF EXISTS "Public read published programmes" ON programmes;
DROP POLICY IF EXISTS "Admins and editors full access to programmes" ON programmes;
DROP POLICY IF EXISTS "Authors can manage own programmes" ON programmes;
DROP POLICY IF EXISTS "Only admins can manage programmes" ON programmes;

-- Competitions policies
DROP POLICY IF EXISTS "Public read access for competitions" ON competitions;
DROP POLICY IF EXISTS "Public read active competitions" ON competitions;
DROP POLICY IF EXISTS "Admins and editors full access to competitions" ON competitions;
DROP POLICY IF EXISTS "Authors can manage own competitions" ON competitions;
DROP POLICY IF EXISTS "Only admins can manage competitions" ON competitions;

-- Events policies
DROP POLICY IF EXISTS "Public read access for events" ON events;
DROP POLICY IF EXISTS "Public read active events" ON events;
DROP POLICY IF EXISTS "Admins and editors full access to events" ON events;
DROP POLICY IF EXISTS "Authors can manage own events" ON events;
DROP POLICY IF EXISTS "Only admins can manage events" ON events;

-- Categories policies
DROP POLICY IF EXISTS "Public read access to categories" ON categories;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;

-- Tags policies
DROP POLICY IF EXISTS "Public read access to tags" ON tags;
DROP POLICY IF EXISTS "Public read tags" ON tags;
DROP POLICY IF EXISTS "Admins and editors can manage tags" ON tags;
DROP POLICY IF EXISTS "Only admins can manage tags" ON tags;

-- Blogs policies
DROP POLICY IF EXISTS "Public read access for published blogs" ON blogs;
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
DROP POLICY IF EXISTS "Admins and editors full access to blogs" ON blogs;
DROP POLICY IF EXISTS "Authors can manage own blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can manage all blogs" ON blogs;
DROP POLICY IF EXISTS "Authors can read own blogs" ON blogs;
DROP POLICY IF EXISTS "Authors can create blogs" ON blogs;
DROP POLICY IF EXISTS "Authors can update own blogs" ON blogs;
DROP POLICY IF EXISTS "Authors can delete own blogs" ON blogs;

-- Blog tags policies
DROP POLICY IF EXISTS "Public read access to blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Public read blog tags for published blogs" ON blog_tags;
DROP POLICY IF EXISTS "Admins and editors can manage blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Authors can manage blog tags for own blogs" ON blog_tags;
DROP POLICY IF EXISTS "Admins can manage all blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Authors can manage own blog tags" ON blog_tags;

-- Comments policies
DROP POLICY IF EXISTS "Public read access to approved comments" ON comments;
DROP POLICY IF EXISTS "Public read approved comments" ON comments;
DROP POLICY IF EXISTS "Admins and editors full access to comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Authors can manage comments on own blogs" ON comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON comments;
DROP POLICY IF EXISTS "Authors can manage own blog comments" ON comments;

-- Publication categories policies
DROP POLICY IF EXISTS "Public read access to publication categories" ON publication_categories;
DROP POLICY IF EXISTS "Public read publication categories" ON publication_categories;
DROP POLICY IF EXISTS "Admins and editors can manage publication categories" ON publication_categories;
DROP POLICY IF EXISTS "Only admins can manage publication categories" ON publication_categories;

-- Publications policies
DROP POLICY IF EXISTS "Public read access for published publications" ON publications;
DROP POLICY IF EXISTS "Public read published publications" ON publications;
DROP POLICY IF EXISTS "Admins and editors full access to publications" ON publications;
DROP POLICY IF EXISTS "Authors can manage own publications" ON publications;
DROP POLICY IF EXISTS "Only admins can manage publications" ON publications;

-- Roles policies
DROP POLICY IF EXISTS "Only admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;

-- ==============================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- ==============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is author
CREATE OR REPLACE FUNCTION is_author()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'author'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin or editor
CREATE OR REPLACE FUNCTION is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is the owner of a blog
CREATE OR REPLACE FUNCTION is_blog_owner(blog_created_by UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = blog_created_by;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can update their role
CREATE OR REPLACE FUNCTION can_update_role(new_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    current_role TEXT;
BEGIN
    -- Get current role
    SELECT role INTO current_role FROM profiles WHERE id = auth.uid();
    
    -- Allow if role hasn't changed or if user is admin
    RETURN (new_role = current_role) OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- PROFILES POLICIES
-- ==============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND 
        -- Only admins can change roles
        can_update_role(role)
    );

-- Only admins can insert new profiles (user creation handled by auth trigger)
CREATE POLICY "Only admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (is_admin());

-- Admins can do everything with profiles
CREATE POLICY "Admins can manage all profiles" ON profiles
    FOR ALL USING (is_admin());

-- ==============================================
-- PROGRAMME AREAS POLICIES
-- ==============================================

-- Public read access for active programme areas only
CREATE POLICY "Public read active programme areas" ON programme_areas
    FOR SELECT USING (is_active = true);

-- Only admins can manage programme areas
CREATE POLICY "Only admins can manage programme areas" ON programme_areas
    FOR ALL USING (is_admin());

-- ==============================================
-- PROGRAMMES POLICIES
-- ==============================================

-- Public read access for published programmes only
CREATE POLICY "Public read published programmes" ON programmes
    FOR SELECT USING (status = 'published');

-- Only admins can manage programmes
CREATE POLICY "Only admins can manage programmes" ON programmes
    FOR ALL USING (is_admin());

-- ==============================================
-- COMPETITIONS POLICIES
-- ==============================================

-- Public read access for open and completed competitions only
CREATE POLICY "Public read active competitions" ON competitions
    FOR SELECT USING (status IN ('open', 'judging', 'completed'));

-- Only admins can manage competitions
CREATE POLICY "Only admins can manage competitions" ON competitions
    FOR ALL USING (is_admin());

-- ==============================================
-- EVENTS POLICIES
-- ==============================================

-- Public read access for upcoming and ongoing events only
CREATE POLICY "Public read active events" ON events
    FOR SELECT USING (status IN ('upcoming', 'ongoing', 'completed'));

-- Only admins can manage events
CREATE POLICY "Only admins can manage events" ON events
    FOR ALL USING (is_admin());

-- ==============================================
-- CATEGORIES POLICIES
-- ==============================================

-- Public read access to categories
CREATE POLICY "Public read categories" ON categories
    FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (is_admin());

-- ==============================================
-- TAGS POLICIES
-- ==============================================

-- Public read access to tags
CREATE POLICY "Public read tags" ON tags
    FOR SELECT USING (true);

-- Only admins can manage tags
CREATE POLICY "Only admins can manage tags" ON tags
    FOR ALL USING (is_admin());

-- ==============================================
-- BLOGS POLICIES (SPECIAL CASE FOR AUTHORS)
-- ==============================================

-- Public read access for published blogs only
CREATE POLICY "Public read published blogs" ON blogs
    FOR SELECT USING (status = 'published');

-- Admins can do everything with blogs
CREATE POLICY "Admins can manage all blogs" ON blogs
    FOR ALL USING (is_admin());

-- Authors can read their own blogs (all statuses)
CREATE POLICY "Authors can read own blogs" ON blogs
    FOR SELECT USING (
        is_author() AND is_blog_owner(created_by)
    );

-- Authors can insert blogs (will be set as created_by automatically)
CREATE POLICY "Authors can create blogs" ON blogs
    FOR INSERT WITH CHECK (
        is_author() AND created_by = auth.uid()
    );

-- Authors can update their own blogs only
CREATE POLICY "Authors can update own blogs" ON blogs
    FOR UPDATE USING (
        is_author() AND is_blog_owner(created_by)
    ) WITH CHECK (
        is_author() AND created_by = auth.uid()
    );

-- Authors can delete their own blogs only
CREATE POLICY "Authors can delete own blogs" ON blogs
    FOR DELETE USING (
        is_author() AND is_blog_owner(created_by)
    );

-- ==============================================
-- BLOG TAGS POLICIES
-- ==============================================

-- Public read access to blog tags for published blogs only
CREATE POLICY "Public read blog tags for published blogs" ON blog_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE id = blog_id AND status = 'published'
        )
    );

-- Admins can manage all blog tags
CREATE POLICY "Admins can manage all blog tags" ON blog_tags
    FOR ALL USING (is_admin());

-- Authors can manage blog tags for their own blogs only
CREATE POLICY "Authors can manage own blog tags" ON blog_tags
    FOR ALL USING (
        is_author() AND 
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE blogs.id = blog_tags.blog_id 
            AND is_blog_owner(blogs.created_by)
        )
    );

-- ==============================================
-- COMMENTS POLICIES
-- ==============================================

-- Public read access to approved comments on published blogs only
CREATE POLICY "Public read approved comments" ON comments
    FOR SELECT USING (
        is_approved = true AND 
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE id = blog_id AND status = 'published'
        )
    );

-- Anyone can insert comments (they require approval)
CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments" ON comments
    FOR ALL USING (is_admin());

-- Authors can manage comments on their own blogs only
CREATE POLICY "Authors can manage own blog comments" ON comments
    FOR ALL USING (
        is_author() AND 
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE blogs.id = comments.blog_id 
            AND is_blog_owner(blogs.created_by)
        )
    );

-- ==============================================
-- PUBLICATION CATEGORIES POLICIES
-- ==============================================

-- Public read access to publication categories
CREATE POLICY "Public read publication categories" ON publication_categories
    FOR SELECT USING (true);

-- Only admins can manage publication categories
CREATE POLICY "Only admins can manage publication categories" ON publication_categories
    FOR ALL USING (is_admin());

-- ==============================================
-- PUBLICATIONS POLICIES
-- ==============================================

-- Public read access for published publications only
CREATE POLICY "Public read published publications" ON publications
    FOR SELECT USING (status = 'published');

-- Only admins can manage publications
CREATE POLICY "Only admins can manage publications" ON publications
    FOR ALL USING (is_admin());

-- ==============================================
-- ROLES POLICIES
-- ==============================================

-- Only admins can view and manage roles
CREATE POLICY "Only admins can manage roles" ON roles
    FOR ALL USING (is_admin());

-- ==============================================
-- USER ROLES POLICIES
-- ==============================================

-- Only admins can view and manage user roles
CREATE POLICY "Only admins can manage user roles" ON user_roles
    FOR ALL USING (is_admin());

-- ==============================================
-- ADD CONSTRAINTS FOR DATA INTEGRITY
-- ==============================================

-- Ensure blog created_by is set when authors create blogs
CREATE OR REPLACE FUNCTION ensure_blog_created_by()
RETURNS TRIGGER AS $$
BEGIN
    -- If created_by is null and user is authenticated, set it
    IF NEW.created_by IS NULL AND auth.uid() IS NOT NULL THEN
        NEW.created_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to ensure created_by is set
DROP TRIGGER IF EXISTS ensure_blog_created_by_trigger ON blogs;
CREATE TRIGGER ensure_blog_created_by_trigger
    BEFORE INSERT OR UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION ensure_blog_created_by();

-- Similar triggers for other content tables
CREATE OR REPLACE FUNCTION ensure_content_created_by()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_by IS NULL AND auth.uid() IS NOT NULL THEN
        NEW.created_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for programmes, competitions, events, and publications
DROP TRIGGER IF EXISTS ensure_programme_created_by_trigger ON programmes;
CREATE TRIGGER ensure_programme_created_by_trigger
    BEFORE INSERT ON programmes
    FOR EACH ROW EXECUTE FUNCTION ensure_content_created_by();

DROP TRIGGER IF EXISTS ensure_competition_created_by_trigger ON competitions;
CREATE TRIGGER ensure_competition_created_by_trigger
    BEFORE INSERT ON competitions
    FOR EACH ROW EXECUTE FUNCTION ensure_content_created_by();

DROP TRIGGER IF EXISTS ensure_event_created_by_trigger ON events;
CREATE TRIGGER ensure_event_created_by_trigger
    BEFORE INSERT ON events
    FOR EACH ROW EXECUTE FUNCTION ensure_content_created_by();

DROP TRIGGER IF EXISTS ensure_publication_created_by_trigger ON publications;
CREATE TRIGGER ensure_publication_created_by_trigger
    BEFORE INSERT ON publications
    FOR EACH ROW EXECUTE FUNCTION ensure_content_created_by();

-- ==============================================
-- ADDITIONAL CONSTRAINTS
-- ==============================================

-- Ensure unique slugs across different content types
-- Add check constraints for valid status values
ALTER TABLE programmes ADD CONSTRAINT valid_programme_status 
    CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE blogs ADD CONSTRAINT valid_blog_status 
    CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE publications ADD CONSTRAINT valid_publication_status 
    CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE competitions ADD CONSTRAINT valid_competition_status 
    CHECK (status IN ('open', 'closed', 'judging', 'completed'));

ALTER TABLE events ADD CONSTRAINT valid_event_status 
    CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled'));

-- Ensure proper role values
ALTER TABLE profiles ADD CONSTRAINT valid_role 
    CHECK (role IN ('admin', 'editor', 'author', 'user'));

-- Ensure non-negative counts
ALTER TABLE blogs ADD CONSTRAINT non_negative_views CHECK (views >= 0);
ALTER TABLE blogs ADD CONSTRAINT non_negative_likes CHECK (likes >= 0);
ALTER TABLE publications ADD CONSTRAINT non_negative_downloads CHECK (download_count >= 0);
