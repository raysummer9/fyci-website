import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, slug, description, icon, color, is_active, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('programme_areas')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Insert new programme area
    const { data, error } = await supabase
      .from('programme_areas')
      .insert([{
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || '#e5e7eb',
        is_active: is_active ?? true,
        sort_order: sort_order || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating programme area:', error)
      return NextResponse.json({ 
        error: 'Failed to create programme area',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/programme-areas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    const { data, error } = await supabase
      .from('programme_areas')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching programme areas:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch programme areas',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/programme-areas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
