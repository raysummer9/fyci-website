import { checkAuth } from '@/lib/auth'
import PublicationForm from '@/components/admin/PublicationForm'

export default async function NewPublicationPage() {
  await checkAuth()

  return <PublicationForm />
}
