'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Vote, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Blog from '@/components/Blog';
import SuccessStory from '@/components/SuccessStory';
import Footer from '@/components/Footer';

export default function YouthPoliticalParticipationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      title: "Vote Right Campaign",
      category: "Political Participation",
      date: "Dec 05, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Mobilizing young voters and promoting civic engagement through creative campaigns and comprehensive voter education programs."
    },
    {
      id: 2,
      title: "Youth Civic Education Initiative",
      category: "Political Participation",
      date: "Nov 20, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Building knowledge about democratic processes and political systems through interactive workshops and creative learning methods."
    },
    {
      id: 3,
      title: "Young Leaders Development Program",
      category: "Political Participation",
      date: "Oct 08, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Training aspiring young politicians and community leaders to effectively engage in democratic processes and governance."
    },
    {
      id: 4,
      title: "Community Policy Dialogues",
      category: "Political Participation",
      date: "Sep 15, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Creating spaces for young people to participate in policy discussions and advocate for issues affecting their communities."
    },
    {
      id: 5,
      title: "Digital Democracy Campaign",
      category: "Political Participation",
      date: "Aug 28, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Using digital platforms and creative content to increase youth engagement in political processes and civic participation."
    },
    {
      id: 6,
      title: "Accountability Advocacy Network",
      category: "Political Participation",
      date: "Jul 30, 2024",
      image: "/img/anti-corruption.jpg",
      description: "Empowering young people to hold leaders accountable and demand responsive governance through organized advocacy efforts."
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
              Youth Political Participation
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl">
              Encouraging meaningful youth participation in democratic processes and political decision-making. 
              Our projects focus on civic education, voter mobilization, and leadership development.
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
                placeholder="Search political participation projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-lg placeholder-gray-500"
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
                    <Vote size={16} style={{ color: '#360e1d' }} />
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