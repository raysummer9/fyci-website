'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Download, FileText, ExternalLink, Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Publications
          </Link>
        </motion.div>

        {/* Title and Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: '#360e1d' }}>
              {publication.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8" style={{ color: '#360e1d' }}>
              {publication.publication_categories && (
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                    Publications
                  </span>
                </div>
              )}
              
              {publication.profiles && (
                <div className="flex items-center gap-2">
                  <span>By {publication.profiles.full_name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(publication.published_at || publication.created_at)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-12">
          {/* Featured Image and Description Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Featured Image - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1"
            >
              {publication.cover_image ? (
                <img
                  src={publication.cover_image}
                  alt={publication.title}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText size={64} className="text-gray-400" />
                </div>
              )}
            </motion.div>

            {/* Description and Download - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-2 space-y-8"
            >
              {/* Description */}
              {publication.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#360e1d' }}>Description</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">{publication.description}</p>
                  </div>
                </div>
              )}

              {/* Download Section */}
              {publication.file_url && (
                <div>
                  <a
                    href={publication.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#360e1d' }}
                  >
                    <Download size={20} />
                    Download Publication
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Share Section - Grey Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-100 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#360e1d' }}>Share this Publication</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Help others discover this publication by sharing it on social media.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ color: '#360e1d' }}
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ color: '#360e1d' }}
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ color: '#360e1d' }}
              >
                <Linkedin size={20} />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ color: '#360e1d' }}
              >
                <Copy size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
