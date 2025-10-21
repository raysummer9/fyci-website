import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only images are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `blog-images/${fileName}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use admin client for storage operations to bypass RLS
    const adminSupabase = createAdminClient()

    // Upload to Supabase Storage
    const { data, error } = await adminSupabase.storage
      .from('media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return NextResponse.json({ 
        error: 'Failed to upload file',
        details: error.message 
      }, { status: 500 })
    }

    // Get public URL using the regular client
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      path: data.path,
      url: urlData.publicUrl
    })
  } catch (error) {
    console.error('Error in POST /api/upload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
