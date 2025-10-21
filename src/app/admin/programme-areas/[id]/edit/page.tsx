import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getProgrammeArea } from '@/lib/admin-programme-data'
import ProgrammeAreaForm from '@/components/admin/ProgrammeAreaForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EditProgrammeAreaPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProgrammeArea({ params }: EditProgrammeAreaPageProps) {
  await checkAuth()
  const user = await getCurrentUser()
  const { id } = await params
  const programmeArea = await getProgrammeArea(id)

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programme-areas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Programme Area</h1>
          <p className="text-muted-foreground">
            Update the programme area details.
          </p>
        </div>
      </div>

      <ProgrammeAreaForm programmeArea={programmeArea} isEditing />
    </div>
  )
}
