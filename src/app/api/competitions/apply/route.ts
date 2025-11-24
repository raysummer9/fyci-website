import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Use anon client for reading competition data
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )
    
    // Use admin client for inserting application (bypasses RLS)
    const adminSupabase = createAdminClient()
    const body = await request.json()

    const { competition_id, applicant_name, applicant_email, applicant_phone, form_data } = body

    // Validate required fields
    if (!competition_id || !applicant_name || !applicant_email) {
      return NextResponse.json(
        { error: 'Missing required fields: competition_id, applicant_name, and applicant_email are required' },
        { status: 400 }
      )
    }

    // Check if competition exists and is open for applications
    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .select('id, status, application_form')
      .eq('id', competition_id)
      .single()

    if (competitionError) {
      console.error('Error fetching competition:', competitionError)
      return NextResponse.json({ 
        error: 'Competition not found',
        details: competitionError.message 
      }, { status: 404 })
    }

    if (!competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 })
    }

    // Check if competition has application form enabled
    if (!competition.application_form || !competition.application_form.enabled) {
      return NextResponse.json({ error: 'This competition is not accepting applications' }, { status: 400 })
    }

    // Check if competition is open for submissions
    if (competition.status !== 'open') {
      return NextResponse.json({ error: 'This competition is not currently accepting applications' }, { status: 400 })
    }

    // Insert application using admin client to bypass RLS
    // Note: Duplicate check is handled by unique constraint in database
    const { data: application, error: insertError } = await adminSupabase
      .from('competition_applications')
      .insert({
        competition_id,
        applicant_name,
        applicant_email,
        applicant_phone: applicant_phone || null,
        form_data: form_data || {},
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting application:', insertError)
      
      // Check if it's a duplicate submission error
      if (insertError.code === '23505' || insertError.message?.includes('unique_competition_email')) {
        return NextResponse.json(
          { error: 'You have already submitted an application for this competition' },
          { status: 400 }
        )
      }
      
      // Return detailed error for debugging
      return NextResponse.json({ 
        error: 'Failed to submit application',
        details: insertError.message,
        code: insertError.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      application_id: application.id,
      message: 'Application submitted successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/competitions/apply:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

