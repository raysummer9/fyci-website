import Link from 'next/link'
import { checkAuth } from '@/lib/auth'
import { getCompetition } from '@/lib/admin-programme-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import CompetitionForm from '@/components/admin/CompetitionForm'

interface EditCompetitionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCompetition({ params }: EditCompetitionPageProps) {
  await checkAuth()
  const { id } = await params
  const competition = await getCompetition(id)

  if (!competition) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Competition Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The competition you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
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
        <Link href={`/admin/programme-areas/${competition.programme_area_id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Competition</h1>
          <p className="text-muted-foreground">
            Update competition details for &quot;{competition.title}&quot;
          </p>
        </div>
      </div>

      <CompetitionForm competition={competition} isEditing={true} programmeAreaId={competition.programme_area_id} />
    </div>
  )
}
