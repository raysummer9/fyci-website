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

    // Get event by slug with related data
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        slug,
        description,
        content,
        featured_image,
        status,
        start_date,
        end_date,
        location,
        venue,
        is_online,
        meeting_url,
        registration_url,
        max_attendees,
        featured,
        created_at,
        updated_at,
        programme_areas!programme_area_id (
          id,
          name,
          slug,
          description,
          icon,
          color
        ),
        profiles!created_by (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .in('status', ['upcoming', 'ongoing', 'completed'])
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error in GET /api/events/[slug]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
