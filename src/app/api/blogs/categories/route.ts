import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Get categories with blog counts using the blog_categories junction table
    // First, get all published blog IDs
    const { data: publishedBlogs, error: blogsError } = await supabase
      .from('blogs')
      .select('id')
      .eq('status', 'published')

    if (blogsError) {
      console.error('Error fetching published blogs:', blogsError)
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
    }

    const publishedBlogIds = (publishedBlogs || []).map(b => b.id)

    if (publishedBlogIds.length === 0) {
      return NextResponse.json([])
    }

    // Get categories that have blogs in the junction table
    const { data: blogCategories, error: bcError } = await supabase
      .from('blog_categories')
      .select(`
        category:categories (
          id,
          name,
          slug
        )
      `)
      .in('blog_id', publishedBlogIds)

    if (bcError) {
      console.error('Error fetching blog categories:', bcError)
      return NextResponse.json({ error: 'Failed to fetch blog categories' }, { status: 500 })
    }

    // Count blogs per category
    const categoryCounts: Record<string, { id: string; name: string; slug: string; count: number }> = {}
    
    blogCategories?.forEach((bc: any) => {
      if (bc.category) {
        const catId = bc.category.id
        if (!categoryCounts[catId]) {
          categoryCounts[catId] = {
            id: bc.category.id,
            name: bc.category.name,
            slug: bc.category.slug,
            count: 0
          }
        }
        categoryCounts[catId].count++
      }
    })

    const activeCategories = Object.values(categoryCounts).sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(activeCategories)
  } catch (error) {
    console.error('Error in GET /api/blogs/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
