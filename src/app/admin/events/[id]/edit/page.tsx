import Link from 'next/link'
import { checkAuth } from '@/lib/auth'
import { getEvent } from '@/lib/admin-programme-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import EventForm from '@/components/admin/EventForm'

interface EditEventPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEvent({ params }: EditEventPageProps) {
  await checkAuth()
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The event you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href="/admin/programme-areas">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programme Areas
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/programme-areas/${event.programme_area_id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">
            Update event details for "{event.title}"
          </p>
        </div>
      </div>

      <EventForm event={event} isEditing={true} programmeAreaId={event.programme_area_id} />
    </div>
  )
}
