'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BlogWithDetails, Tag } from '@/lib/admin-blog-data'
import { Plus, Search, Filter, Edit, Eye, Trash2, MessageCircle } from 'lucide-react'
import BlogListClient from '@/components/admin/BlogListClient'

export default function AdminBlogs() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage blog posts, approve comments, and organize content.
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </Link>
      </div>

      <BlogListClient />
    </div>
  )
}
