import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Competition } from '@/types';
import Footer from '@/components/Footer';
import CompetitionPageClient from '@/components/CompetitionPageClient';
import { createServerSupabaseClient } from '@/lib/supabase';

interface CompetitionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompetitionPage({ params }: CompetitionPageProps) {
  const { slug } = await params;
  
  let competition: Competition | null = null;
  let error: string | null = null;

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      error = 'Database not configured';
    } else {
      const supabase = await createServerSupabaseClient();

      const { data, error: fetchError } = await supabase
        .from('competitions')
        .select(`
          id,
          title,
          slug,
          description,
          content,
          featured_image,
          status,
          start_date,
          end_date,
          rules,
          prizes,
          featured,
          created_at,
          updated_at,
          programme_areas!programme_area_id (
            id,
            name,
            slug,
            description,
            icon,
            color
          ),
          profiles!created_by (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .in('status', ['open', 'closed', 'judging', 'completed'])
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          error = 'Competition not found';
        } else {
          error = 'Failed to fetch competition';
        }
      } else {
        competition = {
          ...data,
          programme_areas: data.programme_areas?.[0] || null,
          profiles: data.profiles?.[0] || null
        };
      }
    }
  } catch (err) {
    error = 'Failed to load competition';
    console.error('Error fetching competition:', err);
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-gray-900">
          <h1 className="text-2xl font-bold mb-4">Competition Not Found</h1>
          <p className="mb-6">The competition you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/programme-areas" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Programme Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <CompetitionPageClient competition={competition} />
      <Footer />
    </>
  );
}