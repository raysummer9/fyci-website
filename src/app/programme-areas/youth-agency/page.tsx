'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Target, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function YouthAgencyPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      title: "Creative Confidence Building",
      category: "Youth Agency",
      date: "Dec 10, 2024",
      image: "/img/youth-agency.jpg",
      description: "Helping young people discover their creative potential and build self-esteem through artistic expression and peer support."
    },
    {
      id: 2,
      title: "Leadership Development Program",
      category: "Youth Agency",
      date: "Nov 25, 2024",
      image: "/img/youth-agency.jpg",
      description: "Building leadership skills and capacity among young people to become effective agents of change in their communities."
    },
    {
      id: 3,
      title: "Youth Talent Showcase",
      category: "Youth Agency",
      date: "Oct 15, 2024",
      image: "/img/youth-agency.jpg",
      description: "Providing platforms for young people to showcase their talents and gain recognition for their creative abilities."
    },
    {
      id: 4,
      title: "Peer Mentorship Network",
      category: "Youth Agency",
      date: "Sep 18, 2024",
      image: "/img/youth-agency.jpg",
      description: "Connecting young people with mentors and peers to build supportive networks and personal development opportunities."
    },
    {
      id: 5,
      title: "Skills Development Workshops",
      category: "Youth Agency",
      date: "Aug 12, 2024",
      image: "/img/youth-agency.jpg",
      description: "Creative workshops and masterclasses to help young people develop artistic skills and build confidence in their abilities."
    },
    {
      id: 6,
      title: "Community Engagement Initiative",
      category: "Youth Agency",
      date: "Jul 22, 2024",
      image: "/img/youth-agency.jpg",
      description: "Encouraging young people to take ownership of their communities and become active participants in local development."
    }
  ];

  const filteredProjects = projects.filter(project =>
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
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Programme Areas
            </Link>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Youth Agency and Self-Esteem
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Building confidence and agency among young people to become active agents of change in their communities. 
              Our projects focus on personal development, leadership skills, and creative expression.
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
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-blue-600" />
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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
                  <p className="text-gray-600 leading-relaxed text-left">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
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