'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

export default function Blog() {
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

  const blogPosts = [
    {
      id: '1',
      title: 'The Power of Creative Expression in Youth Development',
      excerpt: 'Exploring how artistic expression helps young people build confidence, develop critical thinking skills, and find their unique voice in today\'s world.',
      date: 'January 15, 2024',
      author: 'Sarah Johnson',
      category: 'Youth Development',
      image: '/img/youth-agency.jpg',
      link: '#'
    },
    {
      id: '2',
      title: 'Building Inclusive Communities Through Art',
      excerpt: 'How creative programs bring together young people from diverse backgrounds to collaborate, learn, and create meaningful change in their communities.',
      date: 'January 8, 2024',
      author: 'Michael Chen',
      category: 'Community Impact',
      image: '/img/gender-rights.jpg',
      link: '#'
    },
    {
      id: '3',
      title: 'Digital Innovation in Creative Education',
      excerpt: 'The role of technology in expanding access to creative education and empowering young people to explore new forms of artistic expression.',
      date: 'December 28, 2023',
      author: 'Aisha Patel',
      category: 'Innovation',
      image: '/img/anti-corruption.jpg',
      link: '#'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mb-12 text-center"
        >
          <motion.h2 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
          >
            Latest Blog Posts
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 max-w-5xl mx-auto"
          >
            Insights, stories, and perspectives on youth creativity, innovation, and community impact.
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1, margin: "-100px" }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.1 
                }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/30"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block bg-purple-600/20 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-left text-gray-900 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-left leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <a
                    href={post.link}
                    className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                  >
                    Read more
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Visit Blog Button */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 hover:shadow-lg">
            Visit Our Blog
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
