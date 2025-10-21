import { checkAuth } from '@/lib/auth'
import { getPublicationCategory } from '@/lib/admin-publication-data'
import PublicationCategoryForm from '@/components/admin/PublicationCategoryForm'
import { notFound } from 'next/navigation'

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPublicationCategoryPage({ params }: EditCategoryPageProps) {
  await checkAuth()
  const { id } = await params

  const category = await getPublicationCategory(id)

  if (!category) {
    notFound()
  }

  return <PublicationCategoryForm category={category} isEditing />
}
