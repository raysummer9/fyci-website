import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getTags, createTag } from '@/lib/admin-blog-data'

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

    const tags = await getTags()

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error in GET /api/tags:', error)
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
    const { name, color } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if tag name already exists
    const { data: existing } = await supabase
      .from('tags')
      .select('id')
      .ilike('name', name)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 400 })
    }

    const tag = await createTag({ name })

    if (!tag) {
      return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
    }

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/tags:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
