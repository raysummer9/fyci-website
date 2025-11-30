'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Programme } from '@/lib/admin-programme-data'
import { Upload, X, Save, FileText } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import FilePickerModal from './FilePickerModal'

interface ProgrammeFormProps {
  programme?: Programme | null
  isEditing?: boolean
  programmeAreaId: string
}

export default function ProgrammeForm({ programme, isEditing = false, programmeAreaId }: ProgrammeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showFilePicker, setShowFilePicker] = useState(false)

  const [formData, setFormData] = useState({
    title: programme?.title || '',
    slug: programme?.slug || '',
    description: programme?.description || '',
    content: programme?.content || '',
    featured_image: programme?.featured_image || '',
    status: programme?.status || 'draft',
    start_date: programme?.start_date ? programme.start_date.split('T')[0] : '',
    end_date: programme?.end_date ? programme.end_date.split('T')[0] : '',
    featured: programme?.featured || false,
    sort_order: programme?.sort_order || 0,
  })

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

  const handleFileSelect = (url: string) => {
    handleInputChange('featured_image', url)
    setShowFilePicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing ? `/admin/api/programmes/${programme?.id}` : '/admin/api/programmes'
      const method = isEditing ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        programme_area_id: programmeAreaId,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok) {
        router.push(`/admin/programme-areas/${programmeAreaId}`)
        router.refresh()
      } else {
        setError(result.error || result.details || 'Failed to save programme')
      }
    } catch (error) {
      console.error('Error saving programme:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDraftSave = async () => {
    setIsDraftSaving(true)
    setError(null)

    try {
      const url = isEditing ? `/admin/api/programmes/${programme?.id}` : '/admin/api/programmes'
      const method = isEditing ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        status: 'draft',
        programme_area_id: programmeAreaId,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok) {
        setError(null)
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
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Programme' : 'Create New Programme'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
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
                    placeholder="Enter programme title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="programme-slug"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of your programme"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Write programme details here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
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
                  <div
                    onClick={() => setShowFilePicker(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <div className="text-sm text-gray-500">
                        Click to select or upload image
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </CardContent>
            </Card>

            {/* Programme Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Programme Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sort Order */}
            <Card>
              <CardHeader>
                <CardTitle>Sort Order</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </CardContent>
            </Card>

            {/* Featured */}
            <Card>
              <CardHeader>
                <CardTitle>Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured programme</Label>
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
                {isEditing ? 'Update Programme' : 'Create Programme'}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* File Picker Modal */}
      <FilePickerModal
        open={showFilePicker}
        onOpenChange={setShowFilePicker}
        onSelect={handleFileSelect}
        fileType="image"
        title="Select or Upload Featured Image"
        uploadEndpoint="/admin/api/upload"
        allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
        maxSize={5 * 1024 * 1024}
      />
    </div>
  )
}
