import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '3'

    // Get publications with their categories
    const { data: publications, error } = await supabase
      .from('publications')
      .select(`
        id,
        title,
        slug,
        description,
        cover_image,
        file_url,
        status,
        published_at,
        created_at,
        publication_categories (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching publications:', error)
      return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 })
    }

    return NextResponse.json(publications || [])
  } catch (error) {
    console.error('Error in GET /api/publications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
