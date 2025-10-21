import { createServerSupabaseClient } from './supabase'

export interface ProgrammeArea {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Programme {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  featured_image?: string
  programme_area_id: string
  status: 'draft' | 'published' | 'archived' | 'ongoing' | 'completed'
  start_date?: string
  end_date?: string
  featured: boolean
  sort_order: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Competition {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  featured_image?: string
  programme_area_id: string
  status: 'open' | 'closed'
  start_date?: string
  end_date?: string
  rules?: string
  prizes?: string
  featured: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  featured_image?: string
  programme_area_id: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  start_date: string
  end_date?: string
  location?: string
  venue?: string
  is_online: boolean
  meeting_url?: string
  registration_url?: string
  max_attendees?: number
  featured: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ProgrammeAreaWithCounts extends ProgrammeArea {
  programmes_count: number
  competitions_count: number
  events_count: number
}

// Programme Areas CRUD
export async function getProgrammeAreas(): Promise<ProgrammeAreaWithCounts[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()
    
    // First get all programme areas
    const { data: areas, error } = await supabase
      .from('programme_areas')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching programme areas:', error)
      return []
    }

    if (!areas || areas.length === 0) {
      return []
    }

    // Get counts for each area
    const areasWithCounts = await Promise.all(
      areas.map(async (area) => {
        const [programmesResult, competitionsResult, eventsResult] = await Promise.all([
          supabase.from('programmes').select('*', { count: 'exact', head: true }).eq('programme_area_id', area.id),
          supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('programme_area_id', area.id),
          supabase.from('events').select('*', { count: 'exact', head: true }).eq('programme_area_id', area.id)
        ])

        return {
          ...area,
          programmes_count: programmesResult.count || 0,
          competitions_count: competitionsResult.count || 0,
          events_count: eventsResult.count || 0
        }
      })
    )

    return areasWithCounts
  } catch (error) {
    console.error('Error fetching programme areas:', error)
    return []
  }
}

export async function getProgrammeArea(id: string): Promise<ProgrammeArea | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('programme_areas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching programme area:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching programme area:', error)
    return null
  }
}

export async function createProgrammeArea(programmeAreaData: Omit<ProgrammeArea, 'id' | 'created_at' | 'updated_at'>): Promise<ProgrammeArea | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('programme_areas')
      .insert([programmeAreaData])
      .select()
      .single()

    if (error) {
      console.error('Error creating programme area:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating programme area:', error)
    return null
  }
}

export async function updateProgrammeArea(id: string, data: Partial<ProgrammeArea>): Promise<ProgrammeArea | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: result, error } = await supabase
      .from('programme_areas')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating programme area:', error)
      return null
    }

    return result
  } catch (error) {
    console.error('Error updating programme area:', error)
    return null
  }
}

export async function deleteProgrammeArea(id: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()
    
    const { error } = await supabase
      .from('programme_areas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting programme area:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting programme area:', error)
    return false
  }
}

// Related entities for a programme area
export async function getProgrammesByArea(programmeAreaId: string): Promise<Programme[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .eq('programme_area_id', programmeAreaId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching programmes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching programmes:', error)
    return []
  }
}

export async function getCompetitionsByArea(programmeAreaId: string): Promise<Competition[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('programme_area_id', programmeAreaId)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching competitions:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching competitions:', error)
    return []
  }
}

export async function getEventsByArea(programmeAreaId: string): Promise<Event[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('programme_area_id', programmeAreaId)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Get individual items by ID
export async function getProgramme(id: string): Promise<Programme | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching programme:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching programme:', error)
    return null
  }
}

export async function getCompetition(id: string): Promise<Competition | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching competition:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching competition:', error)
    return null
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}
