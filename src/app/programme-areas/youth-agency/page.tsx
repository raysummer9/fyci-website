'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';
import { Programme, Competition } from '@/types';

export default function YouthAgencyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch programmes and competitions for Youth Agency programme area
        const [programmesRes, competitionsRes] = await Promise.all([
          fetch('/api/programmes/by-category?category=youth-agency'),
          fetch('/api/competitions/by-category?category=youth-agency')
        ]);

        if (programmesRes.ok) {
          const programmesData = await programmesRes.json();
          setProgrammes(programmesData);
        }

        if (competitionsRes.ok) {
          const competitionsData = await competitionsRes.json();
          setCompetitions(competitionsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine programmes and competitions for display
  const allProjects = [
    ...programmes.map(programme => ({
      id: programme.id,
      title: programme.title,
      description: programme.description || '',
      date: programme.created_at,
      type: 'Programme',
      slug: programme.slug,
      image: programme.featured_image || '/img/youth-agency.jpg'
    })),
    ...competitions.map(competition => ({
      id: competition.id,
      title: competition.title,
      description: competition.description || '',
      date: competition.created_at,
      type: 'Competition',
      slug: competition.slug,
      image: competition.featured_image || '/img/youth-agency.jpg'
    }))
  ];

  const filteredProjects = allProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Link 
              href="/programme-areas" 
              className="inline-flex items-center mb-6 transition-colors"
              style={{ color: '#360e1d' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#4a1a2a'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#360e1d'}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Programme Areas
            </Link>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Youth Agency and Self-Esteem
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Our projects seeks to build confidence and agency among young people, turning them into active agents of change in their communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search youth agency projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg placeholder-gray-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={searchTerm}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${project.id}-${searchTerm}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Project Content */}
                <div className="p-6">
                    {/* Type Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} style={{ color: '#360e1d' }} />
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                        {project.type}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
                    <Calendar size={16} />
                      {new Date(project.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-left">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-left mb-4">
                    {project.description}
                  </p>
                  
                  {/* Read More Button */}
                    <Link
                      href={`/${project.type.toLowerCase()}s/${project.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                  >
                    Read more
                    <ArrowRight size={16} />
                    </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}

          {/* No Results Message */}
          {!loading && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No projects found matching your search.</p>
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