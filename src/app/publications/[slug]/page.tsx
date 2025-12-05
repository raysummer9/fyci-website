'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Download, FileText, ExternalLink, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { Publication } from '@/types';
import Footer from '@/components/Footer';

export default function PublicationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await fetch(`/api/publications/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPublication(data);
        } else if (response.status === 404) {
          setError('Publication not found');
        } else {
          setError('Failed to load publication');
        }
      } catch (error) {
        console.error('Error fetching publication:', error);
        setError('Failed to load publication');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublication();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = publication?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          // You could add a toast notification here
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Book cover skeleton */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] bg-gray-200 rounded-lg" style={{ aspectRatio: '2/3', minHeight: '400px' }}></div>
              </div>
              {/* Content skeleton */}
              <div className="lg:col-span-8 space-y-6">
                <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-48 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#360e1d' }}>Publication Not Found</h1>
          <p className="text-gray-600 mb-8">The publication you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#360e1d' }}
          >
            <ArrowLeft size={20} />
            Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Publications</span>
          </Link>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Book Cover - Left Side (Mobile: Top) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4 flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]">
              {publication.cover_image ? (
                <div className="relative">
                  <img
                    src={publication.cover_image}
                    alt={publication.title}
                    className="w-full h-auto object-contain rounded-lg shadow-xl"
                    style={{ aspectRatio: '2/3' }}
                  />
                  {/* Subtle shadow effect */}
                  <div className="absolute inset-0 rounded-lg shadow-2xl opacity-20 pointer-events-none"></div>
                </div>
              ) : (
                <div 
                  className="w-full bg-gray-100 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ aspectRatio: '2/3', minHeight: '400px' }}
                >
                  <FileText size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Content - Right Side (Mobile: Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-6 sm:space-y-8"
          >
            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#360e1d' }}>
                {publication.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
                {publication.publication_categories && (
                  <div className="flex items-center">
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                      {publication.publication_categories.name || 'Publication'}
                    </span>
                  </div>
                )}
                
                {publication.profiles && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>By {publication.profiles.full_name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="sm:w-4 sm:h-4" />
                  <span>{formatDate(publication.published_at || publication.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {publication.description && (
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#360e1d' }}>About this Publication</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{publication.description}</p>
                </div>
              </div>
            )}

            {/* Download Button */}
            {publication.file_url && (
              <div className="pt-4">
                <a
                  href={publication.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base font-medium"
                  style={{ backgroundColor: '#360e1d' }}
                >
                  <Download size={20} className="sm:w-5 sm:h-5" />
                  <span>Download Publication</span>
                  <ExternalLink size={16} className="sm:w-4 sm:h-4" />
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#360e1d' }}>Share this Publication</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
            Help others discover this publication by sharing it on social media.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
              style={{ color: '#360e1d' }}
              aria-label="Share on Facebook"
            >
              <Facebook size={20} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
              style={{ color: '#360e1d' }}
              aria-label="Share on Twitter"
            >
              <Twitter size={20} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
              style={{ color: '#360e1d' }}
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={20} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110"
              style={{ color: '#360e1d' }}
              aria-label="Copy link"
            >
              <Copy size={20} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
