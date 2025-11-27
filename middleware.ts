import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If not configured, allow access to all admin routes for development
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Handle refresh token errors by clearing invalid cookies
    if (error && (error as any).code === 'refresh_token_not_found') {
      // Clear auth cookies
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      response.cookies.delete('supabase-auth-token')
      
      // If on admin route, redirect to login
      if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return response
    }

    // Check if the route is an admin route (excluding login)
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
      if (!user || error) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }

    // Redirect authenticated users away from login page
    if (request.nextUrl.pathname === '/admin/login' && user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  } catch (error: any) {
    // Handle refresh token errors specifically
    if (error?.code === 'refresh_token_not_found' || error?.message?.includes('refresh_token_not_found')) {
      // Clear auth cookies
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      response.cookies.delete('supabase-auth-token')
      
      // If on admin route, redirect to login
      if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return response
    }
    
    // If there's an error with Supabase, allow access for development
    console.warn('Supabase auth error:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
