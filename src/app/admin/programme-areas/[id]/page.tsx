import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getProgrammeArea, getProgrammesByArea, getCompetitionsByArea, getEventsByArea } from '@/lib/admin-programme-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Plus, Users, Trophy, Calendar, Map } from 'lucide-react'

interface ProgrammeAreaDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProgrammeAreaDetail({ params }: ProgrammeAreaDetailPageProps) {
  await checkAuth()
  const user = await getCurrentUser()

  const [programmeArea, programmes, competitions, events] = await Promise.all([
    getProgrammeArea(params.id),
    getProgrammesByArea(params.id),
    getCompetitionsByArea(params.id),
    getEventsByArea(params.id)
  ])

  if (!programmeArea) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Programme Area Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The programme area you're looking for doesn't exist.
          </p>
          <Link href="/admin/programme-areas">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programme Areas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/programme-areas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: programmeArea.color || '#e5e7eb' }}
              >
                <Map className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{programmeArea.name}</h1>
                <p className="text-muted-foreground">
                  {programmeArea.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/admin/programme-areas/${programmeArea.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Status and Info */}
      <div className="flex items-center gap-4">
        <Badge variant={programmeArea.is_active ? 'default' : 'secondary'} className="text-sm">
          {programmeArea.is_active ? 'Active' : 'Inactive'}
        </Badge>
        <div className="text-sm text-muted-foreground">
          Slug: <code className="bg-muted px-2 py-1 rounded">{programmeArea.slug}</code>
        </div>
        <div className="text-sm text-muted-foreground">
          Sort Order: {programmeArea.sort_order}
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Programmes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Programmes</CardTitle>
                <CardDescription>
                  {programmes.length} {programmes.length === 1 ? 'programme' : 'programmes'}
                </CardDescription>
              </div>
              <Link href={`/admin/programme-areas/${programmeArea.id}/programmes/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {programmes.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No programmes yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {programmes.slice(0, 3).map((programme) => (
                    <div key={programme.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{programme.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {programme.status}
                        </Badge>
                      </div>
                      <Link href={`/admin/programmes/${programme.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {programmes.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{programmes.length - 3} more programmes
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Competitions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Competitions</CardTitle>
                <CardDescription>
                  {competitions.length} {competitions.length === 1 ? 'competition' : 'competitions'}
                </CardDescription>
              </div>
              <Link href={`/admin/programme-areas/${programmeArea.id}/competitions/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {competitions.length === 0 ? (
                <div className="text-center py-6">
                  <Trophy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No competitions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {competitions.slice(0, 3).map((competition) => (
                    <div key={competition.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{competition.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {competition.status}
                        </Badge>
                      </div>
                      <Link href={`/admin/competitions/${competition.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {competitions.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{competitions.length - 3} more competitions
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Events */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Events</CardTitle>
                <CardDescription>
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </CardDescription>
              </div>
              <Link href={`/admin/programme-areas/${programmeArea.id}/events/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No events yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {event.status}
                        </Badge>
                      </div>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{events.length - 3} more events
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
