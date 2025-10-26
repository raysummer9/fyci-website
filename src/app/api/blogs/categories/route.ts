import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Get categories with blog counts
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        blogs!inner (
          id
        )
      `)
      .eq('blogs.status', 'published')

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Transform data to include counts
    const categoriesWithCounts = (categories || []).map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.blogs?.length || 0
    }))

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Error in GET /api/blogs/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
