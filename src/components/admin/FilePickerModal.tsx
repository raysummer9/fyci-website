'use client'

import { useState, useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Upload, Search, Image as ImageIcon, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FileItem {
  name: string
  path: string
  url: string
  size: number
  created_at: string
  type: 'image' | 'pdf' | 'other'
}

interface FilePickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  fileType?: 'image' | 'pdf' | 'all'
  folder?: string
  title?: string
  uploadEndpoint?: string
  allowedTypes?: string[]
  maxSize?: number // Default is 2MB
}

export default function FilePickerModal({
  open,
  onOpenChange,
  onSelect,
  fileType = 'image',
  folder,
  title = 'Select or Upload File',
  uploadEndpoint = '/admin/api/upload',
  allowedTypes,
  maxSize = 2 * 1024 * 1024 // 2MB default
}: FilePickerModalProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Fetch files when modal opens
  useEffect(() => {
    if (open) {
      fetchFiles()
    } else {
      setSearchTerm('')
      setSelectedFile(null)
    }
  }, [open, fileType, folder])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (fileType) params.append('type', fileType)
      if (folder) params.append('folder', folder)

      const response = await fetch(`/admin/api/files?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        console.error('Failed to fetch files')
        setFiles([])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        // Refresh file list
        await fetchFiles()
        // Select the newly uploaded file
        if (result.url) {
          onSelect(result.url)
          onOpenChange(false)
        }
      } else {
        alert(result.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = (url: string) => {
    onSelect(url)
    onOpenChange(false)
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Search and Upload */}
          <div className="flex gap-4">
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
            <div className="relative">
              <input
                type="file"
                id="file-upload-input"
                className="hidden"
                accept={allowedTypes?.join(',')}
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
                    Upload New
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* File List */}
          <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.path}
                    className={cn(
                      "relative group cursor-pointer border rounded-lg overflow-hidden transition-all hover:shadow-md",
                      selectedFile === file.url ? "ring-2 ring-[#360e1d] border-[#360e1d]" : "border-gray-200"
                    )}
                    onClick={() => setSelectedFile(file.url)}
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
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelect(file.url)
                            }}
                            style={{ backgroundColor: '#360e1d' }}
                            className="text-white"
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* File Info */}
                    <div className="p-2 bg-white">
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
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {selectedFile && (
              <Button
                onClick={() => handleSelect(selectedFile)}
                style={{ backgroundColor: '#360e1d' }}
                className="text-white"
              >
                Select File
              </Button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

