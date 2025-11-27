import { createServerSupabaseClient } from './supabase'
import { redirect } from 'next/navigation'

export async function checkAuth() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, allowing access for development')
      return null
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle refresh token errors gracefully
    if (error && (error as any).code === 'refresh_token_not_found') {
      redirect('/admin/login')
    }
    
    if (error || !user) {
      redirect('/admin/login')
    }
    
    return user
  } catch (error: any) {
    // Handle refresh token errors specifically
    if (error?.code === 'refresh_token_not_found' || error?.message?.includes('refresh_token_not_found')) {
      redirect('/admin/login')
    }
    console.error('Auth check error:', error)
    redirect('/admin/login')
  }
}

export async function getCurrentUser() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle refresh token errors gracefully - return null instead of throwing
    if (error && (error as any).code === 'refresh_token_not_found') {
      return null
    }
    
    if (error) {
      return null
    }
    
    return user
  } catch (error: any) {
    // Handle refresh token errors specifically
    if (error?.code === 'refresh_token_not_found' || error?.message?.includes('refresh_token_not_found')) {
      return null
    }
    return null
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// Helper function for API routes to get authenticated user securely
export async function getAuthenticatedUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle refresh token errors gracefully
    if (error && (error as any).code === 'refresh_token_not_found') {
      return null
    }
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error: any) {
    // Handle refresh token errors specifically
    if (error?.code === 'refresh_token_not_found' || error?.message?.includes('refresh_token_not_found')) {
      return null
    }
    console.error('Error getting authenticated user:', error)
    return null
  }
}
