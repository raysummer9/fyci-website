import { checkAuth } from '@/lib/auth'
import { getPublication } from '@/lib/admin-publication-data'
import PublicationForm from '@/components/admin/PublicationForm'
import { notFound } from 'next/navigation'

interface EditPublicationPageProps {
  params: {
    id: string
  }
}

export default async function EditPublicationPage({ params }: EditPublicationPageProps) {
  await checkAuth()

  const publication = await getPublication(params.id)

  if (!publication) {
    notFound()
  }

  return <PublicationForm publication={publication} isEditing />
}
