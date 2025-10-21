import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import { getProgrammeArea } from '@/lib/admin-programme-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import CompetitionForm from '@/components/admin/CompetitionForm'

interface NewCompetitionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewCompetition({ params }: NewCompetitionPageProps) {
  await checkAuth()
  const { id } = await params
  const programmeArea = await getProgrammeArea(id)

  if (!programmeArea) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Programme Area Not Found</h1>
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
        <Link href={`/admin/programme-areas/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Competition</h1>
          <p className="text-muted-foreground">
            Create a new competition for {programmeArea.name}
          </p>
        </div>
      </div>

      <CompetitionForm programmeAreaId={id} />
    </div>
  )
}
