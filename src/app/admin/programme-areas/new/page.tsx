import Link from 'next/link'
import { getCurrentUser, checkAuth } from '@/lib/auth'
import ProgrammeAreaForm from '@/components/admin/ProgrammeAreaForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function NewProgrammeArea() {
  await checkAuth()
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programme-areas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Programme Area</h1>
          <p className="text-muted-foreground">
            Add a new programme area to organize your content.
          </p>
        </div>
      </div>

      <ProgrammeAreaForm />
    </div>
  )
}
