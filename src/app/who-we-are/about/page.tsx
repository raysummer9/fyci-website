'use client';

import { Metadata } from 'next'
import { useState } from 'react';
import { Target, Eye, Sparkles, UserCheck, Heart, Vote, Shield, Users2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Partners from '@/components/Partners';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('biography');

  const tabs = [
    { id: 'biography', label: 'Biography' },
    { id: 'mission-vision', label: 'Mission and Vision' },
    { id: 'values', label: 'Our Values' },
    { id: 'approach', label: 'Our Approach' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Overview Section with Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {/* Overview Heading */}
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: false, amount: 0.2 }}
          >
            Overview
          </motion.h2>
          
          {/* Overview Description */}
          <motion.p 
            className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 mb-12 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: false, amount: 0.2 }}
          >
            The Frontline Youth Creativity Initiative (FYCI) is dedicated to empowering young people across Africa to become active citizens and leaders in their communities through innovative programs and civic engagement.
          </motion.p>

          {/* Tabs */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="border-b-2 border-gray-200">
              <nav className="-mb-0.5 flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-bold text-base transition-colors
                      ${activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activeTab === 'biography' && (
                <motion.div 
                  key="biography"
                  className="prose prose-lg max-w-none"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Frontline Youth Creativity Initiative (FYCI) is a non-governmental, non-profit organisation working to empower young girls and boys to speak out against ills in society. Founded in 2021 with headquarters in Abuja, Nigeria, FYCI believes that the creative arts are a powerful force that can be utilised to drive discourses that influence critical stakeholders to make sustainable changes for the good of society.
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We aim to address some of the political, socio-cultural and economic vices in Nigeria and Africa as a whole by promoting positive virtues through creative means such as music/rap, spoken word, poetry, prose, drama, fine art, photography/videography, creative writing, dance, etc. Some of the vices we aim to address are poor political participation among young people, gender inequality, low self-esteem among young boys and girls, corruption, and sexual and gender-based violence (SGBV).
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Young people have not been given the appropriate mechanisms to express themselves, which has resulted in a stifling of youth voices. Against this context, our target audiences are young boys/ girls and young adults from whom we seek to elicit positive behaviours and attitudes whilst serving as change agents themselves.
                </p>
                </motion.div>
              )}

              {activeTab === 'mission-vision' && (
                <motion.div 
                  key="mission-vision"
                  className="prose prose-lg max-w-none"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Target className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Our mission is to influence and target the content of creative arts by young people to challenge the status quo and promote positive social change.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Eye className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We envision a society in which young people, grounded in ideology targeted at social change, raise their voices as creatives using their craft to engender sustainable development.
                    </p>
                  </div>
                </div>
                </motion.div>
              )}

              {activeTab === 'values' && (
                <motion.div 
                  key="values"
                  className="prose prose-lg max-w-none"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Creativity & Innovation */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Sparkles className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Creativity & Innovation</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We believe that the creative arts can be used in innovative ways to promote positive change in society. We aim to encourage young Nigerians and Africans to hone their creative skills and utilise well-informed content to challenge the ills in society.
                    </p>
                  </div>

                  {/* Equal Participation */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <UserCheck className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Equal Participation</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We believe that everyone should have a right to participate in society, regardless of their sex, race, religion, socio-economic background, disability status, and other identities. We ensure that there is no discrimination against any beneficiary of our programmes.
                    </p>
                  </div>

                  {/* Diversity and Inclusion */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Heart className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Diversity and Inclusion</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We believe that every person is unique, and a society is bound to develop more effectively if it utilises the distinct skill sets of each of its members. We encourage people from diverse backgrounds, particularly those that have historically been underrepresented (for example, persons with disabilities), to bring their creative skills to the table.
                    </p>
                  </div>
                </div>
                </motion.div>
              )}

              {activeTab === 'approach' && (
                <motion.div 
                  key="approach"
                  className="prose prose-lg max-w-none"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  The use of the creative arts to influence behaviours has been recognised as an effective method in the literature on behavioural insights. As Policy Horizons Canada has pointed out, "creative arts (such as performance arts, photography, music, creative literature, and visual arts) can have the power to evoke powerful emotions and influence behaviour". In recognition of this power of the creative arts to change behaviours, our approach is predicated on the Social Art for Behaviour Change (SABC) approach developed by the One Drop Foundation to encourage healthy behaviours around water.
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  The SABC approach "integrates a systematic and evidence-based process that takes into consideration behavioural determinants as well as cultural and artistic references, to create locally inspired social art programs". By connecting with the emotional part of the brain through art forms such as circus performances and fine art, One Drop has fostered the adoption of healthy behaviours around water among their beneficiary communities, leading to higher living conditions of almost 2.1 million people in 13 countries across Africa, Asia, and Latin America.
                </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Four Major Themes Section */}
      <section className="py-16" style={{ backgroundColor: '#5920a4' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 max-w-4xl">
              Based on the successes of the SABC approach in the context of water, sanitation and hygiene (WASH) projects, FYCI seeks to use this same approach to lay the foundation for sustainable positive change in Nigeria (and Africa), focusing on four major themes:
            </h3>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* Youth Political Participation */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/img/about-icons/youth-political-participation.svg"
                    alt="Youth Political Participation"
                    width={48}
                    height={48}
                    className="filter brightness-0 invert w-12 h-12 object-contain"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Youth Political Participation</h4>
              </div>
            </motion.div>

            {/* Gender Rights */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/img/about-icons/gender-rights.svg"
                    alt="Gender Rights"
                    width={48}
                    height={48}
                    className="filter brightness-0 invert w-12 h-12 object-contain"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Gender Rights</h4>
              </div>
            </motion.div>

            {/* Youth Agency and Self-Esteem */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/img/about-icons/self-esteem.svg"
                    alt="Youth Agency and Self-Esteem"
                    width={48}
                    height={48}
                    className="filter brightness-0 invert w-12 h-12 object-contain"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Youth Agency and Self-Esteem</h4>
              </div>
            </motion.div>

            {/* Anti-Corruption */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg w-16 h-16 flex items-center justify-center">
                  <Image
                    src="/img/about-icons/anti-corruption.svg"
                    alt="Anti-Corruption"
                    width={48}
                    height={48}
                    className="filter brightness-0 invert w-12 h-12 object-contain"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Anti-Corruption</h4>
              </div>
            </motion.div>
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
