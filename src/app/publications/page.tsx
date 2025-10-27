'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ExternalLink, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';
import { Publication, PublicationCategory } from '@/types';

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Types');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<PublicationCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsRes, categoriesRes] = await Promise.all([
          fetch('/api/publications'),
          fetch('/api/publications/categories')
        ]);

        if (publicationsRes.ok) {
          const publicationsData = await publicationsRes.json();
          setPublications(publicationsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (publication.publication_categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (publication.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All Types' || publication.publication_categories?.name === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Publications
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Explore our reports and resources that document our journey of promoting youth agency and change through the creative arts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-lg placeholder-gray-500"
                style={{ '--tw-ring-color': '#360e1d' } as React.CSSProperties}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {['All Types', ...categories.map(cat => cat.name)].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter 
                      ? '' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedFilter === filter ? { backgroundColor: '#e6e1e3', color: '#360e1d' } : {}}
                  onMouseEnter={(e) => {
                    if (selectedFilter !== filter) {
                      e.currentTarget.style.backgroundColor = '#e3e0e2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFilter !== filter) {
                      e.currentTarget.style.backgroundColor = '';
                    } else {
                      e.currentTarget.style.backgroundColor = '#e6e1e3';
                    }
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publications Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {loading ? (
              // Loading skeleton
              <div className="grid gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
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
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredPublications.map((publication, index) => (
                  <motion.div
                    key={`${publication.id}-${searchTerm}`}
                    variants={itemVariants}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.5 + (index * 0.1) 
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
                        
                        <Link
                          href={`/publications/${publication.slug}`}
                          className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                        >
                          View Publication
                          <ExternalLink size={16} />
                        </Link>
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
                          <div className="w-32 h-48 bg-gray-200 rounded-lg"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {filteredPublications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">No publications found matching your search.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <Blog />

      {/* Success Story Section */}
      <SuccessStory />

      {/* Partners Section */}
      <Partners />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}