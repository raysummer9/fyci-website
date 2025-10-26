'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Facebook, Twitter, Calendar, User, Share2, ArrowRight, Instagram, Youtube, ChevronLeft, ChevronRight, Eye, MessageCircle, Heart, Clock } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string, count: number}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string, slugs: string, count: number}[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Fetch featured post
        const featuredResponse = await fetch('/api/blogs?featured=true&limit=1');
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedPost(featuredData[0] || null);
        }

        // Fetch recent posts
        const recentResponse = await fetch('/api/blogs?limit=3');
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentPosts(recentData.slice(0, 3));
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/blogs/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        // Fetch tags
        const tagsResponse = await fetch('/api/blogs/tags');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }

        // Fetch all blog posts for pagination
        const allPostsResponse = await fetch('/api/blogs?limit=20');
        if (allPostsResponse.ok) {
          const allPostsData = await allPostsResponse.json();
          setBlogPosts(allPostsData);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
        // Set fallback data
        setFeaturedPost({
          id: '1',
          title: "You're not broken, you're just different.",
          slug: "youre-not-broken-youre-just-different",
          excerpt: "I once had a friend tell me she does not want to have children so as not to replicate her genes. She didn't mind adopting, though. It's easy to feel broken when we see parts of ourselves that don't align with what we believe is 'normal' or acceptable. But what if our differences are actually our greatest strengths?",
          published_at: '2025-10-19T00:00:00Z',
          created_at: '2025-10-19T00:00:00Z',
          status: 'published',
          featured: true,
          views: 3420,
          likes: 445,
          read_time: 8,
          category: { id: '1', name: 'MIND & WELL-BEING', slug: 'mind-well-being' },
          author: { id: '1', full_name: 'JENNIFER OBIAGELI PHILIP', email: 'jennifer@example.com' },
          tags: []
        });
        setCategories([
          { id: '1', name: 'LAW & POLICY', slug: 'law-policy', count: 4 },
          { id: '2', name: 'LIFESTYLE', slug: 'lifestyle', count: 1 },
          { id: '3', name: 'MIND & WELL-BEING', slug: 'mind-well-being', count: 6 }
        ]);
        setTags([
          { id: '1', name: 'Youth Empowerment', slugs: 'youth-empowerment', count: 5 },
          { id: '2', name: 'Creative Arts', slugs: 'creative-arts', count: 3 },
          { id: '3', name: 'Social Change', slugs: 'social-change', count: 4 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  // Pagination logic
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            style={{ color: '#360e1d' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
             Welcome to the FYCI Blog
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Explore insights, stories, and perspectives on youth development, creative expression, and social change from our community and partners.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Posts Section - Left Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* Featured Post Section */}
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Featured Post
                </motion.h2>
                
                {/* Featured Post Card */}
                {loading ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                    <div className="space-y-6">
                      <div className="w-full h-64 lg:h-80 bg-gray-200 rounded-lg"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : featuredPost ? (
                  <motion.div 
                    className="bg-white rounded-xl shadow-lg p-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <article className="space-y-6">
                      {/* Featured Image - First */}
                      <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
                        {featuredPost.featured_image ? (
                          <img 
                            src={featuredPost.featured_image} 
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Featured Image</span>
                          </div>
                        )}
                      </div>

                      {/* Category Tag */}
                      <div>
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                          style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                        >
                          {featuredPost.category?.name || 'Blog'}
                        </span>
                      </div>

                      {/* Title */}
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                        {featuredPost.title}
                      </h1>

                      {/* Date */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium uppercase tracking-wide">
                          {formatDate(featuredPost.published_at || featuredPost.created_at)}
                        </span>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        {/* Views */}
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{featuredPost.views.toLocaleString()}</span>
                        </div>
                        
                        {/* Likes */}
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>{featuredPost.likes}</span>
                        </div>
                        
                        {/* Read Time */}
                        {featuredPost.read_time && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{featuredPost.read_time} min read</span>
                          </div>
                        )}
                      </div>
            
                      {/* View Post Button - Text and Icon */}
                      <div>
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
                      </div>
                    </article>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-500">No featured post available</p>
                  </div>
                )}
              </div>

              {/* Blog Grid Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: false, amount: 0.1, margin: "-100px" }}
              >
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: false, amount: 0.1, margin: "-100px" }}
                >
                  All Posts
                </motion.h2>
                
                <div className="w-full">
                  {loading ? (
                    <div className="space-y-6">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                          <div className="flex flex-col sm:flex-row sm:items-stretch">
                            <div className="w-full sm:w-80 flex-shrink-0 bg-gray-200 h-48 sm:h-auto sm:min-h-0"></div>
                            <div className="flex-1 p-6 space-y-4">
                              <div className="h-6 bg-gray-200 rounded w-24"></div>
                              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.1, margin: "-100px" }}
                          transition={{ duration: 0.8, delay: 0.2 + (index * 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row sm:items-stretch">
                            {/* Post Image - Left Side */}
                            <div className="relative w-full sm:w-80 flex-shrink-0 bg-gray-200 overflow-hidden h-48 sm:h-auto sm:min-h-0">
                              {post.featured_image ? (
                                <img 
                                  src={post.featured_image} 
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Post Image</span>
                                </div>
                              )}
                            </div>

                            {/* Post Content - Right Side */}
                            <div className="flex-1 p-6 space-y-4">
                              {/* Category */}
                              <span 
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                              >
                                {post.category?.name || 'Blog'}
                              </span>

                              {/* Title */}
                              <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                                {post.title}
                              </h3>

                              {/* Excerpt */}
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>

                              {/* Date */}
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                {formatDate(post.published_at || post.created_at)}
                              </p>

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                {/* Views */}
                                <div className="flex items-center gap-1">
                                  <Eye size={14} />
                                  <span>{post.views.toLocaleString()}</span>
                                </div>
                                
                                {/* Likes */}
                                <div className="flex items-center gap-1">
                                  <Heart size={14} />
                                  <span>{post.likes}</span>
                                </div>
                                
                                {/* Read Time */}
                                {post.read_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{post.read_time} min read</span>
                                  </div>
                                )}
                              </div>

                              {/* Read More */}
                              <div className="pt-2">
                                <span className="inline-flex items-center gap-2 font-semibold text-sm"
                                  style={{ color: '#360e1d' }}
                                >
                                  Read More
                                  <ArrowRight size={14} />
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <motion.div 
                    className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-12 px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          style={{
                            backgroundColor: currentPage === page ? '#360e1d' : 'transparent'
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar - Right Column */}
            <motion.aside 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="space-y-12">
                
                {/* Recent Posts */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Recent Posts
                  </h2>
                  
                  <div className="space-y-6">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex gap-4 animate-pulse">
                          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200"></div>
                          <div className="flex-1 min-w-0">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      recentPosts.map((post, index) => (
                        <article
                          key={post.id}
                          className="group cursor-pointer"
                        >
                          <Link href={`/blog/${post.slug}`}>
                            <div className="flex gap-4">
                              {/* Post Image */}
                              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                                {post.featured_image ? (
                                  <img 
                                    src={post.featured_image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Image</span>
                                  </div>
                                )}
                              </div>
              
                              {/* Post Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-gray-600 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  {formatDate(post.published_at || post.created_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Categories
                  </h2>
                  
                  <div className="space-y-3">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between py-2 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-8"></div>
                        </div>
                      ))
                    ) : (
                      categories.map((category, index) => (
                        <div key={category.id}>
                          <Link
                            href={`/blog/category/${category.slug}`}
                            className="flex items-center justify-between py-2 hover:text-gray-600 transition-colors"
                          >
                            <span className="text-gray-900 font-medium">{category.name}</span>
                            <span className="text-gray-500 text-sm">({category.count})</span>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* About Us */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    About Us
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Frontline Youth Creativity Initiative (FYCI) is a non-governmental, non-profit organisation working to empower young creatives to be positive change agents.
                  </p>

                  {/* Social Media Icons */}
                  <div className="flex gap-4 mb-6">
                    <Link
                      href="#"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} className="text-gray-700" />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} className="text-gray-700" />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} className="text-gray-700" />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube size={20} className="text-gray-700" />
                    </Link>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      ))
                    ) : (
                      tags.map((tag, index) => (
                        <span
                          key={tag.id}
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
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