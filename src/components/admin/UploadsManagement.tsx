'use client'

import { useState, useEffect } from 'react'
import { Upload, Search, Trash2, Eye, Image as ImageIcon, FileText, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FileItem {
  name: string
  path: string
  url: string
  size: number
  created_at: string
  type: 'image' | 'pdf' | 'other'
}

export default function UploadsManagement() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'pdf'>('all')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [selectedType])

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }

      const response = await fetch(`/admin/api/files?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        setError('Failed to fetch files')
        setFiles([])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      setError('Error fetching files')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is 2MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Determine upload endpoint based on file type
      let uploadEndpoint = '/admin/api/upload'
      if (file.type === 'application/pdf') {
        uploadEndpoint = '/admin/api/publications/upload'
      }

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        // Refresh file list
        await fetchFiles()
        // Reset file input
        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setError(result.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setDeleting(filePath)
    try {
      const response = await fetch(`/admin/api/files?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchFiles()
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      setError('Error deleting file')
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Upload New File</h2>
              <p className="text-sm text-gray-500 mb-4">
                Maximum file size: 2MB. Supported types: Images (JPEG, PNG, WebP, GIF) and PDFs.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  id="file-upload-input"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                    e.target.value = '' // Reset input
                  }}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 float-right"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All
              </Button>
              <Button
                variant={selectedType === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('image')}
              >
                Images
              </Button>
              <Button
                variant={selectedType === 'pdf' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('pdf')}
              >
                PDFs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading files...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No files found matching your search' : 'No files uploaded yet'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.path}
                  className="relative group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* File Preview */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <FileText className="h-12 w-12 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
                          {file.name}
                        </span>
                      </div>
                    )}
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(file.path)}
                          disabled={deleting === file.path}
                        >
                          {deleting === file.path ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* File Info */}
                  <div className="p-3 bg-white">
                    <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      <span className="text-xs text-gray-400">{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

