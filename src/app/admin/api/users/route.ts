import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUsers, CreateUserData } from '@/lib/admin-user-data'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user securely
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const users = await getUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user securely
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body: CreateUserData = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, role' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['admin', 'author'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "author"' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const result = await createUser(body)
    return NextResponse.json({ 
      success: true, 
      user: result.user,
      profile: result.profile
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    
    // Handle specific Supabase errors
    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
