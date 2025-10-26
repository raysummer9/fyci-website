import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Get tags with blog counts
    const { data: tags, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        slugs,
        blog_tags!inner (
          blog:blogs!inner (
            id
          )
        )
      `)
      .eq('blog_tags.blog.status', 'published')

    if (error) {
      console.error('Error fetching tags:', error)
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
    }

    // Transform data to include counts
    const tagsWithCounts = (tags || []).map(tag => ({
      id: tag.id,
      name: tag.name,
      slugs: tag.slugs,
      count: tag.blog_tags?.length || 0
    }))

    return NextResponse.json(tagsWithCounts)
  } catch (error) {
    console.error('Error in GET /api/blogs/tags:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
