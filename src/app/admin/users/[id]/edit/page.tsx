import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getUser } from '@/lib/admin-user-data'
import UserForm from '@/components/admin/UserForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
  await checkAuth()
  const user = await getCurrentUser()
  
  const { id } = await params

  let userData = null
  try {
    userData = await getUser(id)
  } catch (error) {
    console.error('Error fetching user:', error)
  }

  if (!userData) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update user information and permissions.
        </p>
      </div>

      <UserForm user={userData} isEditing={true} />
    </div>
  )
}
