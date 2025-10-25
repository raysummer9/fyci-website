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

    // Get blogs by category slug
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        status,
        published_at,
        category:categories!category_id(
          id,
          name,
          slug
        )
      `)
      .eq('categories.slug', categorySlug)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    return NextResponse.json(blogs || [])
  } catch (error) {
    console.error('Error in GET /api/blogs/by-category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
