'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Calendar, User, Share2, ArrowRight } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Featured post data
  const featuredPost = {
    category: "MIND & WELL-BEING",
    title: "You're not broken, you're just different.",
    date: "OCTOBER 19, 2025",
    author: "JENNIFER OBIAGELI PHILIP",
    excerpt: "I once had a friend tell me she does not want to have children so as not to replicate her genes. She didn't mind adopting, though. It's easy to feel broken when we see parts of ourselves that don't align with what we believe is 'normal' or acceptable. But what if our differences are actually our greatest strengths?",
    image: "/img/autumn-trees.jpg", // You'll need to add this image
    slug: "youre-not-broken-youre-just-different"
  };

  // Recent posts data
  const recentPosts = [
    {
      id: 1,
      title: "Dangote Truck Tragedy: The Death of Phyna's Sister Reveals the Urgent Need for Nigeria's Road Law Reform",
      date: "SEPTEMBER 9, 2025",
      image: "/img/traffic-scene.jpg", // You'll need to add this image
      slug: "dangote-truck-tragedy"
    }
  ];

  // Categories data
  const categories = [
    { name: "LAW & POLICY", count: 4 },
    { name: "LIFESTYLE", count: 1 },
    { name: "MIND & WELL-BEING", count: 6 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content Area - Left Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1, margin: "-100px" }}
              className="lg:col-span-2"
            >
              {/* Featured Post Card */}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <motion.article className="space-y-6">
                  {/* Featured Image - First */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                    className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Featured Image</span>
                    </div>
                  </motion.div>

                  {/* Category Tag */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                  >
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                    >
                      {featuredPost.category}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight"
                  >
                    {featuredPost.title}
                  </motion.h1>

                  {/* Date and Author in one line */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                    className="flex items-center gap-4 text-sm text-gray-500"
                  >
                    <span className="font-medium uppercase tracking-wide">{featuredPost.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium uppercase tracking-wide">{featuredPost.author}</span>
                  </motion.div>

                  {/* Excerpt */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </motion.div>

                  {/* View Post Button - Text and Icon */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
                  >
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                      style={{ color: '#360e1d' }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#4a1a2a'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#360e1d'}
                    >
                      View Post
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                </motion.article>
              </motion.div>
            </motion.div>

            {/* Sidebar - Right Column */}
            <motion.aside
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1, margin: "-100px" }}
              className="lg:col-span-1"
            >
              <div className="space-y-12">
                
                {/* Recent Posts */}
                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Recent Posts
                  </h2>
                  
                  <div className="space-y-6">
                    {recentPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        variants={itemVariants}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 + (index * 0.1) }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="flex gap-4">
                            {/* Post Image */}
                            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-gray-500">Image</span>
              </div>
            </div>
                            
                            {/* Post Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-gray-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                {post.date}
                              </p>
              </div>
            </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Categories
                  </h2>
                  
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        variants={itemVariants}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 + (index * 0.1) }}
                      >
                        <Link
                          href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                          className="flex items-center justify-between py-2 hover:text-gray-600 transition-colors"
                        >
                          <span className="text-gray-900 font-medium">{category.name}</span>
                          <span className="text-gray-500 text-sm">({category.count})</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.aside>
            </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}