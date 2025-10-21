import { checkAuth } from '@/lib/auth'
import BlogForm from '@/components/admin/BlogForm'

export default async function NewBlogPage() {
  await checkAuth()

  return <BlogForm />
}
