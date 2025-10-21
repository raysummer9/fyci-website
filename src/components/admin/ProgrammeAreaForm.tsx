'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ProgrammeArea } from '@/lib/admin-programme-data'

interface ProgrammeAreaFormProps {
  programmeArea?: ProgrammeArea | null
  isEditing?: boolean
}

export default function ProgrammeAreaForm({ programmeArea, isEditing = false }: ProgrammeAreaFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: programmeArea?.name || '',
    slug: programmeArea?.slug || '',
    description: programmeArea?.description || '',
    icon: programmeArea?.icon || '',
    color: programmeArea?.color || '#e5e7eb',
    is_active: programmeArea?.is_active ?? true,
    sort_order: programmeArea?.sort_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing 
        ? `/admin/api/programme-areas/${programmeArea?.id}`
        : '/admin/api/programme-areas'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/admin/programme-areas')
        router.refresh()
      } else {
        setError(result.error || result.details || 'Failed to save programme area')
        console.error('Failed to save programme area:', result)
      }
    } catch (error) {
      console.error('Error saving programme area:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Programme Area' : 'Create New Programme Area'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter programme area name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="programme-area-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly version of the name. Used in website URLs.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this programme area"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Icon name or URL"
              />
              <p className="text-sm text-muted-foreground">
                Icon identifier or URL for this programme area.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-3">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#e5e7eb"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Color code for this programme area.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first in lists.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
