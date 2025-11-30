import { getCurrentUser, checkAuth } from '@/lib/auth'
import UploadsManagement from '@/components/admin/UploadsManagement'

export default async function AdminUploads() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Uploads</h1>
        <p className="text-muted-foreground">
          Manage all uploaded files. Maximum file size is 2MB.
        </p>
      </div>

      <UploadsManagement />
    </div>
  )
}

