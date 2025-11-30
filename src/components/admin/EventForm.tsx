'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Event } from '@/lib/admin-programme-data'
import { Upload, X, Save, FileText } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import FilePickerModal from './FilePickerModal'

interface EventFormProps {
  event?: Event | null
  isEditing?: boolean
  programmeAreaId: string
}

export default function EventForm({ event, isEditing = false, programmeAreaId }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showFilePicker, setShowFilePicker] = useState(false)

  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    content: event?.content || '',
    featured_image: event?.featured_image || '',
    status: event?.status || 'upcoming',
    start_date: event?.start_date ? event.start_date.split('T')[0] + 'T' + event.start_date.split('T')[1].slice(0, 5) : '',
    end_date: event?.end_date ? event.end_date.split('T')[0] + 'T' + event.end_date.split('T')[1].slice(0, 5) : '',
    location: event?.location || '',
    venue: event?.venue || '',
    is_online: event?.is_online || false,
    meeting_url: event?.meeting_url || '',
    registration_url: event?.registration_url || '',
    max_attendees: event?.max_attendees || '',
    featured: event?.featured || false,
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
      const url = isEditing ? `/admin/api/events/${event?.id}` : '/admin/api/events'
      const method = isEditing ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        programme_area_id: programmeAreaId,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        max_attendees: formData.max_attendees ? parseInt(String(formData.max_attendees)) : null,
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
        setError(result.error || result.details || 'Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDraftSave = async () => {
    setIsDraftSaving(true)
    setError(null)

    try {
      const url = isEditing ? `/admin/api/events/${event?.id}` : '/admin/api/events'
      const method = isEditing ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        status: 'upcoming', // For events, we'll use 'upcoming' as the default draft status
        programme_area_id: programmeAreaId,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        max_attendees: formData.max_attendees ? parseInt(String(formData.max_attendees)) : null,
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
          {isEditing ? 'Edit Event' : 'Create New Event'}
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
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="event-slug"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the event"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Write event details here..."
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
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    placeholder="Venue name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Online Event */}
            <Card>
              <CardHeader>
                <CardTitle>Online Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_online"
                    checked={formData.is_online}
                    onCheckedChange={(checked) => handleInputChange('is_online', checked)}
                  />
                  <Label htmlFor="is_online">This is an online event</Label>
                </div>
                {formData.is_online && (
                  <div>
                    <Label htmlFor="meeting_url">Meeting URL</Label>
                    <Input
                      id="meeting_url"
                      value={formData.meeting_url}
                      onChange={(e) => handleInputChange('meeting_url', e.target.value)}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Registration */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="registration_url">Registration URL</Label>
                  <Input
                    id="registration_url"
                    value={formData.registration_url}
                    onChange={(e) => handleInputChange('registration_url', e.target.value)}
                    placeholder="https://eventbrite.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => handleInputChange('max_attendees', e.target.value)}
                    placeholder="100"
                    min="1"
                  />
                </div>
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
                  <Label htmlFor="featured">Featured event</Label>
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
                {isEditing ? 'Update Event' : 'Create Event'}
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
        maxSize={2 * 1024 * 1024}
      />
    </div>
  )
}
