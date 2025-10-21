import { getCurrentUser, checkAuth } from '@/lib/auth'

export default async function AdminUsers() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          User management coming soon...
        </p>
      </div>
    </div>
  )
}
