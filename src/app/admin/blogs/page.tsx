import { getCurrentUser, checkAuth } from '@/lib/auth'

export default async function AdminBlogs() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
        <p className="text-muted-foreground">
          Manage blog posts, categories, and tags.
        </p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Blog management coming soon...
        </p>
      </div>
    </div>
  )
}
