'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, MapPin, Trophy, Award, Users } from 'lucide-react';
import { Competition } from '@/types';
import ShareButtons from '@/components/ShareButtons';
import CompetitionApplicationForm from '@/components/CompetitionApplicationForm';

interface CompetitionPageClientProps {
  competition: Competition;
}

export default function CompetitionPageClient({ competition }: CompetitionPageClientProps) {
  const formatDate = (dateString: string) => {
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

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative py-16 sm:py-24"
          style={{ backgroundColor: '#360e1d' }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Link
                  href="/programme-areas"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeft size={20} />
                  Back to Programme Areas
                </Link>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto"
              >
                {competition.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-6 text-white/80"
              >
                {competition.programme_areas && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <span className="text-sm font-medium">{competition.programme_areas.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {competition.start_date ? formatDate(competition.start_date) : 'Ongoing'}
                  </span>
                </div>
                {competition.profiles && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span className="text-sm">{competition.profiles.full_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(competition.status)}`}></div>
                  <span className="text-sm">{getStatusText(competition.status)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Featured Image */}
            <motion.div
              variants={itemVariants}
              className="order-1"
            >
              {competition.featured_image ? (
                <img
                  src={competition.featured_image}
                  alt={competition.title}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Trophy size={64} className="mx-auto mb-4" />
                    <p className="text-lg font-medium">No image available</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              variants={itemVariants}
              className="order-2 space-y-8"
            >
              {/* Description */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Competition</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-0">
                    {competition.description}
                  </p>
                </div>
              </div>

              {/* Competition Details */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Competition Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium text-gray-900">
                          {competition.start_date ? formatDate(competition.start_date) : 'TBA'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium text-gray-900">
                          {competition.end_date ? formatDate(competition.end_date) : 'TBA'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(competition.status)}`}></div>
                          <p className="font-medium text-gray-900">{getStatusText(competition.status)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules */}
              {competition.rules && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Rules & Guidelines</h3>
                    <div 
                      className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                      dangerouslySetInnerHTML={{ __html: competition.rules }}
                    />
                  </div>
                </div>
              )}

              {/* Prizes */}
              {competition.prizes && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Prizes & Awards</h3>
                    <div 
                      className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                      dangerouslySetInnerHTML={{ __html: competition.prizes }}
                    />
                  </div>
                </div>
              )}

              {/* Full Content */}
              {competition.content && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <div 
                      className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                      dangerouslySetInnerHTML={{ __html: competition.content }}
                    />
                  </div>
                </div>
              )}

              {/* Programme Area Details */}
              {competition.programme_areas && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Programme Area</h3>
                    <div className="flex items-start gap-4">
                      {competition.programme_areas.icon && (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{competition.programme_areas.icon}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">{competition.programme_areas.name}</h4>
                        {competition.programme_areas.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {competition.programme_areas.description}
                          </p>
                        )}
                        <Link 
                          href={`/programme-areas/${competition.programme_areas.slug}`}
                          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mt-3"
                        >
                          Learn more about this area
                          <ArrowLeft size={16} className="rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Form */}
              {competition.status === 'open' && competition.application_form?.enabled && (
                <div className="mb-8">
                  <CompetitionApplicationForm competition={competition} />
                </div>
              )}

              {/* Share Section */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Competition</h3>
                  <ShareButtons 
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/competitions/${competition.slug}`}
                    title={competition.title}
                    description={competition.description}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
