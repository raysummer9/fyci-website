import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getProgrammeAreas } from '@/lib/admin-programme-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Map, Plus, Edit, Eye, Users, Trophy, Calendar } from 'lucide-react'

export default async function AdminProgrammeAreas() {
  await checkAuth()
  const user = await getCurrentUser()
  const programmeAreas = await getProgrammeAreas()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Programme Areas</h1>
          <p className="text-muted-foreground">
            Manage programme areas and their content including programmes, competitions, and events.
          </p>
        </div>
        <Link href="/admin/programme-areas/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Programme Area
          </Button>
        </Link>
      </div>

      {programmeAreas.length === 0 ? (
        <div className="text-center py-12">
          <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No programme areas yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first programme area.
          </p>
          <Link href="/admin/programme-areas/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Programme Area
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programmeAreas.map((area) => (
            <Card key={area.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: area.color || '#e5e7eb' }}
                    >
                      <Map className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {area.description || 'No description provided'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={area.is_active ? 'default' : 'secondary'}>
                    {area.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Content Counts */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Programmes</span>
                    </div>
                    <div className="text-lg font-semibold">{area.programmes_count}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>Competitions</span>
                    </div>
                    <div className="text-lg font-semibold">{area.competitions_count}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Events</span>
                    </div>
                    <div className="text-lg font-semibold">{area.events_count}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/admin/programme-areas/${area.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/admin/programme-areas/${area.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
