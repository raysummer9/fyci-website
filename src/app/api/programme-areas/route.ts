import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch programme areas
    const { data: programmeAreas, error: programmeAreasError } = await supabase
      .from('programme_areas')
      .select('*')
      .order('sort_order', { ascending: true });

    if (programmeAreasError) {
      console.error('Error fetching programme areas:', programmeAreasError);
      return NextResponse.json({ error: 'Failed to fetch programme areas' }, { status: 500 });
    }

    // Fetch programmes
    const { data: programmes, error: programmesError } = await supabase
      .from('programmes')
      .select('*')
      .in('status', ['published', 'completed'])
      .order('created_at', { ascending: false });

    if (programmesError) {
      console.error('Error fetching programmes:', programmesError);
      return NextResponse.json({ error: 'Failed to fetch programmes' }, { status: 500 });
    }

    // Fetch competitions
    const { data: competitions, error: competitionsError } = await supabase
      .from('competitions')
      .select('*')
      .in('status', ['open', 'closed'])
      .order('created_at', { ascending: false });

    if (competitionsError) {
      console.error('Error fetching competitions:', competitionsError);
      return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 });
    }

    // Fetch events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .in('status', ['published', 'completed'])
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    // Group content by programme area
    const contentByProgrammeArea = programmeAreas.map(area => {
      const areaProgrammes = programmes.filter(p => p.programme_area_id === area.id);
      const areaCompetitions = competitions.filter(c => c.programme_area_id === area.id);
      const areaEvents = events.filter(e => e.programme_area_id === area.id);

      return {
        ...area,
        programmes: areaProgrammes,
        competitions: areaCompetitions,
        events: areaEvents,
        totalContent: areaProgrammes.length + areaCompetitions.length + areaEvents.length
      };
    });

    // Add fallback data if no content is found
    const fallbackData = {
      programmeAreas: programmeAreas.map(area => ({
        ...area,
        programmes: [],
        competitions: [],
        events: [],
        totalContent: 0
      })),
      totalProgrammes: programmes?.length || 0,
      totalCompetitions: competitions?.length || 0,
      totalEvents: events?.length || 0
    };

    return NextResponse.json({
      programmeAreas: contentByProgrammeArea || fallbackData.programmeAreas,
      totalProgrammes: programmes?.length || 0,
      totalCompetitions: competitions?.length || 0,
      totalEvents: events?.length || 0
    });

  } catch (error) {
    console.error('Error in programme-areas API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
