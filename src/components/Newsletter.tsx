'use client';

import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#5920a4' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Content Section */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-left mb-8 sm:mb-10 lg:mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6"
            >
              Join Our Newsletter
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/90 leading-relaxed"
            >
              Stay updated with our latest projects, success stories, and opportunities to get involved in youth empowerment initiatives.
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="max-w-4xl"
          >
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-end">
                <div className="flex-1">
                  <label className="block text-white/80 text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-white text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors duration-200 text-base"
                    style={{ borderBottomColor: 'white' }}
                  />
                </div>
                <div className="flex-1 relative">
                  <label className="block text-white/80 text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-white text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors duration-200 text-base"
                    style={{ borderBottomColor: 'white' }}
                  />
                  <div className="absolute right-0 top-8">
                    <Mail size={16} className="text-white/60" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 whitespace-nowrap inline-flex items-center justify-center gap-2 w-full lg:w-auto"
                >
                  Subscribe
                  <Send size={16} />
                </button>
              </div>
            </motion.form>

            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white/70 text-sm sm:text-base mt-4 sm:mt-6 leading-relaxed text-left"
            >
              By entering your email address and clicking <b>Subscribe</b>, you agree to receive updates from FYCI.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
