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
        blog_categories (
          category:categories (
            id,
            name,
            slug
          )
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

    // Note: Category and tag filtering is done after fetching, as Supabase doesn't support
    // filtering through junction tables directly in the query

    query = query.limit(parseInt(limit))

    const { data: blogs, error } = await query

    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    // Transform the data to flatten tags and add comment counts
    let transformedBlogs = await Promise.all((blogs || []).map(async (blog) => {
      // Get comment count for each blog
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', blog.id)
        .eq('is_approved', true)

      // Get categories from blog_categories junction table
      const categories = (blog.blog_categories || []).map((bc: any) => bc.category).filter(Boolean)

      return {
        ...blog,
        categories: categories.length > 0 ? categories : (blog.category ? [blog.category] : []),
        tags: blog.blog_tags?.map((bt: any) => bt.tag).filter(Boolean) || [],
        comments_count: commentsCount || 0
      }
    }))

    // Filter by category if specified (after transformation to check junction table)
    if (category) {
      transformedBlogs = transformedBlogs.filter(blog => {
        const blogCategories = blog.categories || []
        return blogCategories.some((cat: any) => cat.slug === category)
      })
    }

    // Filter by tag if specified (after transformation to check junction table)
    if (tag) {
      transformedBlogs = transformedBlogs.filter(blog => {
        const blogTags = blog.tags || []
        return blogTags.some((t: any) => t.slugs === tag)
      })
    }

    return NextResponse.json(transformedBlogs)
  } catch (error) {
    console.error('Error in GET /api/blogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
