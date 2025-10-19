'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, ExternalLink, Download } from 'lucide-react';
import GetInvolvedCTA from '@/components/GetInvolvedCTA';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function AnnualReportsPage() {
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

  const reports = [
    {
      id: '1',
      title: 'Annual Report 2023',
      description: 'A comprehensive overview of our activities, impact, and achievements throughout 2023, showcasing our growth and the positive change we\'ve created in communities.',
      date: 'December 2023',
      type: 'Annual Report',
      link: '#',
      year: '2023'
    },
    {
      id: '2',
      title: 'Annual Report 2022',
      description: 'Our journey and achievements throughout 2022, highlighting key milestones, program successes, and the impact of our youth empowerment initiatives.',
      date: 'December 2022',
      type: 'Annual Report',
      link: '#',
      year: '2022'
    },
    {
      id: '3',
      title: 'Annual Report 2021',
      description: 'Foundation year report showcasing our initial impact, the establishment of our programs, and our first steps in empowering young people across Africa.',
      date: 'December 2021',
      type: 'Annual Report',
      link: '#',
      year: '2021'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 right-10 w-6 h-6 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-10 w-4 h-4 bg-gray-50 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-3 h-10 bg-gray-50 rotate-12 animate-bounce"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-gray-50/30 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-gray-100/20 to-transparent rounded-full blur-lg"></div>
      </div>

      {/* Header Section - Matching About page style */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1, margin: "-100px" }}
            className="mb-12"
          >
            <motion.h1 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              style={{ color: '#360e1d' }}
            >
              Annual Reports
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl"
              style={{ color: '#4a1a2a' }}
            >
              Review our annual reports to see our impact, achievements, and financial transparency as we work to empower young people across Africa.
            </motion.p>
          </motion.div>

          {/* Reports Grid - Full Width */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid gap-6">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  variants={itemVariants}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.1 
                  }}
                  className="bg-white rounded-xl border border-gray-200/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-1 order-2 sm:order-1">
                      {/* Report Type Badge */}
                      <div className="mb-3">
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                          {report.type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-left text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-left leading-relaxed">
                        {report.description}
                      </p>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar size={16} />
                        <span>{report.date}</span>
                      </div>
                      
                      <a
                        href={report.link}
                        className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                      >
                        View Report
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    
                    {/* Report Cover Placeholder */}
                    <div className="flex-shrink-0 order-1 sm:order-2">
                        <div className="w-32 h-48 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
                          <span className="text-2xl font-bold" style={{ color: '#360e1d' }}>{report.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Involved CTA Section */}
      <GetInvolvedCTA />

      {/* Partners Section */}
      <Partners />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}
