-- Migration: Add competition application forms feature
-- This migration adds support for custom application forms on competitions
-- 
-- Date: 2024
-- Purpose: Allow admins to create custom forms to collect user data for competitions

-- Add application_form field to competitions table (JSONB to store form configuration)
ALTER TABLE competitions 
ADD COLUMN IF NOT EXISTS application_form JSONB DEFAULT NULL;

-- Create competition_applications table to store form submissions
CREATE TABLE IF NOT EXISTS competition_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    
    -- Applicant information (always collected)
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    
    -- Form data stored as JSONB for flexibility
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Additional metadata
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate submissions (same email for same competition)
    CONSTRAINT unique_competition_email UNIQUE (competition_id, applicant_email)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_competition_applications_competition_id 
ON competition_applications(competition_id);

CREATE INDEX IF NOT EXISTS idx_competition_applications_status 
ON competition_applications(status);

CREATE INDEX IF NOT EXISTS idx_competition_applications_created_at 
ON competition_applications(created_at DESC);

-- Enable RLS
ALTER TABLE competition_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to insert (submit applications)
CREATE POLICY "Anyone can submit competition applications"
    ON competition_applications
    FOR INSERT
    TO anon, authenticated
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

-- Add comment for documentation
COMMENT ON COLUMN competitions.application_form IS 'JSONB field storing form field configuration. Format: {"fields": [{"id": "field1", "label": "Field Label", "type": "text|email|phone|textarea|select|file", "required": true, "options": []}]}';
COMMENT ON TABLE competition_applications IS 'Stores competition application submissions with flexible form data storage';

