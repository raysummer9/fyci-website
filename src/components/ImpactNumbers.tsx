'use client';

import { motion } from 'framer-motion';

export default function ImpactNumbers() {
  const stats = [
    {
      number: "3,471+",
      label: "Views on the FYCI Blog"
    },
    {
      number: "221",
      label: "Beneficiaries Trained/Sensitised"
    },
    {
      number: "100+",
      label: "Posts on the FYCI Blog"
    },
    {
      number: "4",
      label: "Organisations Partnered With"
    }
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
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
            Our Impact
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl"
            style={{ color: '#4a1a2a' }}
          >
            Through our dedicated programs and initiatives, we've made a measurable difference in the lives of young people and communities across the region.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index * 0.1 
              }}
              className="text-left rounded-2xl p-6 transition-all duration-300"
              style={{ backgroundColor: '#e6e1e3' }}
            >
              <div className="text-5xl sm:text-6xl font-black mb-3" style={{ color: '#360e1d' }}>{stat.number}</div>
              <div className="text-xl sm:text-2xl font-semibold" style={{ color: '#360e1d' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
