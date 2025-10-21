'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CommentWithBlog } from '@/lib/admin-blog-data'
import { Check, X, Trash2, Calendar, User, MessageSquare } from 'lucide-react'

interface CommentsManagementProps {
  blogId?: string // If provided, only show comments for this blog
}

export default function CommentsManagement({ blogId }: CommentsManagementProps) {
  const [comments, setComments] = useState<CommentWithBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    loadComments()
  }, [blogId, filter])

  const loadComments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (blogId) params.append('blog_id', blogId)
      if (filter !== 'all') params.append('is_approved', filter === 'approved' ? 'true' : 'false')

      const response = await fetch(`/admin/api/comments?${params.toString()}`)
      const data = await response.json()
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: string) => {
    try {
      const response = await fetch(`/admin/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: true })
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_approved: true }
            : comment
        ))
      }
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleReject = async (commentId: string) => {
    try {
      const response = await fetch(`/admin/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: false })
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_approved: false }
            : comment
        ))
      }
    } catch (error) {
      console.error('Error rejecting comment:', error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/admin/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const pendingCount = comments.filter(c => !c.is_approved).length
  const approvedCount = comments.filter(c => c.is_approved).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Comments Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and moderate blog comments
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant={filter === 'pending' ? 'default' : 'secondary'}>
            {pendingCount} Pending
          </Badge>
          <Badge variant={filter === 'approved' ? 'default' : 'secondary'}>
            {approvedCount} Approved
          </Badge>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Comments ({comments.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          size="sm"
        >
          Approved ({approvedCount})
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No comments found.' 
                  : filter === 'pending' 
                    ? 'No pending comments.' 
                    : 'No approved comments.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{comment.author_name}</h4>
                      {comment.author_email && (
                        <span className="text-sm text-muted-foreground">
                          ({comment.author_email})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {comment.blog && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Post: {comment.blog.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={comment.is_approved ? 'default' : 'secondary'}>
                    {comment.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  
                  {comment.author_url && (
                    <p className="text-sm">
                      Website: <a href={comment.author_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{comment.author_url}</a>
                    </p>
                  )}

                  <div className="flex gap-2">
                    {!comment.is_approved && (
                      <Button
                        onClick={() => handleApprove(comment.id)}
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    
                    {comment.is_approved && (
                      <Button
                        onClick={() => handleReject(comment.id)}
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDelete(comment.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
