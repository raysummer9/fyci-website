'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Partners() {
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

  const partners = [
    {
      id: '1',
      name: 'Centre LSD',
      logo: '/img/partners/Centre LSD Logo.png',
      website: 'https://centrelsd.org'
    },
    {
      id: '2',
      name: 'PPJ',
      logo: '/img/partners/PPJ.png',
      website: 'https://ppj.priestsassembly.org/'
    },
    {
      id: '3',
      name: 'UNDP',
      logo: '/img/partners/undp.png',
      website: 'https://undp.org'
    },
    {
      id: '4',
      name: 'Yiaga Africa',
      logo: '/img/partners/yiaga.png',
      website: 'https://yiaga.org'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="order-1"
          >
            <motion.h2 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
            >
              Our Partners
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 mb-8"
            >
              We work with leading organizations and institutions to amplify our impact and reach more young people across communities.
            </motion.p>
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-gray-600 leading-relaxed"
            >
              Through strategic partnerships, we leverage collective expertise, resources, and networks to create meaningful change in youth development and community empowerment.
            </motion.p>
          </motion.div>

          {/* Partners Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="order-2"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  variants={itemVariants}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.1 
                  }}
                  className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-24 relative hover:scale-105 transition-transform duration-300"
                  >
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
