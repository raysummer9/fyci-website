import Link from 'next/link'
import { checkAuth } from '@/lib/auth'
import { getPublicationCategories } from '@/lib/admin-publication-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit } from 'lucide-react'

export default async function PublicationCategoriesPage() {
  await checkAuth()
  
  const categories = await getPublicationCategories()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Publication Categories</h1>
          <p className="text-muted-foreground">
            Manage categories for organizing publications.
          </p>
        </div>
        <Link href="/admin/publications/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No publication categories yet.
          </p>
          <Link href="/admin/publications/categories/new">
            <Button>Create your first category</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Link href={`/admin/publications/categories/${category.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  {category.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Slug:</span>
                    <Badge variant="secondary">{category.slug}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort Order:</span>
                    <Badge variant="outline">{category.sort_order}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
