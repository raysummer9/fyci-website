import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

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

    const { searchParams } = new URL(request.url)
    const programmeAreaId = searchParams.get('programme_area_id')

    let query = supabase
      .from('programmes')
      .select('*')
      .order('sort_order', { ascending: true })

    if (programmeAreaId) {
      query = query.eq('programme_area_id', programmeAreaId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching programmes:', error)
      return NextResponse.json({ error: 'Failed to fetch programmes' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/programmes:', error)
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
      featured_image,
      programme_area_id,
      status,
      start_date,
      end_date,
      featured,
      sort_order
    } = body

    if (!title || !slug || !programme_area_id) {
      return NextResponse.json({ 
        error: 'Title, slug, and programme area are required' 
      }, { status: 400 })
    }

    // Validate status
    if (status && !['draft', 'published', 'ongoing', 'completed', 'archived'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be "draft", "published", "ongoing", "completed", or "archived"' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('programmes')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const programmeData = {
      title,
      slug,
      description: description || null,
      content: content || null,
      featured_image: featured_image || null,
      programme_area_id,
      status: status || 'draft',
      start_date: start_date || null,
      end_date: end_date || null,
      featured: featured || false,
      sort_order: sort_order || 0,
      created_by: session.user.id
    }

    const { data, error } = await supabase
      .from('programmes')
      .insert([programmeData])
      .select()
      .single()

    if (error) {
      console.error('Error creating programme:', error)
      return NextResponse.json({ 
        error: 'Failed to create programme',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/programmes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
