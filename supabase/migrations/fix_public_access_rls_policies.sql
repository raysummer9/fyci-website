-- Migration: Fix public access RLS policies for competitions and programmes
-- This migration updates RLS policies to allow public access to all relevant statuses
-- 
-- Date: 2024
-- Purpose: Allow signed-out users to view all competitions and programmes, and submit applications

-- ==============================================
-- COMPETITIONS POLICIES
-- ==============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read access for competitions" ON competitions;

-- Create new public read policy that allows all statuses except 'draft'
CREATE POLICY "Public read access for competitions" ON competitions
    FOR SELECT 
    USING (status IN ('open', 'closed', 'judging', 'completed'));

-- ==============================================
-- PROGRAMMES POLICIES
-- ==============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read access for published programmes" ON programmes;

-- Create new public read policy that allows all statuses except 'draft'
CREATE POLICY "Public read access for programmes" ON programmes
    FOR SELECT 
    USING (status IN ('published', 'ongoing', 'completed'));

-- ==============================================
-- COMPETITION APPLICATIONS POLICIES
-- ==============================================

-- Ensure the insert policy allows anonymous users (should already exist, but ensuring it's correct)
DROP POLICY IF EXISTS "Anyone can submit competition applications" ON competition_applications;

CREATE POLICY "Anyone can submit competition applications"
    ON competition_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

