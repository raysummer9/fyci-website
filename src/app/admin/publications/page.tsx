'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen } from 'lucide-react'
import PublicationListClient from '@/components/admin/PublicationListClient'

export default function AdminPublications() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Manage publications, PDF files, and resources.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/publications/categories">
            <Button variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </Link>
          <Link href="/admin/publications/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Publication
            </Button>
          </Link>
        </div>
      </div>

      <PublicationListClient />
    </div>
  )
}
