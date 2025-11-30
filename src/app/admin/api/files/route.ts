import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('type') || 'image' // 'image', 'pdf', or 'all'
    const folder = searchParams.get('folder') // Optional folder filter

    // Use admin client for storage operations
    const adminSupabase = createAdminClient()

    // Define folders to search based on file type
    const foldersToSearch: string[] = []
    
    if (fileType === 'image' || fileType === 'all') {
      foldersToSearch.push('blog-images')
    }
    
    if (fileType === 'pdf' || fileType === 'all') {
      foldersToSearch.push('publications')
    }
    
    if (fileType === 'all') {
      foldersToSearch.push('competition-applications')
    }

    // If folder is specified, only search that folder
    const searchFolders = folder ? [folder] : foldersToSearch

    // Fetch files from all relevant folders
    const allFiles: Array<{
      name: string
      path: string
      url: string
      size: number
      created_at: string
      type: string
    }> = []

    for (const searchFolder of searchFolders) {
      const { data: files, error } = await adminSupabase.storage
        .from('media')
        .list(searchFolder, {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        console.error(`Error listing files in ${searchFolder}:`, error)
        continue
      }

      if (files) {
        // Get public URLs for each file
        for (const file of files) {
          if (file.name && !file.name.startsWith('.')) {
            const filePath = `${searchFolder}/${file.name}`
            const { data: urlData } = adminSupabase.storage
              .from('media')
              .getPublicUrl(filePath)

            // Determine file type from extension
            const ext = file.name.split('.').pop()?.toLowerCase() || ''
            const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
            const isPdf = ext === 'pdf'

            // Filter based on requested type
            if (fileType === 'image' && !isImage) continue
            if (fileType === 'pdf' && !isPdf) continue

            // Get file metadata if available
            let fileSize = 0
            const createdAt = file.created_at || new Date().toISOString()
            
            // Try to get metadata from file object
            if (file.metadata && typeof file.metadata === 'object') {
              fileSize = file.metadata.size || 0
            } else if (typeof file.metadata === 'string') {
              try {
                const metadata = JSON.parse(file.metadata)
                fileSize = metadata.size || 0
              } catch {
                // Ignore parse errors
              }
            }

            allFiles.push({
              name: file.name,
              path: filePath,
              url: urlData.publicUrl,
              size: fileSize,
              created_at: createdAt,
              type: isImage ? 'image' : isPdf ? 'pdf' : 'other'
            })
          }
        }
      }
    }

    // Sort by created_at descending (newest first)
    allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ files: allFiles })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

