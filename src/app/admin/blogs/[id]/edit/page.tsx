import { checkAuth } from '@/lib/auth'
import { getBlog } from '@/lib/admin-blog-data'
import BlogForm from '@/components/admin/BlogForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPage({ params }: PageProps) {
  await checkAuth()
  
  const blog = await getBlog(params.id)
  
  if (!blog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-muted-foreground">
          The blog post you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    )
  }

  return <BlogForm blog={blog} isEditing={true} />
}
