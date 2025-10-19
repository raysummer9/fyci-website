'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Target, Vote, Shield } from 'lucide-react';
import { Project } from '@/types';

export default function Projects() {
  const projects: Project[] = [
    {
      id: '1',
      title: 'Young Voices Against SGBV Competition',
      description: 'In commemoration of 16 Days of Activism Against Gender-Based Violence, FYCI is instituting the Young Voices Against SGBV Competition.',
      image: '/img/gender-rights.jpg',
      linkText: 'Explore programme',
      linkHref: '/programme-areas/gender-rights',
      titleColor: 'text-gray-900',
      programmeArea: 'Gender Rights',
      icon: Heart
    },
    {
      id: '2',
      title: 'Creative and Life Skills Training for Youth 2022',
      description: 'FYCI is organising a programme, titled “Creative and Life Skills Training for Youth” This programme is aimed at imparting creative and life skills in young people to position them for the future..',
      image: '/img/youth-agency.jpg',
      linkText: 'Explore programme',
      linkHref: '/programme-areas/youth-agency',
      titleColor: 'text-gray-900',
      programmeArea: 'Youth Agency and Self Esteem',
      icon: Target
    },
    {
      id: '3',
      title: 'Youth Political Participation',
      description: 'Engaging young people in democratic processes through creative campaigns and civic education programs that build political awareness and participation.',
      image: '/img/anti-corruption.jpg',
      linkText: 'Explore programme',
      linkHref: '/programme-areas/youth-political-participation',
      titleColor: 'text-gray-900',
      programmeArea: 'Youth Political Participation',
      icon: Vote
    },
    {
      id: '4',
      title: 'Anti-Corruption Initiatives',
      description: 'Promoting transparency and accountability through creative advocacy work and youth-led campaigns for good governance in communities.',
      image: '/img/anti-corruption.jpg',
      linkText: 'Explore programme',
      linkHref: '/programme-areas/anti-corruption',
      titleColor: 'text-gray-900',
      programmeArea: 'Anti-Corruption',
      icon: Shield
    }
  ];

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
            Explore our latest initiatives and discover how we're making a difference in communities around the world through creative youth empowerment.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
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
      </div>
    </section>
  );
}
