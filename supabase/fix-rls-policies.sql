-- Fix for infinite recursion in RLS policies
-- Run this to fix the problematic policies in your database

-- First, drop ALL existing policies on profiles table to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile and public profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything with profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create a simpler and safer version of the profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (for user registration)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Note: For admin operations, you should either:
-- 1. Use the service role key in your server-side operations
-- 2. Set up separate admin policies that don't reference profiles table
-- 3. Handle admin permissions through application logic rather than RLS

-- The original policies had issues because they were referencing the profiles table
-- from within policies on the profiles table, causing infinite recursion.
-- The simplified version above avoids this issue by not using EXISTS queries
-- that reference the same table the policy is applied to.
