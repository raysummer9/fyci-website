import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

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
    const { id } = await params

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching competition:', error)
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/competitions/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()
    const { id } = await params

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
      rules,
      prizes,
      featured
    } = body

    if (!title || !slug || !programme_area_id) {
      return NextResponse.json({ 
        error: 'Title, slug, and programme area are required' 
      }, { status: 400 })
    }

    // Validate status
    if (status && !['open', 'closed'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be "open" or "closed"' 
      }, { status: 400 })
    }

    // Check if slug already exists (excluding current competition)
    const { data: existing } = await supabase
      .from('competitions')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('competitions')
      .update({
        title,
        slug,
        description: description || null,
        content: content || null,
        featured_image: featured_image || null,
        programme_area_id,
        status: status || 'open',
        start_date: start_date || null,
        end_date: end_date || null,
        rules: rules || null,
        prizes: prizes || null,
        featured: featured || false,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating competition:', error)
      return NextResponse.json({ 
        error: 'Failed to update competition',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/competitions/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
