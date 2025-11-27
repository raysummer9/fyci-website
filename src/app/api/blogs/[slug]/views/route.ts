import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET: Fetch current view count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('id, views')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ views: blog.views || 0 });
  } catch (error) {
    console.error('Error fetching blog views:', error);
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 });
  }
}

// POST: Increment view count
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    // Use admin client to bypass RLS for view increments
    const supabase = createAdminClient();

    // First, get the blog ID
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (fetchError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Increment views using the database function for atomicity
    const { data, error: incrementError } = await supabase.rpc('increment_blog_views', {
      blog_id_param: blog.id
    });

    if (incrementError) {
      console.error('Error incrementing views:', incrementError);
      // Fallback: Get current views and increment
      const { data: currentBlog, error: fetchCurrentError } = await supabase
        .from('blogs')
        .select('views')
        .eq('id', blog.id)
        .single();

      if (fetchCurrentError || !currentBlog) {
        return NextResponse.json({ error: 'Failed to fetch current views' }, { status: 500 });
      }

      const newViews = (currentBlog.views || 0) + 1;
      
      const { data: updatedBlog, error: updateError } = await supabase
        .from('blogs')
        .update({ 
          views: newViews,
          updated_at: new Date().toISOString()
        })
        .eq('id', blog.id)
        .select('views')
        .single();

      if (updateError || !updatedBlog) {
        return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
      }

      return NextResponse.json({ views: updatedBlog.views });
    }

    return NextResponse.json({ views: data || 0 });
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}

