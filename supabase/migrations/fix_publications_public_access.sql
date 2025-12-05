-- Migration: Fix public access RLS policies for publications
-- This migration updates RLS policies to allow public (unauthenticated) access to published publications
-- 
-- Date: 2025-01-XX
-- Purpose: Allow signed-out users to view published publications

-- ==============================================
-- PUBLICATIONS POLICIES
-- ==============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated can read publications (consolidated)" ON publications;
DROP POLICY IF EXISTS "Public read access for published publications" ON publications;
DROP POLICY IF EXISTS "Public read published publications" ON publications;
DROP POLICY IF EXISTS "Admins and editors full access to publications" ON publications;
DROP POLICY IF EXISTS "Authors can manage own publications" ON publications;
DROP POLICY IF EXISTS "Only admins can manage publications" ON publications;

-- Public read access for published publications (allows unauthenticated users)
-- This policy applies to all users (authenticated and unauthenticated)
CREATE POLICY "Public read published publications" ON publications
    FOR SELECT 
    USING (status = 'published');

-- Admins can do everything with publications (create, update, delete, read all)
CREATE POLICY "Admins can manage publications" ON publications
    FOR ALL 
    USING (is_admin());

