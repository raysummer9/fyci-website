import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getBlogs, createBlog } from '@/lib/admin-blog-data'

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category_id')
    const tagId = searchParams.get('tag_id')
    const search = searchParams.get('search')

    const filters = {
      status: status || undefined,
      category_id: categoryId || undefined,
      tag_id: tagId || undefined,
      search: search || undefined,
    }

    const blogs = await getBlogs(filters)

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error in GET /api/blogs:', error)
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
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category_id,
      status,
      featured,
      read_time,
      meta_title,
      meta_description,
      tag_ids
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ 
        error: 'Title, slug, and content are required' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const blogData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image: featured_image || null,
      category_id: category_id || null,
      status: status || 'draft',
      featured: featured || false,
      read_time: read_time || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      tag_ids: tag_ids || [],
      created_by: session.user.id
    }

    const blog = await createBlog(blogData)

    if (!blog) {
      return NextResponse.json({ 
        error: 'Failed to create blog' 
      }, { status: 500 })
    }

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/blogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
