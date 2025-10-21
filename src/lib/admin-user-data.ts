import { createAdminClient, createServerSupabaseClient } from './supabase'
import { getAuthenticatedUser } from './auth'

export interface Profile {
  id: string
  email: string
  full_name?: string
  bio?: string
  avatar_url?: string
  role: 'admin' | 'editor' | 'author' | 'user'
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  full_name?: string
  role: 'admin' | 'author'
}

export interface UpdateUserData {
  full_name?: string
  role?: 'admin' | 'editor' | 'author' | 'user'
  bio?: string
}

// Get all users with profiles
export async function getUsers(): Promise<Profile[]> {
  try {
    // Verify current user is admin securely
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    // Get all profiles using admin client to bypass RLS
    const adminClient = createAdminClient()
    const { data: profiles, error } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return profiles || []
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Get single user by ID
export async function getUser(id: string): Promise<Profile | null> {
  try {
    // Verify current user is admin securely
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    const adminClient = createAdminClient()
    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return profile
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Create new user
export async function createUser(userData: CreateUserData) {
  try {
    // Verify current user is admin securely
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    const adminClient = createAdminClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name || ''
      }
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user in auth')
    }

    // Create profile in profiles table
    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name || null,
        role: userData.role
      }])
      .select()
      .single()

    if (profileError) {
      // If profile creation fails, we should try to delete the auth user
      try {
        await adminClient.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('Failed to cleanup auth user after profile creation failed:', deleteError)
      }
      throw profileError
    }

    return {
      user: authData.user,
      profile: profileData
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Update user profile
export async function updateUser(id: string, userData: UpdateUserData) {
  try {
    // Verify current user is admin securely
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    const adminClient = createAdminClient()

    // Update profile
    const { data: profile, error } = await adminClient
      .from('profiles')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update user metadata if needed
    if (userData.full_name !== undefined) {
      try {
        await adminClient.auth.admin.updateUserById(id, {
          user_metadata: {
            full_name: userData.full_name || ''
          }
        })
      } catch (metadataError) {
        console.error('Failed to update user metadata:', metadataError)
        // Don't throw here as the profile was updated successfully
      }
    }

    return profile
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Delete user
export async function deleteUser(id: string) {
  try {
    // Verify current user is admin securely
    const user = await getAuthenticatedUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Prevent admin from deleting themselves
    if (user.id === id) {
      throw new Error('Cannot delete your own account')
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    const adminClient = createAdminClient()

    // Delete user from auth (this will cascade delete the profile due to FK constraint)
    const { error } = await adminClient.auth.admin.deleteUser(id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
