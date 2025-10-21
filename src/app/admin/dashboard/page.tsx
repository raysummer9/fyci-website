import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getDashboardStats } from '@/lib/admin-data'
import DashboardOverview from '@/components/admin/DashboardOverview'

export default async function AdminDashboard() {
  // Ensure user is authenticated
  await checkAuth()
  const user = await getCurrentUser()
  
  // Fetch dashboard statistics
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <DashboardOverview stats={stats} />
    </div>
  )
}
