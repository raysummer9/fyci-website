import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    if (!categorySlug) {
      return NextResponse.json({ error: 'Category slug is required' }, { status: 400 })
    }

    // First get the programme area ID by slug
    const { data: programmeArea, error: areaError } = await supabase
      .from('programme_areas')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (areaError || !programmeArea) {
      console.error('Error fetching programme area:', areaError)
      return NextResponse.json({ error: 'Programme area not found' }, { status: 404 })
    }

    // Get programmes by programme area ID
    const { data: programmes, error } = await supabase
      .from('programmes')
      .select(`
        id,
        title,
        slug,
        description,
        featured_image,
        status,
        created_at
      `)
      .eq('programme_area_id', programmeArea.id)
      .in('status', ['published', 'ongoing', 'completed'])
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching programmes:', error)
      return NextResponse.json({ error: 'Failed to fetch programmes' }, { status: 500 })
    }

    return NextResponse.json(programmes || [])
  } catch (error) {
    console.error('Error in GET /api/programmes/by-category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
