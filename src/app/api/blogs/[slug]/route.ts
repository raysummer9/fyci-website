import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    // Get blog by slug with related data
    const { data: blog, error } = await supabase
      .from('blogs')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        status,
        featured,
        views,
        likes,
        read_time,
        published_at,
        hide_counts,
        created_at,
        updated_at,
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
          email,
          avatar_url
        ),
        blog_tags (
          tag:tags (
            id,
            name,
            slugs
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Transform the data to flatten tags and categories
    const categories = (blog.blog_categories || []).map((bc: any) => bc.category).filter(Boolean)
    
    const transformedBlog = {
      ...blog,
      categories: categories.length > 0 ? categories : (blog.category ? [blog.category] : []),
      tags: blog.blog_tags?.map((bt: any) => bt.tag).filter(Boolean) || []
    };

    // Get comments count
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', blog.id);

    return NextResponse.json({
      ...transformedBlog,
      comments_count: commentsCount || 0
    });
  } catch (error) {
    console.error('Error in GET /api/blogs/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
