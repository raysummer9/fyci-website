import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('blogs')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        status,
        featured,
        views,
        likes,
        read_time,
        published_at,
        created_at,
        category:categories!category_id (
          id,
          name,
          slug
        ),
        author:profiles!created_by (
          id,
          full_name,
          email
        ),
        blog_tags (
          tag:tags (
            id,
            name,
            slugs
          )
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })

    // Apply filters
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (category) {
      query = query.eq('categories.slug', category)
    }

    if (tag) {
      query = query.eq('blog_tags.tag.slugs', tag)
    }

    query = query.limit(parseInt(limit))

    const { data: blogs, error } = await query

    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    // Transform the data to flatten tags
    const transformedBlogs = (blogs || []).map(blog => ({
      ...blog,
      tags: blog.blog_tags?.map((bt: any) => bt.tag).filter(Boolean) || []
    }))

    return NextResponse.json(transformedBlogs)
  } catch (error) {
    console.error('Error in GET /api/blogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
