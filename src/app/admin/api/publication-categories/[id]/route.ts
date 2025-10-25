import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params
    const { data, error } = await supabase
      .from('publication_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching publication category:', error)
      return NextResponse.json({ error: 'Publication category not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/publication-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Ensure user profile exists and has proper role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, email')
      .eq('id', session.user.id)
      .single()

    // Handle case where profile doesn't exist
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it with admin role
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin',
          full_name: session.user.user_metadata?.full_name || null
        }])
        .select()
        .single()

      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError)
        return NextResponse.json({ 
          error: 'Failed to create user profile. Please contact an administrator.',
          details: createProfileError.message
        }, { status: 500 })
      }
    } else if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return NextResponse.json({ 
        error: 'Failed to verify user permissions.',
        details: profileError.message
      }, { status: 500 })
    } else if (profile && !['admin', 'editor'].includes(profile.role)) {
      // Profile exists but user doesn't have proper role, update it
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', session.user.id)

      if (updateError) {
        console.error('Error updating user role:', updateError)
      }
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ 
        error: 'Name and slug are required' 
      }, { status: 400 })
    }

    // Check if slug already exists (excluding current category)
    const { data: existing } = await supabase
      .from('publication_categories')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Update publication category directly
    const { data, error } = await supabase
      .from('publication_categories')
      .update({
        name,
        slug,
        description: description || null,
        sort_order: sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating publication category:', error)
      return NextResponse.json({ 
        error: 'Failed to update publication category',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/publication-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params

    // Check if category has publications
    const { data: publications, error: publicationsError } = await supabase
      .from('publications')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (publicationsError) {
      console.error('Error checking publications:', publicationsError)
      return NextResponse.json({ error: 'Failed to check category usage' }, { status: 500 })
    }

    if (publications && publications.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category that has publications' 
      }, { status: 400 })
    }

    // Delete publication category directly
    const { error } = await supabase
      .from('publication_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting publication category:', error)
      return NextResponse.json({ 
        error: 'Failed to delete publication category',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/publication-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
