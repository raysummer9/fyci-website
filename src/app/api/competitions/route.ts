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

    // Get competitions with their programme areas
    const { data: competitions, error } = await supabase
      .from('competitions')
      .select(`
        id,
        title,
        slug,
        description,
        featured_image,
        status,
        start_date,
        end_date,
        created_at,
        programme_areas!programme_area_id (
          id,
          name,
          slug
        )
      `)
      .in('status', ['open', 'closed'])
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching competitions:', error)
      return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 })
    }

    return NextResponse.json(competitions || [])
  } catch (error) {
    console.error('Error in GET /api/competitions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
