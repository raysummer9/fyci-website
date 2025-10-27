import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from('publication_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching publication categories:', error);
      return NextResponse.json({ error: 'Failed to fetch publication categories' }, { status: 500 });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in publications categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
