'use client';

import { Metadata } from 'next'
import { motion } from 'framer-motion';
import Image from 'next/image';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function TeamPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Team members data - update with your actual team information
  const teamMembers = [
    {
      id: 1,
      name: 'Loveth Olufunto Anthony-Iyortyer',
      role: 'Executive Director',
      image: '/img/team/loveth.jpg',
      bio: 'Loveth Olufunto Anthony-Iyortyer is a PRINCE2 certified practitioner and a public health specialist with almost a decade of work experience strategically responding to public health concerns and the impact of crises, illiteracy, poverty, culture and poor governance in Africa through research, monitoring, evaluation and learning. ',
      linkedin: 'https://linkedin.com/in/loveth-olufunto-anthony-iyortyer-753544242',
  
    },
    {
      id: 2,
      name: 'Rukky Otive-Igbuzor',
      role: 'Director of Girls Empowerment Nucleus',
      image: '/img/team/rukky.jpeg',
      bio: 'Rukky Otive-Igbuzor is a lawyer, development worker, writer, and singer. She holds an LLB in Law from University College London and is currently in training at the Nigerian Law School.',
      linkedin: 'https://linkedin.com/in/michaelokonkwo',
      twitter: 'https://twitter.com/michaelokonkwo'
    },
    {
      id: 3,
      name: 'Uvie Otive-Igbuzor',
      role: 'Director of Boys and Masculinity Nucleus',
      image: '/img/team/uvie.jpg',
      bio: 'Uvie Otive-Igbuzor (aka Uviboy the Rap Priest) is a lyricist, rap artist and music producer. He holds a BSc in Economics from Baze University, Abuja.',
      linkedin: 'https://linkedin.com/in/amaranwankwo',
      twitter: 'https://twitter.com/amaranwankwo'
    },
    {
      id: 4,
      name: 'Promise Chime',
      role: 'Technology and Innovation Lead',
      image: '/img/team/promise.jpg',
      bio: 'Promise is a software engineer with a strong foundation in Computer Science. With extensive experience in programming, graphic design, and technical support, he has successfully developed and implemented innovative solutions that serve users across the globe.',
      linkedin: 'https://linkedin.com/in/davidmensah',
      twitter: 'https://twitter.com/davidmensah'
    },
    {
      id: 5,
      name: 'Fatima Ibrahim',
      role: 'Youth Engagement Officer',
      image: '/img/team/member5.jpg', // Update with actual image path
      bio: 'Builds relationships with youth communities and ensures inclusive participation in FYCI programs and initiatives.',
      linkedin: 'https://linkedin.com/in/fatimaibrahim',
      twitter: 'https://twitter.com/fatimaibrahim'
    },
    {
      id: 6,
      name: 'James Okafor',
      role: 'Partnerships Coordinator',
      image: '/img/team/member6.jpg', // Update with actual image path
      bio: 'Develops strategic partnerships with organizations and stakeholders to expand FYCI\'s reach and impact.',
      linkedin: 'https://linkedin.com/in/jamesokafor',
      twitter: 'https://twitter.com/jamesokafor'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              style={{ color: '#360e1d' }}
            >
              Our Team
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl"
              style={{ color: '#4a1a2a' }}
            >
              Meet the passionate individuals driving positive change and empowering young people across Africa through creative arts and civic engagement.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Team Member Image */}
                <div className="relative w-full h-80 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Team Member Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-lg font-semibold mb-3" style={{ color: '#360e1d' }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <Image
                          src="/assets/social-icons/linkedin.svg"
                          alt="LinkedIn"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        aria-label={`${member.name}'s Twitter`}
                      >
                        <Image
                          src="/assets/social-icons/x.svg"
                          alt="Twitter/X"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Partners Section */}
      <Partners />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  )
}
