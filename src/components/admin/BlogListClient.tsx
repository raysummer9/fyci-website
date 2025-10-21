'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BlogWithDetails, Tag } from '@/lib/admin-blog-data'
import { Plus, Search, Filter, Edit, Eye, Trash2, MessageCircle, Calendar, User } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

export default function BlogListClient() {
  const [blogs, setBlogs] = useState<BlogWithDetails[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category_id: '',
    tag_id: ''
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load blogs with filters
      const blogParams = new URLSearchParams()
      if (filters.search) blogParams.append('search', filters.search)
      if (filters.status) blogParams.append('status', filters.status)
      if (filters.category_id) blogParams.append('category_id', filters.category_id)
      if (filters.tag_id) blogParams.append('tag_id', filters.tag_id)

      const blogResponse = await fetch(`/admin/api/blogs?${blogParams.toString()}`)
      const blogsData = await blogResponse.json()

      // Load tags
      const tagsResponse = await fetch('/admin/api/tags')
      const tagsData = await tagsResponse.json()

      // Load categories (programme areas)
      const categoriesResponse = await fetch('/admin/api/categories')
      const categoriesData = await categoriesResponse.json()

      setBlogs(blogsData || [])
      setTags(tagsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/admin/api/blogs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id))
      } else {
        alert('Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Error deleting blog post')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blogs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={filters.category_id}
                onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tag</label>
              <select
                value={filters.tag_id}
                onChange={(e) => setFilters({ ...filters, tag_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found.</p>
              <Link href="/admin/blogs/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Blog Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{blog.title}</CardTitle>
                      <Badge className={getStatusColor(blog.status)}>
                        {blog.status}
                      </Badge>
                      {blog.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blog.author?.full_name || blog.author?.email || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {blog.comments_count} comments
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {blog.category && (
                      <Badge variant="outline">
                        {blog.category.name}
                      </Badge>
                    )}
                    {blog.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/blogs/${blog.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/blog/${blog.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
