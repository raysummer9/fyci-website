'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User } from 'lucide-react';
import { useState } from 'react';
import YouTubeChannel from '@/components/YouTubeChannel';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submission:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          >
            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              style={{ color: '#360e1d' }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-xl max-w-4xl"
              style={{ color: '#360e1d' }}
            >
              Get in touch with us for inquiries, partnerships, or to learn more about how you can be part of our mission to empower young people through creative expression and community engagement.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Contact Information Column */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              {/* Contact Details Grid - 2 items per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Address */}
                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: '#e6e1e3' }}>
                    <Mail size={24} style={{ color: '#360e1d' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Address</h3>
                    <p className="text-gray-600">contact@fyci.org</p>
                    <p className="text-gray-600">fycinitiative@gmail.com</p>
                  </div>
                </motion.div>

                {/* Phone Number */}
                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: '#e6e1e3' }}>
                    <Phone size={24} style={{ color: '#360e1d' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Number</h3>
                    <p className="text-gray-600">+234 (0) 123 456 7890</p>
                    <p className="text-gray-600">+234 (0) 987 654 3210</p>
                  </div>
                </motion.div>

                {/* Office Address - spans full width */}
                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                  className="flex items-start gap-4 sm:col-span-2"
                >
                  <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: '#e6e1e3' }}>
                    <MapPin size={24} style={{ color: '#360e1d' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      LL4B Sunnyvale Estate<br />
                      Abuja, Nigeria
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form Column */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-base bg-transparent"
                      style={{ borderBottomColor: '#e5e7eb' }}
                      onFocus={(e) => e.target.style.borderBottomColor = '#360e1d'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                    />
                    <div className="absolute right-0 top-3">
                      <User size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-base bg-transparent"
                      style={{ borderBottomColor: '#e5e7eb' }}
                      onFocus={(e) => e.target.style.borderBottomColor = '#360e1d'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                    />
                    <div className="absolute right-0 top-3">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this regarding?"
                    required
                    className="w-full px-4 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-base bg-transparent"
                    style={{ borderBottomColor: '#e5e7eb' }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#360e1d'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-base bg-transparent resize-none"
                    style={{ borderBottomColor: '#e5e7eb' }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#360e1d'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#e5e7eb'}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                  <Send size={16} />
                </motion.button>
              </motion.form>

              <motion.p 
                variants={itemVariants}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-gray-600 text-sm mt-6 leading-relaxed"
              >
                We'll get back to you within 24-48 hours. For urgent matters, please call us directly.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Channel Section */}
      <YouTubeChannel />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}
