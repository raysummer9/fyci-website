import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPublication, updatePublication, deletePublication } from '@/lib/admin-publication-data'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params
    const publication = await getPublication(id)

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Error in GET /api/publications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params
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

    // Check if slug already exists (excluding current publication)
    const { data: existing } = await supabase
      .from('publications')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const updateData = {
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
      updated_by: session.user.id
    }

    const publication = await updatePublication(id, updateData)

    if (!publication) {
      return NextResponse.json({ 
        error: 'Failed to update publication' 
      }, { status: 500 })
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Error in PUT /api/publications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params
    const success = await deletePublication(id)

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to delete publication' 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/publications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
