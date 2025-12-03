import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication - use getUser() to verify with auth server
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin/editor role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to verify user role' }, { status: 500 })
    }

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use admin client to bypass RLS for admin operations
    const adminClient = createAdminClient()

    // Fetch all applications
    const { data: applications, error: applicationsError } = await adminClient
      .from('competition_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      return NextResponse.json({ 
        error: 'Failed to fetch applications',
        details: applicationsError.message 
      }, { status: 500 })
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json([])
    }

    // Get unique competition IDs
    const competitionIds = [...new Set(applications.map(app => app.competition_id))]

    // Fetch all competitions using admin client
    const { data: competitions, error: competitionsError } = await adminClient
      .from('competitions')
      .select('id, title, slug, application_form')
      .in('id', competitionIds)

    if (competitionsError) {
      console.error('Error fetching competitions:', competitionsError)
      return NextResponse.json({ 
        error: 'Failed to fetch competitions',
        details: competitionsError.message 
      }, { status: 500 })
    }

    // Create a map of competition ID to competition data
    const competitionMap = new Map(
      competitions?.map(comp => [comp.id, comp]) || []
    )

    // Transform the data to match the expected format
    const transformedApplications = applications.map(app => {
      const competition = competitionMap.get(app.competition_id)
      return {
        ...app,
        competition: competition ? {
          id: competition.id,
          title: competition.title,
          slug: competition.slug,
          application_form: competition.application_form
        } : null
      }
    })

    return NextResponse.json(transformedApplications)
  } catch (error) {
    console.error('Error in GET /admin/api/applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

