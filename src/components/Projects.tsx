'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Target, Vote, Shield, Calendar, Trophy, Users } from 'lucide-react';
import { Project, Programme, Competition, Event } from '@/types';
import { useState, useEffect } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const competitionsRes = await fetch('/api/competitions?limit=10');
        const competitions: Competition[] = await competitionsRes.json();

        // Transform competitions to Project format and sort by end date
        const transformedProjects: Project[] = [];
        
        // Add competitions
        competitions.forEach(competition => {
          transformedProjects.push({
            id: competition.id,
            title: competition.title,
            description: competition.description,
            image: competition.featured_image || '/img/womens-rights.jpg',
            linkText: 'Explore programme',
            linkHref: `/competitions/${competition.slug}`,
            titleColor: 'text-gray-900',
            programmeArea: competition.programme_areas?.name || 'Women\'s Rights',
            icon: Trophy,
            type: 'competition' as const,
            endDate: competition.end_date
          });
        });

        // Sort by end date in reverse chronological order (newest first)
        transformedProjects.sort((a, b) => {
          if (!a.endDate && !b.endDate) return 0;
          if (!a.endDate) return 1;
          if (!b.endDate) return -1;
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        });

        // Take only the first 3 projects
        const limitedProjects = transformedProjects.slice(0, 3);

        setProjects(limitedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to static data if API fails - just 3 competition cards
        setProjects([
    {
      id: '1',
      title: 'Young Voices Against SGBV Competition',
      description: 'In commemoration of 16 Days of Activism Against Gender-Based Violence, FYCI is instituting the Young Voices Against SGBV Competition.',
            image: '/img/womens-rights.jpg',
      linkText: 'Explore programme',
            linkHref: '/competitions/young-voices-against-sgbv',
      titleColor: 'text-gray-900',
            programmeArea: 'Women\'s Rights',
            icon: Trophy,
            type: 'competition'
    },
    {
      id: '2',
            title: 'Creative Arts Competition 2024',
            description: 'A platform for young artists to showcase their creative talents and compete for recognition in various artistic disciplines.',
      image: '/img/youth-agency.jpg',
      linkText: 'Explore programme',
            linkHref: '/competitions/creative-arts-2024',
      titleColor: 'text-gray-900',
      programmeArea: 'Youth Agency and Self Esteem',
            icon: Trophy,
            type: 'competition'
    },
    {
      id: '3',
            title: 'Digital Innovation Challenge',
            description: 'Encouraging young innovators to develop digital solutions that address social challenges in their communities.',
      image: '/img/anti-corruption.jpg',
      linkText: 'Explore programme',
            linkHref: '/competitions/digital-innovation-challenge',
      titleColor: 'text-gray-900',
      programmeArea: 'Anti-Corruption',
            icon: Trophy,
            type: 'competition'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
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
            Our Projects
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl"
            style={{ color: '#4a1a2a' }}
          >
            Explore our latest initiatives and discover how we're making a difference through the creative
            arts.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.1 
                }}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="px-0 py-6 flex flex-col justify-between flex-1">
                    <div className="pl-6 pr-6">
                      {/* Programme Area Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                          {project.programmeArea}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-left text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-left leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="pl-6 pr-6">
                      <Link
                        href={project.linkHref}
                        className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200"
                      >
                        {project.linkText}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        )}
      </div>
    </section>
  );
}
