import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, FileText, BookOpen, Users } from 'lucide-react'
import { DashboardStats } from '@/lib/admin-data'

interface DashboardOverviewProps {
  stats: DashboardStats
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const statCards = [
    {
      title: 'Programme Areas',
      value: stats.programmeAreas,
      description: 'Total programme areas',
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Blogs',
      value: stats.blogs,
      description: 'Published blog posts',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Publications',
      value: stats.publications,
      description: 'Available publications',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Users',
      value: stats.users,
      description: 'Registered users',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
