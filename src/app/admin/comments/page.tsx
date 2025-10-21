import { checkAuth } from '@/lib/auth'
import CommentsManagement from '@/components/admin/CommentsManagement'

export default async function AdminCommentsPage() {
  await checkAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">
          Manage and moderate blog comments.
        </p>
      </div>

      <CommentsManagement />
    </div>
  )
}
