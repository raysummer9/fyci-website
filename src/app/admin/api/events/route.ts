import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const programmeAreaId = searchParams.get('programme_area_id')

    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })

    if (programmeAreaId) {
      query = query.eq('programme_area_id', programmeAreaId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      content,
      featured_image,
      programme_area_id,
      status,
      start_date,
      end_date,
      location,
      venue,
      is_online,
      meeting_url,
      registration_url,
      max_attendees,
      featured
    } = body

    if (!title || !slug || !programme_area_id || !start_date) {
      return NextResponse.json({ 
        error: 'Title, slug, programme area, and start date are required' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const eventData = {
      title,
      slug,
      description: description || null,
      content: content || null,
      featured_image: featured_image || null,
      programme_area_id,
      status: status || 'upcoming',
      start_date,
      end_date: end_date || null,
      location: location || null,
      venue: venue || null,
      is_online: is_online || false,
      meeting_url: meeting_url || null,
      registration_url: registration_url || null,
      max_attendees: max_attendees || null,
      featured: featured || false,
      created_by: session.user.id
    }

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json({ 
        error: 'Failed to create event',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
