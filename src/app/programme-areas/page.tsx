'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Heart, Target, Vote, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function ProgrammeAreasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      title: "Creative Arts for Gender Equality",
      category: "Women's Rights",
      date: "Dec 15, 2024",
      image: "/img/womens-rights.jpg",
      description: "Using music, drama, and visual arts to challenge gender stereotypes and promote women's rights in communities across Nigeria."
    },
    {
      id: 2,
      title: "Youth Leadership Development Program",
      category: "Youth Agency",
      date: "Nov 28, 2024",
      image: "/img/youth-agency.jpg",
      description: "Building confidence and leadership skills among young people through creative workshops and mentorship programs."
    },
    {
      id: 3,
      title: "Vote Right Campaign",
      category: "Political Participation",
      date: "Oct 12, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Mobilizing young voters and promoting civic engagement through creative campaigns and voter education."
    },
    {
      id: 4,
      title: "Transparency Through Art",
      category: "Anti-Corruption",
      date: "Sep 20, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Using creative arts to raise awareness about corruption and advocate for transparent governance."
    },
    {
      id: 5,
      title: "Women's Voice Initiative",
      category: "Women's Rights",
      date: "Aug 05, 2024",
      image: "/img/womens-rights.jpg",
      description: "Empowering young women to speak out against discrimination and advocate for their rights in their communities."
    },
    {
      id: 6,
      title: "Creative Confidence Building",
      category: "Youth Agency",
      date: "Jul 18, 2024",
      image: "/img/youth-agency.jpg",
      description: "Helping young people discover their creative potential and build self-esteem through artistic expression."
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Women\'s Rights':
        return Heart;
      case 'Youth Agency':
        return Target;
      case 'Political Participation':
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
              <button className="px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4d0d1'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e6e1e3'}>
                All Categories
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Women's Rights
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Youth Agency
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Political Participation
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Anti-Corruption
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={searchTerm}
          >
            {filteredProjects.map((project, index) => {
              const CategoryIcon = getCategoryIcon(project.category);
              return (
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
                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryIcon size={16} style={{ color: '#360e1d' }} />
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={getCategoryColor(project.category)}>
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm">
                      <Calendar size={16} />
                      {project.date}
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
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                    >
                      Read more
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Results Message */}
          {filteredProjects.length === 0 && (
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