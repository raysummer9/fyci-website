'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Heart, Target, Vote, Shield, ArrowRight, Clock, MapPin, Users, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

interface ProgrammeArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  programmes: any[];
  competitions: any[];
  events: any[];
  totalContent: number;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  featured_image: string;
  created_at: string;
  slug: string;
  type: 'programme' | 'competition' | 'event';
  programme_area: string;
  programme_area_slug: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  max_attendees?: number;
  prizes?: string;
}

export default function ProgrammeAreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [programmeAreas, setProgrammeAreas] = useState<ProgrammeArea[]>([]);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/programme-areas');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      
      setProgrammeAreas(data.programmeAreas);
      
      // Flatten all content into a single array
      const content: ContentItem[] = [];
      data.programmeAreas.forEach((area: ProgrammeArea) => {
        area.programmes.forEach(programme => {
          content.push({
            ...programme,
            type: 'programme',
            programme_area: area.name,
            programme_area_slug: area.slug
          });
        });
        area.competitions.forEach(competition => {
          content.push({
            ...competition,
            type: 'competition',
            programme_area: area.name,
            programme_area_slug: area.slug
          });
        });
        area.events.forEach(event => {
          content.push({
            ...event,
            type: 'event',
            programme_area: area.name,
            programme_area_slug: area.slug
          });
        });
      });
      
      setAllContent(content);
    } catch (err) {
      setError('Failed to load content. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = allContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.programme_area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.programme_area_slug === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Women\'s Rights':
        return Heart;
      case 'Youth Agency and Self Esteem':
        return Target;
      case 'Youth Political Participation':
        return Vote;
      case 'Anti-Corruption':
        return Shield;
      default:
        return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    return { backgroundColor: '#e6e1e3', color: '#360e1d' };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'programme':
        return Target;
      case 'competition':
        return Award;
      case 'event':
        return Calendar;
      default:
        return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'programme':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'competition':
        return { backgroundColor: '#fff3e0', color: '#f57c00' };
      case 'event':
        return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      default:
        return { backgroundColor: '#e6e1e3', color: '#360e1d' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContentUrl = (item: ContentItem) => {
    switch (item.type) {
      case 'programme':
        return `/programmes/${item.slug}`;
      case 'competition':
        return `/competitions/${item.slug}`;
      case 'event':
        return `/events/${item.slug}`;
      default:
        return '#';
    }
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
              Programme Areas
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Using the power of creative arts to drive social change across four key thematic areas. 
              Explore our projects and initiatives that are making a difference in communities across Africa.
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-lg placeholder-gray-500"
                style={{ '--tw-ring-color': '#360e1d' } as React.CSSProperties}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === 'all' ? { backgroundColor: '#360e1d' } : {}}
              >
                All Categories
              </button>
              {programmeAreas.map((area) => (
                <button 
                  key={area.slug}
                  onClick={() => setSelectedCategory(area.slug)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === area.slug 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedCategory === area.slug ? { backgroundColor: '#360e1d' } : {}}
                >
                  {area.name}
              </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 text-lg mt-4">Loading content...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <button 
                onClick={fetchData}
                className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              key={`${searchTerm}-${selectedCategory}`}
          >
              {filteredContent.map((item, index) => {
                const CategoryIcon = getCategoryIcon(item.programme_area);
                const TypeIcon = getTypeIcon(item.type);
              return (
                <motion.div
                    key={`${item.id}-${item.type}-${searchTerm}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    {/* Content Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                        src={item.featured_image || '/img/placeholder.jpg'}
                        alt={item.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                    {/* Content Details */}
                  <div className="p-6">
                      {/* Type and Category Tags */}
                    <div className="flex items-center gap-2 mb-3">
                        <TypeIcon size={16} style={{ color: '#360e1d' }} />
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={getTypeColor(item.type)}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={getCategoryColor(item.programme_area)}>
                          {item.programme_area}
                      </span>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
                      <Calendar size={16} />
                        {formatDate(item.created_at)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-left">
                        {item.title}
                    </h3>
                    
                    {/* Description */}
                      <p className="text-gray-600 leading-relaxed text-left mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      
                      {/* Additional Info based on type */}
                      {item.type === 'event' && item.location && (
                        <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
                          <MapPin size={16} />
                          {item.location}
                        </div>
                      )}
                      
                      {item.type === 'competition' && item.prizes && (
                        <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
                          <Award size={16} />
                          Prizes Available
                        </div>
                      )}
                    
                    {/* Read More Button */}
                      <Link
                        href={getContentUrl(item)}
                      className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                    >
                      Read more
                      <ArrowRight size={16} />
                      </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          )}

          {/* No Results Message */}
          {!loading && !error && filteredContent.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No content found matching your search.</p>
            </motion.div>
          )}
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