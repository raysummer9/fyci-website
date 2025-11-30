import { createServerSupabaseClient } from './supabase'

// Define types for blog management
export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  likes: number
  read_time: number | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface BlogWithDetails extends Blog {
  category?: {
    id: string
    name: string
    slug: string
  } // Deprecated: Use categories array instead
  categories?: {
    id: string
    name: string
    slug: string
  }[]
  tags: {
    id: string
    name: string
    slugs: string
  }[]
  author?: {
    id: string
    full_name: string | null
    email: string
  }
  comments_count: number
}

export interface Tag {
  id: string
  name: string
  slugs: string
  color: string | null
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  blog_id: string
  parent_id: string | null
  content: string
  author_name: string
  author_email: string | null
  author_url: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface CommentWithBlog extends Comment {
  blog?: {
    id: string
    title: string
    slug: string
  }
}

// Blog CRUD operations
export async function getBlogs(filters?: {
  status?: string
  category_id?: string
  tag_id?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ blogs: BlogWithDetails[], pagination: { currentPage: number, totalPages: number, totalItems: number, itemsPerPage: number } }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } }
    }

    const supabase = await createServerSupabaseClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const offset = (page - 1) * limit

    // First, get the total count for pagination
    let countQuery = supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })

    // Apply filters to count query
    if (filters?.status) {
      countQuery = countQuery.eq('status', filters.status)
    }
    
    if (filters?.category_id) {
      countQuery = countQuery.eq('category_id', filters.category_id)
    }

    if (filters?.search) {
      countQuery = countQuery.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }

    const { count: totalItems } = await countQuery

    // Now get the paginated data
    let query = supabase
      .from('blogs')
      .select(`
        *,
        category:categories(id, name, slug),
        blog_categories(
          category:categories(id, name, slug)
        ),
        blog_tags(
          tag:tags(id, name, slugs)
        ),
        author:profiles!created_by(id, full_name, email)
      `)

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }

    const { data: blogs, error } = await query
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching blogs:', error)
      return { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } }
    }

    if (!blogs) return { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } }

    // Transform the data and get comment counts
    const blogsWithDetails = await Promise.all(
      blogs.map(async (blog) => {
        // Get comment count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('blog_id', blog.id)

        // Transform tags from the nested structure
        const tags = (blog.blog_tags || []).map((bt: any) => bt.tag).filter(Boolean)

        // Get categories from blog_categories junction table
        const categories = (blog.blog_categories || []).map((bc: any) => bc.category).filter(Boolean)

        // Get category from categories table (for backward compatibility)
        let category = blog.category
        if (blog.category_id && !blog.category && categories.length === 0) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', blog.category_id)
            .single()
          category = categoryData
        }

        return {
          ...blog,
          category,
          categories: categories.length > 0 ? categories : (category ? [category] : []),
          tags,
          comments_count: commentsCount || 0
        }
      })
    )

    // Filter by tag if specified (after getting all blogs with tags)
    let filteredBlogs = blogsWithDetails
    if (filters?.tag_id) {
      filteredBlogs = blogsWithDetails.filter(blog => 
        blog.tags.some((tag: { id: string }) => tag.id === filters.tag_id)
      )
    }

    // Calculate pagination info
    const totalPages = Math.ceil((totalItems || 0) / limit)

    return {
      blogs: filteredBlogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalItems || 0,
        itemsPerPage: limit
      }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } }
  }
}

export async function getBlog(id: string): Promise<BlogWithDetails | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:categories(id, name, slug),
        blog_categories(
          category:categories(id, name, slug)
        ),
        blog_tags(
          tag:tags(id, name, slugs)
        ),
        author:profiles!created_by(id, full_name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog:', error)
      return null
    }

    if (!data) return null

    // Get comment count
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', id)

    // Transform tags
    const tags = (data.blog_tags || []).map((bt: any) => bt.tag).filter(Boolean)

    // Get categories from blog_categories junction table
    const categories = (data.blog_categories || []).map((bc: any) => bc.category).filter(Boolean)

    // Get category from categories table (for backward compatibility)
    let category = data.category
    if (data.category_id && !data.category && categories.length === 0) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('id', data.category_id)
        .single()
      category = categoryData
    }

    return {
      ...data,
      category,
      categories: categories.length > 0 ? categories : (category ? [category] : []),
      tags,
      comments_count: commentsCount || 0
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export async function createBlog(blogData: {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  category_id?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  read_time?: number
  meta_title?: string
  meta_description?: string
  published_at?: string
  category_ids?: string[]
  tag_ids?: string[]
  created_by: string
}): Promise<Blog | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { tag_ids, category_ids, created_by, ...blogInsertData } = blogData

    // Insert blog
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .insert([{
        ...blogInsertData,
        published_at: blogData.published_at && blogData.published_at.trim() !== '' 
          ? blogData.published_at 
          : (blogData.status === 'published' ? new Date().toISOString() : null)
      }])
      .select()
      .single()

    if (blogError || !blog) {
      console.error('Error creating blog:', blogError)
      return null
    }

    // Insert blog categories if provided
    if (category_ids && category_ids.length > 0) {
      const blogCategoryInserts = category_ids.map(categoryId => ({
        blog_id: blog.id,
        category_id: categoryId
      }))

      const { error: categoriesError } = await supabase
        .from('blog_categories')
        .insert(blogCategoryInserts)

      if (categoriesError) {
        console.error('Error creating blog categories:', categoriesError)
        // Blog was created, but categories failed - we'll still return the blog
      }
    }

    // Insert blog tags if provided
    if (tag_ids && tag_ids.length > 0) {
      const blogTagInserts = tag_ids.map(tagId => ({
        blog_id: blog.id,
        tag_id: tagId
      }))

      const { error: tagsError } = await supabase
        .from('blog_tags')
        .insert(blogTagInserts)

      if (tagsError) {
        console.error('Error creating blog tags:', tagsError)
        // Blog was created, but tags failed - we'll still return the blog
      }
    }

    return blog
  } catch (error) {
    console.error('Error creating blog:', error)
    return null
  }
}

export async function updateBlog(id: string, blogData: Partial<{
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_id: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  read_time: number
  meta_title: string
  meta_description: string
  published_at: string
  category_ids: string[]
  tag_ids: string[]
  updated_by: string
}>): Promise<Blog | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const { tag_ids, category_ids, updated_by, ...updateData } = blogData

    // Update blog
    const updatePayload = {
      ...updateData,
      published_at: blogData.published_at && blogData.published_at.trim() !== '' 
        ? blogData.published_at 
        : (blogData.status === 'published' ? new Date().toISOString() : undefined)
    }

    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (blogError || !blog) {
      console.error('Error updating blog:', blogError)
      return null
    }

    // Update blog categories if provided
    if (category_ids !== undefined) {
      // First, remove existing categories
      await supabase
        .from('blog_categories')
        .delete()
        .eq('blog_id', id)

      // Then, insert new categories
      if (category_ids.length > 0) {
        const blogCategoryInserts = category_ids.map(categoryId => ({
          blog_id: id,
          category_id: categoryId
        }))

        const { error: categoriesError } = await supabase
          .from('blog_categories')
          .insert(blogCategoryInserts)

        if (categoriesError) {
          console.error('Error updating blog categories:', categoriesError)
        }
      }
    }

    // Update blog tags if provided
    if (tag_ids !== undefined) {
      // First, remove existing tags
      await supabase
        .from('blog_tags')
        .delete()
          .eq('blog_id', id)

      // Then, insert new tags
      if (tag_ids.length > 0) {
        const blogTagInserts = tag_ids.map(tagId => ({
          blog_id: id,
          tag_id: tagId
        }))

        const { error: tagsError } = await supabase
          .from('blog_tags')
          .insert(blogTagInserts)

        if (tagsError) {
          console.error('Error updating blog tags:', tagsError)
        }
      }
    }

    return blog
  } catch (error) {
    console.error('Error updating blog:', error)
    return null
  }
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting blog:', error)
    return false
  }
}

// Tags CRUD operations
export async function getTags(search?: string): Promise<Tag[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('tags')
      .select('*')
      .order('name')

    // Apply search filter if provided
    if (search && search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function createTag(tagData: { name: string; color?: string }): Promise<Tag | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = await createServerSupabaseClient()

    const slugs = tagData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Create the insert data
    const insertData = {
      name: tagData.name,
      slugs: slugs,
      color: tagData.color
    }

    const { data, error } = await supabase
      .from('tags')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating tag:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating tag:', error)
    return null
  }
}

// Comments management
export async function getComments(filters?: {
  blog_id?: string
  is_approved?: boolean
}): Promise<CommentWithBlog[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('comments')
      .select(`
        *,
        blog:blogs(id, title, slug)
      `)

    if (filters?.blog_id) {
      query = query.eq('blog_id', filters.blog_id)
    }

    if (filters?.is_approved !== undefined) {
      query = query.eq('is_approved', filters.is_approved)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function updateComment(id: string, updates: { is_approved?: boolean }): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating comment:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating comment:', error)
    return false
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting comment:', error)
    return false
  }
}

// Get categories for blogs
export async function getCategories() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
