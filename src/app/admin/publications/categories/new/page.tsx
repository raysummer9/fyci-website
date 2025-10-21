import { checkAuth } from '@/lib/auth'
import PublicationCategoryForm from '@/components/admin/PublicationCategoryForm'

export default async function NewPublicationCategoryPage() {
  await checkAuth()

  return <PublicationCategoryForm />
}
