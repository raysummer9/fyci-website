'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, Heart, Target } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GetInvolvedCTA() {
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
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #360e1d, #4a1a2a)' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-white/15 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-4 h-12 bg-white/10 rotate-12 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-10 h-10 bg-white/10 rounded-full animate-bounce"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-md animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-white/8 to-transparent rounded-full blur-md animate-bounce"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-1/3 w-px h-24 bg-gradient-to-t from-transparent via-white/8 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
            className="order-2 lg:order-1"
          >
            <motion.h2 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Get Involved
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed"
            >
              Join us in empowering young people across Africa. Whether you're a volunteer, partner, or supporter, 
              there are many ways to make a difference in your community.
            </motion.p>


            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-3 text-white font-bold text-lg hover:gap-4 transition-all duration-300"
                style={{ color: 'white' }}
              >
                Join Our Mission
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Actual Image */}
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/img1.JPG"
                  alt="Youth training session with hands-on activity"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                {/* Primary color gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(54, 14, 29, 0.4) 0%, rgba(54, 14, 29, 0.2) 50%, rgba(54, 14, 29, 0.3) 100%)'
                  }}
                ></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
