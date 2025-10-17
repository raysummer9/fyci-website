'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
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

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#360e1d' }}>
      {/* Background decoration - Enhanced Blobs */}
      <div className="absolute inset-0 opacity-20">
        {/* Large organic blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-white/15 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}></div>
        
        {/* Additional organic shapes */}
        <div className="absolute top-60 left-1/3 w-64 h-64 bg-white/12 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-1000" style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }}></div>
        <div className="absolute bottom-40 right-1/3 w-56 h-56 bg-white/18 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-3000" style={{ borderRadius: '70% 30% 30% 70% / 40% 60% 40% 60%' }}></div>
      </div>

      {/* Floating blob elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small floating blobs */}
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/25 rounded-full blur-sm animate-pulse" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
        <div className="absolute top-48 left-32 w-20 h-20 bg-white/20 rounded-full blur-sm animate-bounce" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
        <div className="absolute bottom-32 right-32 w-12 h-18 bg-white/30 rounded-full blur-sm animate-pulse" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}></div>
        <div className="absolute bottom-48 left-20 w-14 h-14 bg-white/25 rounded-full blur-sm animate-bounce" style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }}></div>
        
        {/* Medium floating blobs */}
        <div className="absolute top-16 right-1/3 w-24 h-24 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-md animate-pulse" style={{ borderRadius: '70% 30% 30% 70% / 40% 60% 40% 60%' }}></div>
        <div className="absolute bottom-16 left-1/3 w-18 h-18 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-md animate-bounce" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
        
        {/* Organic flowing shapes */}
        <div className="absolute top-1/4 left-0 w-40 h-8 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full blur-sm animate-pulse" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}></div>
        <div className="absolute bottom-1/4 right-0 w-32 h-6 bg-gradient-to-l from-transparent via-white/12 to-transparent rounded-full blur-sm animate-bounce" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
        
        {/* Tiny accent blobs */}
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/30 rounded-full blur-sm animate-pulse" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/25 rounded-full blur-sm animate-bounce" style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full text-sm font-medium mb-6"
          >
            <Sparkles size={18} />
            <span>Frontline Youth Creativity Initiative</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
          >
            Promoting Youth Agency Through the{' '}
              Creative Arts
            
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl text-white/90 mb-8 leading-relaxed"
          >
            Empowering young people to express themselves, build confidence, and create positive change in their communities through creative expression and artistic development.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href="/what-we-do"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{ color: '#360e1d' }}
            >
              What We Do
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
