import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPublications, createPublication } from '@/lib/admin-publication-data'

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category_id')
    const search = searchParams.get('search')

    const filters = {
      status: status || undefined,
      category_id: categoryId || undefined,
      search: search || undefined,
    }

    const publications = await getPublications(filters)

    return NextResponse.json(publications)
  } catch (error) {
    console.error('Error in GET /api/publications:', error)
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
      file_url,
      cover_image,
      category_id,
      status,
      featured,
      published_at,
      file_size
    } = body

    if (!title || !slug) {
      return NextResponse.json({ 
        error: 'Title and slug are required' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('publications')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const publicationData = {
      title,
      slug,
      description: description || null,
      content: content || null,
      file_url: file_url || null,
      cover_image: cover_image || null,
      category_id: category_id || null,
      status: status || 'draft',
      featured: featured || false,
      published_at: published_at || (status === 'published' ? new Date().toISOString() : null),
      file_size: file_size || null,
      created_by: session.user.id
    }

    const publication = await createPublication(publicationData)

    if (!publication) {
      return NextResponse.json({ 
        error: 'Failed to create publication' 
      }, { status: 500 })
    }

    return NextResponse.json(publication, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/publications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
