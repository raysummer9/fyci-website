'use client';

import { Metadata } from 'next'
import { motion } from 'framer-motion';
import Image from 'next/image';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function OrganisationalStructurePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const organs = [
    {
      id: 'youth-creativity',
      title: 'Youth and Creativity Nucleus',
      iconSrc: '/assets/organisational-structure/creativity.svg',
      description: 'This organ will focus on the use of the creative arts (music/rap, spoken word, poetry, prose, drama, fine art, photography/videography, creative writing, dance, etc.) to promote themes such as youth political participation, gender equality, anti-corruption, self-esteem among boys and girls, and action against SGBV.'
    },
    {
      id: 'girls-empowerment',
      title: 'Girls Empowerment Nucleus',
      iconSrc: '/assets/organisational-structure/empowerment.svg',
      description: 'This organ will focus on empowering young girls through trainings on key themes such as life skills, gender equality, how to take action against SGBV, and how to speak out against corruption.'
    },
    {
      id: 'boys-masculinity',
      title: 'Boys and Masculinity Nucleus',
      iconSrc: '/assets/organisational-structure/masculinity.svg',
      description: 'This organ will focus on empowering young boys through trainings on key themes such as life skills, gender equality, how to take action against SGBV, how to prevent toxic masculinity, and how to speak out against corruption.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16">
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
              Organisational Structure
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-3xl lg:text-4xl mb-8 max-w-4xl"
              style={{ color: '#4a1a2a' }}
            >
              FYCI has three main organs that work together to empower young people and drive positive social change.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Three Main Organs Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          >
            {organs.map((organ, index) => {
              return (
                <motion.div
                  key={organ.id}
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="rounded-xl p-8 bg-gray-50"
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#360e1d' }}>
                      <Image
                        src={organ.iconSrc}
                        alt={organ.title}
                        width={56}
                        height={56}
                        className="filter brightness-0 invert w-14 h-14 object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{organ.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {organ.description}
                  </p>
                </motion.div>
              );
            })}
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
