import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
