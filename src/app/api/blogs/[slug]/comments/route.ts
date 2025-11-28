import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET: Fetch approved comments for a blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    // First, get the blog ID from slug
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (blogError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get approved comments for this blog
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, content, author_name, created_at, parent_id')
      .eq('blog_id', blog.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error in GET /api/blogs/[slug]/comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST: Submit a new comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, comment } = body;

    // Validate input
    if (!name || !comment || !name.trim() || !comment.trim()) {
      return NextResponse.json({ 
        error: 'Name and comment are required' 
      }, { status: 400 });
    }

    // Use admin client to bypass RLS for insert
    const supabase = createAdminClient();
    const serverSupabase = await createServerSupabaseClient();

    // Get the blog ID from slug
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (blogError || !blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Insert comment (will be pending approval by default)
    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert({
        blog_id: blog.id,
        author_name: name.trim(),
        content: comment.trim(),
        is_approved: false, // Requires admin approval
      })
      .select('id, content, author_name, created_at, is_approved')
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Comment submitted successfully. It will be visible after approval.',
      comment: newComment
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/blogs/[slug]/comments:', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}

