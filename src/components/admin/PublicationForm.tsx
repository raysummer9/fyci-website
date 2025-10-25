'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PublicationWithDetails, PublicationCategory } from '@/lib/admin-publication-data'
import { Upload, X, Save, Eye, FileText } from 'lucide-react'

interface PublicationFormProps {
  publication?: PublicationWithDetails | null
  isEditing?: boolean
}

export default function PublicationForm({ publication, isEditing = false }: PublicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<PublicationCategory[]>([])

  const [formData, setFormData] = useState({
    title: publication?.title || '',
    slug: publication?.slug || '',
    description: publication?.description || '',
    content: publication?.content || '',
    file_url: publication?.file_url || '',
    cover_image: publication?.cover_image || '',
    category_id: publication?.category_id || '',
    status: publication?.status || 'draft',
    featured: publication?.featured || false,
    published_at: publication?.published_at || '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/admin/api/publication-categories')
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing 
        ? `/admin/api/publications/${publication?.id}`
        : '/admin/api/publications'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          file_size: publication?.file_size
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} publication`)
      }

      router.push('/admin/publications')
      router.refresh()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} publication:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} publication`)
    } finally {
      setIsSubmitting(false)
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
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/admin/api/publications/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        handleInputChange('file_url', result.url)
        // Store file size for reference
        handleInputChange('file_size', result.size)
      } else {
        throw new Error(result.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleCoverImageUpload = async (file: File) => {
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
        handleInputChange('cover_image', result.url)
      } else {
        setError(result.error || 'Failed to upload cover image')
      }
    } catch (error) {
      setError('Error uploading cover image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Edit Publication' : 'Create New Publication'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Content */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Publication title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="URL-friendly identifier"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Used in URLs. Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the publication"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Publication content or summary"
                    rows={6}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Publication</Label>
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

                {/* File Upload */}
                <div>
                  <Label>PDF File *</Label>
                  <div className="mt-2">
                    {formData.file_url ? (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium">PDF uploaded</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('file_url', '')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="file-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload PDF file
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                PDF files up to 50MB
                              </span>
                            </Label>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept=".pdf,application/pdf"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleFileUpload(file)
                                }
                              }}
                              disabled={uploading}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      Uploading file...
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                <div>
                  <Label htmlFor="cover_image">Cover Image</Label>
                  {formData.cover_image && (
                    <div className="space-y-2 mb-4">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('cover_image', '')}
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
                        if (file) handleCoverImageUpload(file)
                      }}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <Label htmlFor="cover-image-upload">
                      <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                        {uploading ? (
                          <div className="text-sm text-gray-500">Uploading...</div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            <div className="text-sm text-gray-500">
                              Click to upload cover image
                            </div>
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || uploading}>
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Publication' : 'Create Publication')}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
