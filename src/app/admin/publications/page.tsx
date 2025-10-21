import { getCurrentUser, checkAuth } from '@/lib/auth'

export default async function AdminPublications() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Publications</h1>
        <p className="text-muted-foreground">
          Manage publications and resources.
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Publication management coming soon...
        </p>
      </div>
    </div>
  )
}
