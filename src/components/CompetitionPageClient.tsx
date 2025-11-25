'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Trophy } from 'lucide-react';
import { Competition } from '@/types';
import ShareButtons from '@/components/ShareButtons';
import CompetitionApplicationForm from '@/components/CompetitionApplicationForm';

interface CompetitionPageClientProps {
  competition: Competition;
}

export default function CompetitionPageClient({ competition }: CompetitionPageClientProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'closed':
        return 'bg-red-500';
      case 'judging':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open for Submissions';
      case 'closed':
        return 'Submissions Closed';
      case 'judging':
        return 'Under Review';
      case 'completed':
        return 'Competition Completed';
      default:
        return status;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const richTextClasses =
    'prose prose-lg prose-gray prose-enhanced max-w-none text-lg text-gray-700 leading-relaxed ' +
    'prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-3 ' +
    'prose-p:text-gray-700 prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold ' +
    'prose-ul:list-disc prose-ul:pl-5 prose-ul:mt-1 prose-ul:mb-3 prose-ol:list-decimal prose-ol:pl-5 prose-ol:mt-1 prose-ol:mb-3 ' +
    'prose-li:text-gray-700 prose-li:mb-0.5 prose-a:text-[#360e1d] prose-a:no-underline hover:prose-a:underline ' +
    'prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic';

  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="pt-28 sm:pt-36 pb-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-6">
            {competition.programme_areas && (
              <span className="inline-flex items-center rounded-full bg-[#ebdfe4] px-4 py-1 text-sm font-medium text-[#360e1d]">
                {competition.programme_areas.name}
              </span>
            )}

            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold text-[#0f2a20] leading-tight max-w-4xl">
              {competition.title}
            </h1>

            <div className="flex flex-wrap gap-8 text-sm sm:text-base text-gray-600">
              <div>
                <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-900">{formatDate(competition.start_date || '')}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-gray-900">{formatDate(competition.end_date || '')}</p>
              </div>
              {competition.profiles?.full_name && (
                <div>
                  <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Programme Lead</p>
                  <p className="font-medium text-gray-900">{competition.profiles.full_name}</p>
                </div>
              )}
              <div>
                <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(competition.status)}`}></span>
                  {getStatusText(competition.status)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8"
          >
            {competition.featured_image ? (
              <img
                src={competition.featured_image}
                alt={competition.title}
                className="w-full rounded-[32px]"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-100 rounded-[32px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Trophy size={64} className="mx-auto mb-4" />
                  <p className="text-lg font-medium">No image available</p>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="max-w-5xl space-y-12">
            {competition.description && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-3xl font-semibold text-[#0f2a20]">Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{competition.description}</p>
              </motion.div>
            )}

            {competition.content && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div
                  className={richTextClasses}
                  dangerouslySetInnerHTML={{ __html: competition.content }}
                />
              </motion.div>
            )}

            {competition.rules && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#0f2a20]">Rules & Guidelines</h3>
                <div
                  className={richTextClasses}
                  dangerouslySetInnerHTML={{ __html: competition.rules }}
                />
              </motion.div>
            )}

            {competition.prizes && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#0f2a20]">Prizes & Awards</h3>
                <div
                  className={richTextClasses}
                  dangerouslySetInnerHTML={{ __html: competition.prizes }}
                />
              </motion.div>
            )}

            {competition.programme_areas && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#0f2a20]">Programme Area</h3>
                <p className="text-gray-700 leading-relaxed">
                  {competition.programme_areas.description || 'Learn more about the programme area driving this competition.'}
                </p>
                <Link
                  href={`/programme-areas/${competition.programme_areas.slug}`}
                  className="inline-flex items-center gap-2 text-[#360e1d] font-medium hover:underline"
                >
                  Explore this programme area
                  <ArrowLeft size={16} className="rotate-180" />
                </Link>
              </motion.div>
            )}

            {competition.status === 'open' && competition.application_form?.enabled && (
              <motion.div variants={itemVariants}>
                <CompetitionApplicationForm competition={competition} />
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2a20]">Share this competition</h3>
                    <p className="text-gray-600 text-sm">Spread the word with your community.</p>
                  </div>
                  <ShareButtons
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/competitions/${competition.slug}`}
                    title={competition.title}
                    description={competition.description}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
