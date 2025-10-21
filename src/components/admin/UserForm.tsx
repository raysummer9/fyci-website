'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Profile } from '@/lib/admin-user-data'
import { UserPlus, Save, AlertCircle } from 'lucide-react'

interface UserFormProps {
  user?: Profile
  isEditing?: boolean
}

interface FormData {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'author'
}

export default function UserForm({ user, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || '',
    password: '',
    full_name: user?.full_name || '',
    role: (user?.role as 'admin' | 'author') || 'author'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/admin/api/users/${user?.id}` : '/admin/api/users'
      const method = isEditing ? 'PUT' : 'POST'
      
      // For updates, only send changed fields and exclude password if not changed
      const submitData = isEditing 
        ? {
            full_name: formData.full_name,
            role: formData.role
          }
        : {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} user`)
      }

      router.push('/admin/users')
      router.refresh()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} user:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} user`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          <CardTitle>{isEditing ? 'Edit User' : 'Add New User'}</CardTitle>
        </div>
        <CardDescription>
          {isEditing 
            ? 'Update user information and permissions.' 
            : 'Create a new user account with admin or author permissions.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                required={!isEditing}
                disabled={isEditing}
                className="w-full"
              />
              {isEditing && (
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed after creation
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'author') => handleChange('role', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full access to all features</SelectItem>
                <SelectItem value="author">Author - Limited to creating blogs only</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              <p><strong>Admin:</strong> Full access to all features including user management</p>
              <p><strong>Author:</strong> Limited to creating and managing their own blog posts</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/users')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
