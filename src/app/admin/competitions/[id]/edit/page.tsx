import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EditCompetitionPageProps {
  params: {
    id: string
  }
}

export default async function EditCompetition({ params }: EditCompetitionPageProps) {
  await checkAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programme-areas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Competition</h1>
          <p className="text-muted-foreground">
            Update competition details
          </p>
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Competition edit form coming soon...
        </p>
      </div>
    </div>
  )
}
