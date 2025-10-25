'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { BlogWithDetails, Tag } from '@/lib/admin-blog-data'
import { Upload, Plus, X, Save, Eye, FileText } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogFormProps {
  blog?: BlogWithDetails | null
  isEditing?: boolean
}

export default function BlogForm({ blog, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState('')

  // Function to calculate read time based on word count
  const calculateReadTime = (content: string): number => {
    if (!content) return 0
    
    // Remove HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length
    
    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    
    return Math.max(1, readTime) // Minimum 1 minute
  }

  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    featured_image: blog?.featured_image || '',
    category_id: blog?.category_id || '',
    status: blog?.status || 'draft',
    featured: blog?.featured || false,
    read_time: blog?.read_time || null,
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
    published_at: blog?.published_at || '',
  })

  useEffect(() => {
    loadInitialData()
    if (blog?.tags) {
      setSelectedTags(blog.tags.map(tag => tag.id))
    }
    // Calculate initial read time if blog has content
    if (blog?.content) {
      const readTime = calculateReadTime(blog.content)
      setFormData(prev => ({ ...prev, read_time: readTime }))
    }
  }, [])

  const loadInitialData = async () => {
    try {
      // Load categories (programme areas)
      const categoriesResponse = await fetch('/admin/api/categories')
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData || [])

      // Load tags
      const tagsResponse = await fetch('/admin/api/tags')
      const tagsData = await tagsResponse.json()
      setTags(tagsData || [])
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
    
    // Auto-calculate read time when content changes
    if (field === 'content') {
      const readTime = calculateReadTime(value)
      setFormData(prev => ({ ...prev, read_time: readTime }))
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/admin/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, featured_image: result.url }))
      } else {
        setError(result.error || 'Failed to upload image')
      }
    } catch (error) {
      setError('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await fetch('/admin/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() })
      })

      const result = await response.json()

      if (response.ok) {
        setTags(prev => [...prev, result])
        setSelectedTags(prev => [...prev, result.id])
        setNewTagName('')
      } else {
        setError(result.error || 'Failed to create tag')
      }
    } catch (error) {
      setError('Error creating tag')
    }
  }

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(id => id !== tagId))
    } else {
      setSelectedTags(prev => [...prev, tagId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing ? `/admin/api/blogs/${blog?.id}` : '/admin/api/blogs'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tag_ids: selectedTags
        })
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/admin/blogs')
        router.refresh()
      } else {
        setError(result.error || result.details || 'Failed to save blog post')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDraftSave = async () => {
    setIsDraftSaving(true)
    setError(null)

    try {
      const url = isEditing ? `/admin/api/blogs/${blog?.id}` : '/admin/api/blogs'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'draft',
          tag_ids: selectedTags
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Don't redirect, just show success message
        setError(null)
        // You could add a success state here if needed
      } else {
        setError(result.error || result.details || 'Failed to save draft')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      setError('An unexpected error occurred while saving draft. Please try again.')
    } finally {
      setIsDraftSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <div className="flex gap-2">
          {isEditing && blog && (
            <Button variant="outline" asChild>
              <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </a>
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="blog-post-slug"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of your blog post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.featured_image && (
                  <div className="space-y-2">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload">
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                      {uploading ? (
                        <div className="text-sm text-gray-500">Uploading...</div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <div className="text-sm text-gray-500">
                            Click to upload image
                          </div>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCreateTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagSelect(tag.id)}
                        className="rounded"
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedTags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId)
                      return tag ? (
                        <Badge key={tagId} variant="secondary" className="text-xs">
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => handleTagSelect(tagId)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>

                <div>
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    value={formData.read_time || ''}
                    onChange={(e) => handleInputChange('read_time', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Auto-calculated"
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically calculated based on content (200 words/minute)
                  </p>
                </div>

                <div>
                  <Label htmlFor="published_at">Publish Date & Time</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('published_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    placeholder="Select publish date and time"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to use current time when publishing
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDraftSave}
            disabled={isDraftSaving || isSubmitting}
          >
            {isDraftSaving ? (
              'Saving Draft...'
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button type="submit" disabled={isSubmitting || isDraftSaving}>
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Post' : 'Create Post'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
