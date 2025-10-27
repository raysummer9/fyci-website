'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Quote, UserCheck, ArrowRight } from 'lucide-react';

export default function SuccessStory() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  const slideVariants = {
    enter: {
      opacity: 0
    },
    center: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  };

  const testimonials = [
    {
      id: '1',
      name: 'Emmanuella Aisien',
      role: 'Programme Participant',
      quote: "I am really lucky to have attended the skills acquisition training because I learnt a lot in a short period of time and as a result, I can put what I've learnt to good use in the future. I'd advice anyone who reads this to attend the next meeting.",
      rating: 5
    },
    {
      id: '2',
      name: 'Eze Harrison Ebuka',
      role: 'Programme Participant',
      quote: "I learned how to use Legend and Inshot software applications to make self-branding introductory videos. In addition to this, I learned how to add text and audio to the video. It was an awesome time and I'm delighted to be part of the class. Thanks!",
      rating: 5
    },
    {
      id: '3',
      name: 'Igugu Joy Aghogho',
      role: 'Programme Participant',
      quote: "I want to use this medium to appreciate the FYCI excos for this wonderful opportunity to be a part of this training or programme. As regards the physical and virtual training, I learnt how to make hair fascinator and also went through a self branding training on how to market myself/business, and how to make and edit videos. I must say, the both training has really helped me so far most especially the self branding training. This has really helped in promoting my shoe business, and it's now of the ways I use in showcasing or advertising my products unlike the usual way. Thanks.",
      rating: 5
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

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
            Success Stories
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl"
            style={{ color: '#4a1a2a' }}
          >
            Hear from the young people whose lives have been transformed through our creative programs and initiatives.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial Slider */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-1"
          >
            <div className="relative">
              {/* Slider Container */}
              <div className="relative min-h-[28rem] overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={currentTestimonial}
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0"
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-emerald-100 h-full">
                      {/* Testimonial Content */}
                      <div className="p-8">
                        {/* Quote Icon */}
                        <div className="flex justify-center mb-6">
                          <div className="bg-white/80 backdrop-blur-sm rounded-full p-4">
                            <Quote size={24} className="text-purple-600" />
                          </div>
                        </div>
                        
                        {/* Quote */}
                        <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                          "{testimonials[currentTestimonial].quote}"
                        </blockquote>
                        
                        {/* Author */}
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserCheck size={24} className="text-purple-600" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                            <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
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
                  Our success stories are more than just testimonials – they represent real transformation and empowerment. 
                  Every young person who joins our programmes brings unique talents and dreams, and we're proud to help them 
                  discover their potential and achieve their goals.
                </p>
              </div>

              {/* Call to Action */}
              <div className="bg-purple-50 rounded-xl p-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Be Our Next Success Story</h3>
                <p className="text-gray-700 mb-6">
                  Join our programmes and start your journey of creative discovery and personal growth.
                </p>
                <button className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer">
                  Our Programmes
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
