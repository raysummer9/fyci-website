'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function GenderRightsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      title: "Women's Voice Initiative",
      category: "Gender Rights",
      date: "Dec 15, 2024",
      image: "/img/gender-rights.jpg",
      description: "Empowering young women to speak out against discrimination and advocate for their rights in their communities through creative arts."
    },
    {
      id: 2,
      title: "Breaking Gender Stereotypes Through Art",
      category: "Gender Rights",
      date: "Nov 28, 2024",
      image: "/img/gender-rights.jpg",
      description: "Using music, drama, and visual arts to challenge harmful gender stereotypes and traditional practices that limit opportunities for women."
    },
    {
      id: 3,
      title: "Safe Spaces for Women",
      category: "Gender Rights",
      date: "Oct 12, 2024",
      image: "/img/gender-rights.jpg",
      description: "Creating safe spaces for young women to discuss gender issues, share experiences, and build supportive networks."
    },
    {
      id: 4,
      title: "Gender Equality Advocacy Campaign",
      category: "Gender Rights",
      date: "Sep 20, 2024",
      image: "/img/gender-rights.jpg",
      description: "Community dialogues and advocacy campaigns promoting gender equality and women's rights through creative expression."
    },
    {
      id: 5,
      title: "Creative Mentorship for Girls",
      category: "Gender Rights",
      date: "Aug 05, 2024",
      image: "/img/gender-rights.jpg",
      description: "Mentorship programs connecting young girls with successful women leaders in creative fields and advocacy."
    },
    {
      id: 6,
      title: "Art Against Gender-Based Violence",
      category: "Gender Rights",
      date: "Jul 18, 2024",
      image: "/img/gender-rights.jpg",
      description: "Using creative arts to raise awareness about gender-based violence and advocate for prevention and support services."
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
              Gender Rights
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Promoting gender equality and empowering young women and girls to challenge discrimination and claim their rights. 
              Our projects use creative arts to address gender inequality and create positive social change.
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
                placeholder="Search gender rights projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent text-lg placeholder-gray-500"
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
                    <Heart size={16} style={{ color: '#360e1d' }} />
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