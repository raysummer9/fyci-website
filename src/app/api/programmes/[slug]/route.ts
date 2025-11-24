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

    // Get programme by slug with related data
    const { data: programme, error } = await supabase
      .from('programmes')
      .select(`
        id,
        title,
        slug,
        description,
        content,
        featured_image,
        status,
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
      .in('status', ['published', 'ongoing', 'completed'])
      .single()

    if (error) {
      console.error('Error fetching programme:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Programme not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch programme' }, { status: 500 })
    }

    if (!programme) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 })
    }

    return NextResponse.json(programme)
  } catch (error) {
    console.error('Error in GET /api/programmes/[slug]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
