import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { slug } = await params
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and has admin/editor role
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // First, get the competition ID from the slug
    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .select('id')
      .eq('slug', slug)
      .single()

    if (competitionError || !competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 })
    }

    // Fetch applications for this competition
    const { data: applications, error } = await supabase
      .from('competition_applications')
      .select('*')
      .eq('competition_id', competition.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
    }

    return NextResponse.json(applications || [])
  } catch (error) {
    console.error('Error in GET /api/competitions/[slug]/applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { slug } = await params
    const body = await request.json()
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and has admin role
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // First, get the competition ID from the slug
    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .select('id')
      .eq('slug', slug)
      .single()

    if (competitionError || !competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 })
    }

    const { application_id, status, notes } = body

    if (!application_id) {
      return NextResponse.json({ error: 'application_id is required' }, { status: 400 })
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (status !== undefined) {
      updateData.status = status
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    // Update application
    const { data: application, error } = await supabase
      .from('competition_applications')
      .update(updateData)
      .eq('id', application_id)
      .eq('competition_id', competition.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error in PATCH /api/competitions/[slug]/applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

