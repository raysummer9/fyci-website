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

    // Get programmes with their programme areas
    const { data: programmes, error } = await supabase
      .from('programmes')
      .select(`
        id,
        title,
        slug,
        description,
        featured_image,
        status,
        created_at,
        programme_areas!programme_area_id (
          id,
          name,
          slug
        )
      `)
      .in('status', ['published', 'ongoing', 'completed'])
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching programmes:', error)
      return NextResponse.json({ error: 'Failed to fetch programmes' }, { status: 500 })
    }

    return NextResponse.json(programmes || [])
  } catch (error) {
    console.error('Error in GET /api/programmes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
