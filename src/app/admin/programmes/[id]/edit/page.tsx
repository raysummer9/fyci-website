import Link from 'next/link'
import { checkAuth } from '@/lib/auth'
import { getProgramme } from '@/lib/admin-programme-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ProgrammeForm from '@/components/admin/ProgrammeForm'

interface EditProgrammePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProgramme({ params }: EditProgrammePageProps) {
  await checkAuth()
  const { id } = await params
  const programme = await getProgramme(id)

  if (!programme) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Programme Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The programme you're looking for doesn't exist or you don't have access to it.
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
        <Link href={`/admin/programme-areas/${programme.programme_area_id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Programme</h1>
          <p className="text-muted-foreground">
            Update programme details for "{programme.title}"
          </p>
        </div>
      </div>

      <ProgrammeForm programme={programme} isEditing={true} programmeAreaId={programme.programme_area_id} />
    </div>
  )
}
