'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PublicationWithDetails, PublicationCategory } from '@/lib/admin-publication-data'
import { Plus, Search, Filter, Edit, Eye, Trash2, FileText, Calendar, User, Download } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

export default function PublicationListClient() {
  const [publications, setPublications] = useState<PublicationWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadPublications()
  }, [search, statusFilter, categoryFilter])

  const loadData = async () => {
    try {
      await Promise.all([
        loadPublications(),
        loadCategories()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadPublications = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter && categoryFilter !== 'all') params.append('category_id', categoryFilter)

      const response = await fetch(`/admin/api/publications?${params}`)
      const data = await response.json()
      setPublications(data || [])
    } catch (error) {
      console.error('Error loading publications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/admin/api/publication-categories')
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/admin/api/publications/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPublications(publications.filter(p => p.id !== id))
      } else {
        const result = await response.json()
        alert(result.error || 'Failed to delete publication')
      }
    } catch (error) {
      console.error('Error deleting publication:', error)
      alert('Failed to delete publication')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading publications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search publications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Publications List */}
      {publications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No publications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || (statusFilter && statusFilter !== 'all') || (categoryFilter && categoryFilter !== 'all')
                  ? 'No publications match your filters.'
                  : 'Get started by creating a new publication.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {publications.map((publication) => (
            <Card key={publication.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <Link 
                        href={`/admin/publications/${publication.id}/edit`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {publication.title}
                      </Link>
                    </CardTitle>
                    {publication.description && (
                      <CardDescription className="line-clamp-2">
                        {publication.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(publication.status)}>
                      {publication.status}
                    </Badge>
                    {publication.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                    {publication.category && (
                      <Badge variant="secondary">{publication.category.name}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {publication.published_at ? new Date(publication.published_at).toLocaleDateString() : 'Not published'}
                      </span>
                    </div>
                    {publication.file_url && (
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{formatFileSize(publication.file_size)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{publication.download_count} downloads</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {publication.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={publication.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View PDF
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/publications/${publication.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(publication.id)}
                      disabled={deleting === publication.id}
                    >
                      {deleting === publication.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
