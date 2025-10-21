import { getCurrentUser, checkAuth } from '@/lib/auth'
import UserForm from '@/components/admin/UserForm'

export default async function NewUserPage() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
        <p className="text-muted-foreground">
          Create a new user account with admin or author permissions.
        </p>
      </div>

      <UserForm />
    </div>
  )
}
