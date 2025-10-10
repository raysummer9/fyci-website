'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ExternalLink } from 'lucide-react';

export default function YouTubeChannel() {
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
    <section className="py-20" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
          >
            Creativity and Inspiration
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 max-w-5xl"
          >
            Subscribe to our YouTube channel to stay updated with our latest projects, success stories, and youth empowerment initiatives.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              {/* YouTube Video Embed - Replace with your actual video ID */}
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/5R0AqYB1qYA?si=bVKDz6U1pQFw-Jav&controls=0&start=22&autoplay=1&mute=1&loop=1&playlist=5R0AqYB1qYA"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Video Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-1">Latest from FYCI</h3>
                  <p className="text-gray-300 text-sm">Watch our latest project highlights and success stories</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="order-2 lg:order-2"
          >
            <div className="space-y-8">
              <div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our YouTube channel is your gateway to seeing FYCI's impact in action. From workshop highlights 
                  to participant testimonials, we share the stories of transformation and empowerment that happen 
                  every day in our programs.
                </p>
              </div>


              {/* CTA Button */}
              <div>
                <Link
                  href="https://www.youtube.com/@fycinitiative/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg"
                >
                  <Play size={20} />
                  Subscribe to Our Channel
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Additional Info */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">What You'll Find:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Project highlights and success stories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Workshop and training session footage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Participant testimonials and interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Behind-the-scenes content from our programs
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
