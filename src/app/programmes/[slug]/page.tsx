'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Clock, MapPin, Share2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Programme } from '@/types';
import Footer from '@/components/Footer';

interface ProgrammePageProps {
  params: Promise<{ slug: string }>;
}

export default function ProgrammePage({ params }: ProgrammePageProps) {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/programmes/${resolvedParams.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Programme not found');
          } else {
            setError('Failed to load programme');
          }
          return;
        }
        
        const data = await response.json();
        setProgramme(data);
      } catch (err) {
        setError('Failed to load programme');
        console.error('Error fetching programme:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramme();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error || !programme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-gray-900">
          <h1 className="text-2xl font-bold mb-4">Programme Not Found</h1>
          <p className="mb-6">The programme you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
      <main className="min-h-screen bg-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 sm:pt-20 pb-6 sm:pb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link 
              href="/programme-areas" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Programme Areas
            </Link>

            {/* Programme Area Badge */}
            {programme.programme_areas && (
              <div className="mb-4">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
                  style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                >
                  {programme.programme_areas.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6 max-w-4xl">
              {programme.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="text-sm">Created {formatDate(programme.created_at)}</span>
              </div>
              {programme.profiles?.full_name && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="text-sm">By {programme.profiles.full_name}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured Image and Content Side by Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Featured Image */}
            {programme.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-1"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={programme.featured_image}
                    alt={programme.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {/* Content */}
            <motion.div variants={itemVariants} className="order-2 lg:order-2">
              {/* Description */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Programme</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-0">
                    {programme.description}
                  </p>
                </div>
              </div>

              {/* Full Content */}
              {programme.content && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <div 
                      className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                      dangerouslySetInnerHTML={{ __html: programme.content }}
                    />
                  </div>
                </div>
              )}

              {/* Programme Area Details */}
              {programme.programme_areas && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Programme Area</h3>
                    <div className="flex items-start gap-4">
                      {programme.programme_areas.icon && (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{programme.programme_areas.icon}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">{programme.programme_areas.name}</h4>
                        {programme.programme_areas.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {programme.programme_areas.description}
                          </p>
                        )}
                        <Link 
                          href={`/programme-areas/${programme.programme_areas.slug}`}
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

              {/* Share Section */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Programme</h3>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Facebook size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Twitter size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Instagram size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Youtube size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
