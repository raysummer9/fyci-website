import { createServerSupabaseClient } from './supabase'

// Define types for publication management
export interface PublicationCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  file_url: string | null
  cover_image: string | null
  category_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  download_count: number
  file_size: number | null
  published_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface PublicationWithDetails extends Publication {
  category?: {
    id: string
    name: string
    slug: string
  }
}

export interface PublicationFilters {
  status?: string
  category_id?: string
  search?: string
}

// ==============================================
// PUBLICATION CATEGORIES
// ==============================================

export async function getPublicationCategories(): Promise<PublicationCategory[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publication_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching publication categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getPublicationCategories:', error)
    return []
  }
}

export async function getPublicationCategory(id: string): Promise<PublicationCategory | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publication_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching publication category:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getPublicationCategory:', error)
    return null
  }
}

export async function createPublicationCategory(categoryData: {
  name: string
  slug: string
  description?: string
  sort_order?: number
}): Promise<PublicationCategory | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publication_categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) {
      console.error('Error creating publication category:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createPublicationCategory:', error)
    return null
  }
}

export async function updatePublicationCategory(
  id: string, 
  categoryData: Partial<PublicationCategory>
): Promise<PublicationCategory | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publication_categories')
      .update({
        ...categoryData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating publication category:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updatePublicationCategory:', error)
    return null
  }
}

export async function deletePublicationCategory(id: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('publication_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting publication category:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deletePublicationCategory:', error)
    return false
  }
}

// ==============================================
// PUBLICATIONS
// ==============================================

export async function getPublications(filters?: PublicationFilters): Promise<PublicationWithDetails[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('publications')
      .select(`
        *,
        publication_categories (
          id,
          name,
          slug
        )
      `)
      .order('published_at', { ascending: false, nullsFirst: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching publications:', error)
      return []
    }

    // Transform the data to match our interface
    return (data || []).map(publication => ({
      ...publication,
      category: publication.publication_categories ? {
        id: publication.publication_categories.id,
        name: publication.publication_categories.name,
        slug: publication.publication_categories.slug
      } : undefined
    }))
  } catch (error) {
    console.error('Error in getPublications:', error)
    return []
  }
}

export async function getPublication(id: string): Promise<PublicationWithDetails | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publications')
      .select(`
        *,
        publication_categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching publication:', error)
      return null
    }

    return {
      ...data,
      category: data.publication_categories ? {
        id: data.publication_categories.id,
        name: data.publication_categories.name,
        slug: data.publication_categories.slug
      } : undefined
    }
  } catch (error) {
    console.error('Error in getPublication:', error)
    return null
  }
}

export async function createPublication(publicationData: {
  title: string
  slug: string
  description?: string
  content?: string
  file_url?: string
  cover_image?: string
  category_id?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  published_at?: string
  file_size?: number
  created_by: string
}): Promise<Publication | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publications')
      .insert([publicationData])
      .select()
      .single()

    if (error) {
      console.error('Error creating publication:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createPublication:', error)
    return null
  }
}

export async function updatePublication(
  id: string, 
  publicationData: Partial<Publication> & { updated_by: string }
): Promise<Publication | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('publications')
      .update({
        ...publicationData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating publication:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updatePublication:', error)
    return null
  }
}

export async function deletePublication(id: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting publication:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deletePublication:', error)
    return false
  }
}
