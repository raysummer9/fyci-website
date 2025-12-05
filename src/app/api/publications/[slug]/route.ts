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

    // Get publication by slug with related data
    const { data: publication, error } = await supabase
      .from('publications')
      .select(`
        id,
        title,
        slug,
        description,
        content,
        cover_image,
        file_url,
        status,
        published_at,
        created_at,
        updated_at,
        publication_categories (
          id,
          name,
          slug
        ),
        profiles!created_by (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching publication:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch publication' }, { status: 500 })
    }

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Error in GET /api/publications/[slug]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
