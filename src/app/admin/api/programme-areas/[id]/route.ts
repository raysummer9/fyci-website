import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication using session instead of getUser to avoid RLS recursion
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, icon, color, is_active, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check if slug already exists for a different record
    const { data: existing } = await supabase
      .from('programme_areas')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Update programme area
    const { data, error } = await supabase
      .from('programme_areas')
      .update({
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || '#e5e7eb',
        is_active: is_active ?? true,
        sort_order: sort_order || 0
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating programme area:', error)
      return NextResponse.json({ 
        error: 'Failed to update programme area',
        details: error.message 
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Programme area not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/programme-areas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication using session instead of getUser to avoid RLS recursion
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Delete programme area
    const { error } = await supabase
      .from('programme_areas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting programme area:', error)
      return NextResponse.json({ 
        error: 'Failed to delete programme area',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/programme-areas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication using session instead of getUser to avoid RLS recursion
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data, error } = await supabase
      .from('programme_areas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching programme area:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch programme area',
        details: error.message 
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Programme area not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/programme-areas/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
