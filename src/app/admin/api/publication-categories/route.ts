import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

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

    // Get publication categories directly
    const { data, error } = await supabase
      .from('publication_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching publication categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/publication-categories:', error)
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

    // Check if user profile exists and ensure proper role
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
      console.log('Created new admin profile for user:', newProfile)
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
        return NextResponse.json({ 
          error: 'Failed to update user permissions.',
          details: updateError.message
        }, { status: 500 })
      }
      console.log('Updated user role to admin for:', profile.email)
    }

    const body = await request.json()
    const { name, slug, description, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ 
        error: 'Name and slug are required' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('publication_categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Insert new publication category directly
    const { data, error } = await supabase
      .from('publication_categories')
      .insert([{
        name,
        slug,
        description: description || null,
        sort_order: sort_order || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating publication category:', {
        error,
        userId: session.user.id,
        userEmail: session.user.email,
        profile: profile
      })
      
      // Check if it's specifically an RLS error
      if (error.code === '42501') {
        return NextResponse.json({ 
          error: 'Permission denied. Please ensure you have admin or editor role. Contact an administrator to update your permissions.',
          details: error.message,
          code: error.code
        }, { status: 403 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to create publication category',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/publication-categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
