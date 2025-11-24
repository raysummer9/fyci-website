-- Migration: Fix competition_applications RLS policies
-- This migration ensures public users can submit applications
-- 
-- Date: 2024
-- Purpose: Fix RLS policies to allow anonymous users to insert competition applications

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit competition applications" ON competition_applications;
DROP POLICY IF EXISTS "Admins and editors can view competition applications" ON competition_applications;
DROP POLICY IF EXISTS "Admins can update competition applications" ON competition_applications;
DROP POLICY IF EXISTS "Admins can delete competition applications" ON competition_applications;

-- Recreate policies with proper permissions

-- Allow anyone (anon and authenticated) to insert (submit applications)
-- Using 'public' role which includes both anon and authenticated users
-- Note: INSERT policies only support WITH CHECK, not USING
CREATE POLICY "Anyone can submit competition applications"
    ON competition_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated users with admin/editor role can view applications
CREATE POLICY "Admins and editors can view competition applications"
    ON competition_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

-- Only admins can update applications
CREATE POLICY "Admins can update competition applications"
    ON competition_applications
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Only admins can delete applications
CREATE POLICY "Admins can delete competition applications"
    ON competition_applications
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

