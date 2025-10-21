import { createServerSupabaseClient } from './supabase'

export interface DashboardStats {
  programmeAreas: number
  blogs: number
  publications: number
  users: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Return mock data for development
      return {
        programmeAreas: 4,
        blogs: 12,
        publications: 8,
        users: 5
      }
    }

    const supabase = await createServerSupabaseClient()

    // Fetch counts in parallel
    const [programmeAreasResult, blogsResult, publicationsResult, usersResult] = await Promise.all([
      supabase.from('programme_areas').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('publications').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ])

    return {
      programmeAreas: programmeAreasResult.count || 0,
      blogs: blogsResult.count || 0,
      publications: publicationsResult.count || 0,
      users: usersResult.count || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return mock data on error
    return {
      programmeAreas: 4,
      blogs: 12,
      publications: 8,
      users: 5
    }
  }
}
