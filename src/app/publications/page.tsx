'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ExternalLink, Search } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Types');

  const publications = [
    {
      id: '1',
      title: 'Youth Creativity and Innovation Report 2023',
      description: 'A comprehensive study on how creative programs impact youth development and community engagement. This report documents the transformative power of artistic expression in building confidence, critical thinking skills, and social connections among young people.',
      date: 'December 2023',
      type: 'Research Report',
      link: '#'
    },
    {
      id: '2',
      title: 'Empowering Young Voices Through Art',
      description: 'Case studies showcasing how artistic expression helps young people find their voice and advocate for change. This publication highlights real stories of transformation and impact across different communities.',
      date: 'October 2023',
      type: 'Case Study',
      link: '#'
    },
    {
      id: '3',
      title: 'Digital Skills for Future Leaders',
      description: 'A guide to developing essential digital competencies for the next generation of creative leaders. This resource provides practical tools and strategies for building digital literacy among African youth.',
      date: 'August 2023',
      type: 'Guide',
      link: '#'
    },
    {
      id: '4',
      title: 'Creative Arts and Social Change',
      description: 'Exploring the intersection of artistic expression and social transformation. This publication examines how creative programs contribute to community development and civic engagement.',
      date: 'June 2023',
      type: 'Research Report',
      link: '#'
    },
    {
      id: '5',
      title: 'Youth Leadership Development Framework',
      description: 'A comprehensive framework for developing young leaders through creative programs. This guide offers methodologies and best practices for building leadership capacity among youth.',
      date: 'April 2023',
      type: 'Framework',
      link: '#'
    },
    {
      id: '6',
      title: 'Impact Assessment of Creative Programs',
      description: 'Measuring the effectiveness of creative arts programs in youth development. This study provides quantitative and qualitative evidence of program impact and outcomes.',
      date: 'February 2023',
      type: 'Impact Study',
      link: '#'
    },
    {
      id: '7',
      title: 'Youth Engagement Statistics 2023',
      description: 'Visual representation of youth participation across our programs and their impact on communities.',
      date: 'January 2024',
      type: 'Infographics',
      link: '#'
    },
    {
      id: '8',
      title: 'Creative Arts Impact Dashboard',
      description: 'Interactive infographic showcasing the reach and effectiveness of creative arts programs across different regions.',
      date: 'November 2023',
      type: 'Infographics',
      link: '#'
    }
  ];

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All Types' || publication.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

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
              Explore our research reports, policy briefs, guides, and other publications that document the impact 
              of creativity and innovation in youth development across Africa.
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
              {['All Types', 'Research Report', 'Case Study', 'Guide', 'Framework', 'Impact Study', 'Infographics'].map((filter) => (
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
                          {publication.type}
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
                        <span>{publication.date}</span>
                      </div>
                      
                      <a
                        href={publication.link}
                        className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                      >
                        View Publication
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    
                    {/* Book Cover Placeholder */}
                    <div className="flex-shrink-0 order-1 sm:order-2">
                      <div className="w-32 h-48 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

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