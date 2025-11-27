import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET: Check if user has liked and get like count
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Get blog ID
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id, likes')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (blogError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get guest_id from query params (for anonymous users)
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guest_id');

    let isLiked = false;

    // Check if user has liked
    if (user) {
      const { data: like } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('user_id', user.id)
        .single();
      
      isLiked = !!like;
    } else if (guestId) {
      const { data: like } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('guest_id', guestId)
        .single();
      
      isLiked = !!like;
    }

    return NextResponse.json({ 
      likes: blog.likes || 0,
      is_liked: isLiked
    });
  } catch (error) {
    console.error('Error fetching blog like status:', error);
    return NextResponse.json({ error: 'Failed to fetch like status' }, { status: 500 });
  }
}

// POST: Toggle like (like/unlike)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { guest_id } = body;
    
    // Use admin client to bypass RLS for function execution
    const supabase = createAdminClient();
    const serverSupabase = await createServerSupabaseClient();

    // Get blog ID
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (blogError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get current user (if authenticated)
    const { data: { user } } = await serverSupabase.auth.getUser();

    // Validate: must have either user_id or guest_id
    if (!user && !guest_id) {
      return NextResponse.json({ error: 'Either user authentication or guest_id is required' }, { status: 400 });
    }

    // Call the toggle function
    const { data, error: toggleError } = await supabase.rpc('toggle_blog_like', {
      blog_id_param: blog.id,
      user_id_param: user?.id || null,
      guest_id_param: guest_id || null
    });

    if (toggleError) {
      console.error('Error toggling like:', toggleError);
      return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling blog like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

