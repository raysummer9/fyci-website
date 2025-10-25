import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '6'

    // Get events with their programme areas
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        slug,
        description,
        featured_image,
        status,
        start_date,
        end_date,
        location,
        created_at,
        programme_areas!programme_area_id (
          id,
          name,
          slug
        )
      `)
      .in('status', ['published', 'completed'])
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json(events || [])
  } catch (error) {
    console.error('Error in GET /api/events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
