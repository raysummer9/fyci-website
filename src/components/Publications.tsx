'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Publication } from '@/types';

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications?limit=3');
        if (response.ok) {
          const data = await response.json();
          setPublications(data);
        } else {
          console.error('Failed to fetch publications');
          // Fallback to static data if API fails
          setPublications([
            {
              id: '1',
              title: 'Youth Creativity and Innovation Report 2023',
              slug: 'youth-creativity-innovation-report-2023',
              description: 'A comprehensive study on how creative programs impact youth development and community engagement.',
              published_at: '2023-12-01T00:00:00Z',
              created_at: '2023-12-01T00:00:00Z',
              status: 'published',
              publication_categories: { id: '1', name: 'Research Report', slug: 'research-report' }
            },
            {
              id: '2',
              title: 'Empowering Young Voices Through Art',
              slug: 'empowering-young-voices-art',
              description: 'Case studies showcasing how artistic expression helps young people find their voice and advocate for change.',
              published_at: '2023-10-01T00:00:00Z',
              created_at: '2023-10-01T00:00:00Z',
              status: 'published',
              publication_categories: { id: '2', name: 'Case Study', slug: 'case-study' }
            },
            {
              id: '3',
              title: 'Digital Skills for Future Leaders',
              slug: 'digital-skills-future-leaders',
              description: 'A guide to developing essential digital competencies for the next generation of creative leaders.',
              published_at: '2023-08-01T00:00:00Z',
              created_at: '2023-08-01T00:00:00Z',
              status: 'published',
              publication_categories: { id: '3', name: 'Guide', slug: 'guide' }
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching publications:', error);
        // Fallback to static data
        setPublications([
          {
            id: '1',
            title: 'Youth Creativity and Innovation Report 2023',
            slug: 'youth-creativity-innovation-report-2023',
            description: 'A comprehensive study on how creative programs impact youth development and community engagement.',
            published_at: '2023-12-01T00:00:00Z',
            created_at: '2023-12-01T00:00:00Z',
            status: 'published',
            publication_categories: { id: '1', name: 'Research Report', slug: 'research-report' }
          },
          {
            id: '2',
            title: 'Empowering Young Voices Through Art',
            slug: 'empowering-young-voices-art',
            description: 'Case studies showcasing how artistic expression helps young people find their voice and advocate for change.',
            published_at: '2023-10-01T00:00:00Z',
            created_at: '2023-10-01T00:00:00Z',
            status: 'published',
            publication_categories: { id: '2', name: 'Case Study', slug: 'case-study' }
          },
          {
            id: '3',
            title: 'Digital Skills for Future Leaders',
            slug: 'digital-skills-future-leaders',
            description: 'A guide to developing essential digital competencies for the next generation of creative leaders.',
            published_at: '2023-08-01T00:00:00Z',
            created_at: '2023-08-01T00:00:00Z',
            status: 'published',
            publication_categories: { id: '3', name: 'Guide', slug: 'guide' }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle geometric shapes */}
        <div className="absolute top-16 right-12 w-4 h-4 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="absolute top-32 left-12 w-3 h-3 bg-gray-50 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-16 right-16 w-6 h-6 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-2 h-6 bg-gray-50 rotate-12 animate-bounce"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-gray-50/25 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-gray-100/20 to-transparent rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          className="mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            style={{ color: '#360e1d' }}
          >
            Latest Publications
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl"
            style={{ color: '#4a1a2a' }}
          >
            Explore our research, reports, and resources that document the impact of creativity and innovation in youth development.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Publications Grid */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-1"
          >
            <div className="grid gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200/30 p-6 shadow-sm animate-pulse">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="flex-1 order-2 sm:order-1">
                        <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex-shrink-0 order-1 sm:order-2">
                        <div className="w-32 h-48 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                publications.map((publication, index) => (
                  <motion.div
                    key={publication.id}
                    variants={itemVariants}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: index * 0.1 
                    }}
                    className="bg-white rounded-xl border border-gray-200/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="flex-1 order-2 sm:order-1">
                        {/* Publication Type Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                            {publication.publication_categories?.name || 'Publication'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-left text-gray-900">
                          {publication.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-left leading-relaxed">
                          {publication.description}
                        </p>
                        
                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Calendar size={16} />
                          <span>{formatDate(publication.published_at || publication.created_at)}</span>
                        </div>
                        
                        <a
                          href={`/publications/${publication.slug}`}
                          className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                        >
                          View Publication
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      
                      {/* Book Cover or Placeholder */}
                      <div className="flex-shrink-0 order-1 sm:order-2">
                        {publication.cover_image ? (
                          <img 
                            src={publication.cover_image} 
                            alt={publication.title}
                            className="w-32 h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileText size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="order-2 lg:order-2"
          >
            <div className="space-y-8">
              <div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our publications represent years of research, practice, and learning in the field of youth development. 
                  Through these resources, we share insights, methodologies, and success stories that can inspire and 
                  guide other organizations working with young people.
                </p>
              </div>

              {/* Call to Action */}
              <div className="rounded-xl p-8" style={{ backgroundColor: '#f0fdf4' }}>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Access All Resources</h3>
                <p className="text-gray-700 mb-6">
                  Browse our complete library of publications, research papers, and educational resources.
                </p>
                <Link 
                  href="/publications"
                  className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                >
                  View All Publications
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
