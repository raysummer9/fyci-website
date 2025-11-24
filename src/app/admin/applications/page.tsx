import { checkAuth } from '@/lib/auth'
import ApplicationsManagement from '@/components/admin/ApplicationsManagement'

export default async function AdminApplicationsPage() {
  await checkAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Competition Applications</h1>
        <p className="text-muted-foreground">
          View and manage competition application submissions.
        </p>
      </div>

      <ApplicationsManagement />
    </div>
  )
}

