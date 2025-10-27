-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE competition_status AS ENUM ('open', 'closed', 'judging', 'completed');

-- ==============================================
-- PROFILES TABLE (linked to Supabase auth)
-- ==============================================

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'author', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PROGRAMME AREAS
-- ==============================================

CREATE TABLE programme_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PROGRAMMES
-- ==============================================

CREATE TABLE programmes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image TEXT,
    programme_area_id UUID REFERENCES programme_areas(id) ON DELETE CASCADE,
    status content_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- COMPETITIONS
-- ==============================================

CREATE TABLE competitions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image TEXT,
    programme_area_id UUID REFERENCES programme_areas(id) ON DELETE CASCADE,
    status competition_status DEFAULT 'open',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    rules TEXT,
    prizes TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- EVENTS
-- ==============================================

CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image TEXT,
    programme_area_id UUID REFERENCES programme_areas(id) ON DELETE CASCADE,
    status event_status DEFAULT 'upcoming',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    venue TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    registration_url TEXT,
    max_attendees INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CATEGORIES
-- ==============================================

CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- TAGS
-- ==============================================

CREATE TABLE tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slugs TEXT UNIQUE NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- BLOGS
-- ==============================================

CREATE TABLE blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status content_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    read_time INTEGER, -- in minutes
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- BLOG TAGS (Many-to-Many relationship)
-- ==============================================

CREATE TABLE blog_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, tag_id)
);

-- ==============================================
-- COMMENTS
-- ==============================================

CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    author_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PUBLICATION CATEGORIES
-- ==============================================

CREATE TABLE publication_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PUBLICATIONS
-- ==============================================

CREATE TABLE publications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    cover_image TEXT,
    category_id UUID REFERENCES publication_categories(id) ON DELETE SET NULL,
    status content_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    file_size INTEGER, -- in bytes
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- ROLES AND PERMISSIONS
-- ==============================================

CREATE TABLE roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE(user_id, role_id)
);

-- ==============================================
-- INDEXES
-- ==============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Programme areas indexes
CREATE INDEX idx_programme_areas_slug ON programme_areas(slug);
CREATE INDEX idx_programme_areas_active ON programme_areas(is_active);

-- Programmes indexes
CREATE INDEX idx_programmes_slug ON programmes(slug);
CREATE INDEX idx_programmes_status ON programmes(status);
CREATE INDEX idx_programmes_programme_area_id ON programmes(programme_area_id);
CREATE INDEX idx_programmes_featured ON programmes(featured);
CREATE INDEX idx_programmes_created_by ON programmes(created_by);

-- Competitions indexes
CREATE INDEX idx_competitions_slug ON competitions(slug);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_programme_area_id ON competitions(programme_area_id);
CREATE INDEX idx_competitions_start_date ON competitions(start_date);
CREATE INDEX idx_competitions_end_date ON competitions(end_date);

-- Events indexes
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_programme_area_id ON events(programme_area_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(featured);

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);

-- Tags indexes
CREATE INDEX idx_tags_slug ON tags(slugs);

-- Blogs indexes
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_category_id ON blogs(category_id);
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_created_by ON blogs(created_by);

-- Blog tags indexes
CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag_id ON blog_tags(tag_id);

-- Comments indexes
CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_approved ON comments(is_approved);

-- Publications indexes
CREATE INDEX idx_publications_slug ON publications(slug);
CREATE INDEX idx_publications_status ON publications(status);
CREATE INDEX idx_publications_category_id ON publications(category_id);
CREATE INDEX idx_publications_featured ON publications(featured);
CREATE INDEX idx_publications_published_at ON publications(published_at);
CREATE INDEX idx_publications_created_by ON publications(created_by);

-- ==============================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programme_areas_updated_at BEFORE UPDATE ON programme_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON programmes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publication_categories_updated_at BEFORE UPDATE ON publication_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function whenever a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- PROFILES POLICIES
-- ==============================================

-- Allow users to read their own profile and public profiles
CREATE POLICY "Users can view own profile and public profiles" ON profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can do everything with profiles
CREATE POLICY "Admins can do everything with profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- PROGRAMME AREAS POLICIES
-- ==============================================

-- Public read access for active programme areas
CREATE POLICY "Public read access for active programme areas" ON programme_areas
    FOR SELECT USING (is_active = true);

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to programme areas" ON programme_areas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- ==============================================
-- PROGRAMMES POLICIES
-- ==============================================

-- Public read access for published programmes
CREATE POLICY "Public read access for published programmes" ON programmes
    FOR SELECT USING (status = 'published');

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to programmes" ON programmes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage their own programmes
CREATE POLICY "Authors can manage own programmes" ON programmes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role IN ('admin', 'editor') OR created_by = auth.uid())
        )
    );

-- ==============================================
-- COMPETITIONS POLICIES
-- ==============================================

-- Public read access for open and completed competitions
CREATE POLICY "Public read access for competitions" ON competitions
    FOR SELECT USING (status IN ('open', 'judging', 'completed'));

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to competitions" ON competitions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage their own competitions
CREATE POLICY "Authors can manage own competitions" ON competitions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role IN ('admin', 'editor') OR created_by = auth.uid())
        )
    );

-- ==============================================
-- EVENTS POLICIES
-- ==============================================

-- Public read access for upcoming and completed events
CREATE POLICY "Public read access for events" ON events
    FOR SELECT USING (status IN ('upcoming', 'ongoing', 'completed'));

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage their own events
CREATE POLICY "Authors can manage own events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role IN ('admin', 'editor') OR created_by = auth.uid())
        )
    );

-- ==============================================
-- CATEGORIES POLICIES
-- ==============================================

-- Public read access to categories
CREATE POLICY "Public read access to categories" ON categories
    FOR SELECT USING (true);

-- Admins and editors can manage categories
CREATE POLICY "Admins and editors can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- ==============================================
-- TAGS POLICIES
-- ==============================================

-- Public read access to tags
CREATE POLICY "Public read access to tags" ON tags
    FOR SELECT USING (true);

-- Admins and editors can manage tags
CREATE POLICY "Admins and editors can manage tags" ON tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- ==============================================
-- BLOGS POLICIES
-- ==============================================

-- Public read access for published blogs
CREATE POLICY "Public read access for published blogs" ON blogs
    FOR SELECT USING (status = 'published');

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to blogs" ON blogs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage their own blogs
CREATE POLICY "Authors can manage own blogs" ON blogs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role IN ('admin', 'editor') OR created_by = auth.uid())
        )
    );

-- ==============================================
-- BLOG TAGS POLICIES
-- ==============================================

-- Public read access to blog tags
CREATE POLICY "Public read access to blog tags" ON blog_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE id = blog_id AND status = 'published'
        )
    );

-- Admins and editors can manage blog tags
CREATE POLICY "Admins and editors can manage blog tags" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage blog tags for their own blogs
CREATE POLICY "Authors can manage blog tags for own blogs" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE blog_id = blogs.id AND (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE id = auth.uid() AND role IN ('admin', 'editor')
                ) OR blogs.created_by = auth.uid()
            )
        )
    );

-- ==============================================
-- COMMENTS POLICIES
-- ==============================================

-- Public read access to approved comments on published blogs
CREATE POLICY "Public read access to approved comments" ON comments
    FOR SELECT USING (
        is_approved = true AND 
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE id = blog_id AND status = 'published'
        )
    );

-- Admins and editors can do everything with comments
CREATE POLICY "Admins and editors full access to comments" ON comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Anyone can insert comments (they'll need approval)
CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- Authors can manage comments on their own blogs
CREATE POLICY "Authors can manage comments on own blogs" ON comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM blogs 
            WHERE id = blog_id AND created_by = auth.uid() AND
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- ==============================================
-- PUBLICATION CATEGORIES POLICIES
-- ==============================================

-- Public read access to publication categories
CREATE POLICY "Public read access to publication categories" ON publication_categories
    FOR SELECT USING (true);

-- Admins and editors can manage publication categories
CREATE POLICY "Admins and editors can manage publication categories" ON publication_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- ==============================================
-- PUBLICATIONS POLICIES
-- ==============================================

-- Public read access for published publications
CREATE POLICY "Public read access for published publications" ON publications
    FOR SELECT USING (status = 'published');

-- Admins and editors can do everything
CREATE POLICY "Admins and editors full access to publications" ON publications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Authors can manage their own publications
CREATE POLICY "Authors can manage own publications" ON publications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND (role IN ('admin', 'editor') OR created_by = auth.uid())
        )
    );

-- ==============================================
-- ROLES POLICIES
-- ==============================================

-- Only admins can view and manage roles
CREATE POLICY "Only admins can manage roles" ON roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- USER ROLES POLICIES
-- ==============================================

-- Only admins can view and manage user roles
CREATE POLICY "Only admins can manage user roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- INITIAL DATA
-- ==============================================

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Full system access', '{"all": true}'),
    ('editor', 'Content management access', '{"programmes": true, "events": true, "competitions": true, "blogs": true, "publications": true}'),
    ('author', 'Limited content creation access', '{"blogs": true, "own_content_only": true}'),
    ('user', 'Basic user access', '{"read": true}')
ON CONFLICT (name) DO NOTHING;

-- Insert default programme areas
INSERT INTO programme_areas (name, slug, description, color, sort_order) VALUES
    ('Women''s Rights', 'womens-rights', 'Promoting women''s rights and gender equality', '#FF6B6B', 1),
    ('Youth Agency and Self Esteem', 'youth-agency', 'Building confidence and agency in young people', '#4ECDC4', 2),
    ('Youth Political Participation', 'youth-political-participation', 'Encouraging civic engagement and political participation', '#45B7D1', 3),
    ('Anti-Corruption', 'anti-corruption', 'Fighting corruption and promoting transparency', '#96CEB4', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
    ('Youth Development', 'youth-development', 'Articles about youth empowerment and development', '#FF6B6B', 1),
    ('Creative Arts', 'creative-arts', 'Content related to creative expression and arts', '#4ECDC4', 2),
    ('Social Change', 'social-change', 'Posts about social justice and community change', '#45B7D1', 3),
    ('Success Stories', 'success-stories', 'Inspiring stories of impact and transformation', '#96CEB4', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert default publication categories
INSERT INTO publication_categories (name, slug, description, sort_order) VALUES
    ('Research Reports', 'research-reports', 'Detailed research and analysis documents', 1),
    ('Case Studies', 'case-studies', 'In-depth case studies of projects and impacts', 2),
    ('Guides', 'guides', 'Practical guides and how-to documents', 3),
    ('Frameworks', 'frameworks', 'Methodological frameworks and approaches', 4),
    ('Impact Studies', 'impact-studies', 'Studies measuring program impact and outcomes', 5),
    ('Infographics', 'infographics', 'Visual representations of data and information', 6)
ON CONFLICT (slug) DO NOTHING;
