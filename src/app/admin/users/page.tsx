import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getUsers, Profile } from '@/lib/admin-user-data'
import UserListClient from '@/components/admin/UserListClient'

export default async function AdminUsers() {
  await checkAuth()
  const user = await getCurrentUser()

  // Fetch initial users data
  let initialUsers: Profile[] = []
  try {
    initialUsers = await getUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
    // Component will handle empty state
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      <UserListClient initialUsers={initialUsers} />
    </div>
  )
}
