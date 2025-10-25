'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function AntiCorruptionPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      title: "Transparency Through Art",
      category: "Anti-Corruption",
      date: "Dec 01, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Using creative arts to raise awareness about corruption and advocate for transparent governance and accountability in public institutions."
    },
    {
      id: 2,
      title: "Youth Anti-Corruption Network",
      category: "Anti-Corruption",
      date: "Nov 18, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Building a network of young people committed to fighting corruption and promoting ethical leadership in their communities."
    },
    {
      id: 3,
      title: "Creative Accountability Campaign",
      category: "Anti-Corruption",
      date: "Oct 25, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Community dialogues and advocacy campaigns promoting transparency and accountability through creative expression and youth engagement."
    },
    {
      id: 4,
      title: "Integrity Leadership Training",
      category: "Anti-Corruption",
      date: "Sep 12, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Training programs for young leaders on ethical governance, transparency, and building corruption-free institutions."
    },
    {
      id: 5,
      title: "Digital Anti-Corruption Initiative",
      category: "Anti-Corruption",
      date: "Aug 22, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Using digital platforms and creative content to mobilize youth against corruption and promote accountability in governance."
    },
    {
      id: 6,
      title: "Community Monitoring Program",
      category: "Anti-Corruption",
      date: "Jul 14, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Empowering young people to monitor public projects and hold leaders accountable through organized community oversight mechanisms."
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
              className="inline-flex items-center mb-6 transition-colors"
              style={{ color: '#360e1d' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#4a1a2a'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#360e1d'}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Programme Areas
            </Link>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Anti-Corruption
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Mobilizing young people to speak out against corruption and advocate for transparency and accountability. 
              Our projects use creative arts to build a culture of integrity and ethical governance.
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
                placeholder="Search anti-corruption projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-lg placeholder-gray-500"
                style={{ '--tw-ring-color': '#360e1d' } as React.CSSProperties}
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
                    <Shield size={16} style={{ color: '#360e1d' }} />
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
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