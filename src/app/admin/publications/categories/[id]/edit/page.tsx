import { checkAuth } from '@/lib/auth'
import { getPublicationCategory } from '@/lib/admin-publication-data'
import PublicationCategoryForm from '@/components/admin/PublicationCategoryForm'
import { notFound } from 'next/navigation'

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditPublicationCategoryPage({ params }: EditCategoryPageProps) {
  await checkAuth()

  const category = await getPublicationCategory(params.id)

  if (!category) {
    notFound()
  }

  return <PublicationCategoryForm category={category} isEditing />
}
