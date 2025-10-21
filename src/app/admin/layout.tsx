import { getCurrentUser } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current user details (this will be null if not authenticated)
  const user = await getCurrentUser()
  
  // If no user, just render children without the header (middleware will handle redirects)
  if (!user) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar userEmail={user?.email} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
