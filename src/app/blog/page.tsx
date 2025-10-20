'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Calendar, User, Share2, ArrowRight, Instagram, Youtube, ChevronLeft, ChevronRight, Eye, MessageCircle, Heart, Clock } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

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
    slug: "youre-not-broken-youre-just-different",
    views: 3420,
    comments: 87,
    likes: 445,
    readTime: "8 min read"
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

  // Tags data
  const tags = [
    "Youth Empowerment", "Creative Arts", "Social Change", "Community Development", 
    "Leadership", "Advocacy", "NGO", "Non-profit", "Nigeria", "Africa"
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Creative Expression in Youth Development",
      excerpt: "Exploring how creative arts can transform young people's lives and build confidence in their abilities to create positive change.",
      category: "Creative Arts",
      date: "October 15, 2025",
      image: "/img/creative-workshop.jpg",
      slug: "creative-expression-youth-development",
      views: 1240,
      comments: 23,
      likes: 156,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Breaking Barriers: Gender Rights and Advocacy in Nigeria",
      excerpt: "Addressing the challenges and opportunities in promoting gender equality and women's rights across Nigerian communities.",
      category: "Gender Rights",
      date: "October 12, 2025",
      image: "/img/gender-rights.jpg",
      slug: "gender-rights-advocacy-nigeria",
      views: 980,
      comments: 18,
      likes: 134,
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Political Participation and Youth Voice in Democracy",
      excerpt: "Understanding how young people can effectively engage in political processes and make their voices heard in democratic systems.",
      category: "Political Participation",
      date: "October 10, 2025",
      image: "/img/youth-politics.jpg",
      slug: "political-participation-youth-democracy",
      views: 1567,
      comments: 31,
      likes: 189,
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Building Community Resilience Through Art and Culture",
      excerpt: "How cultural initiatives and artistic programs strengthen community bonds and create lasting positive impact.",
      category: "Community Development",
      date: "October 8, 2025",
      image: "/img/community-art.jpg",
      slug: "community-resilience-art-culture",
      views: 892,
      comments: 15,
      likes: 112,
      readTime: "4 min read"
    },
    {
      id: 5,
      title: "Anti-Corruption Strategies for Young Change Makers",
      excerpt: "Practical approaches for young people to identify, resist, and work against corruption in their communities and institutions.",
      category: "Anti-Corruption",
      date: "October 5, 2025",
      image: "/img/anti-corruption.jpg",
      slug: "anti-corruption-strategies-young-changemakers",
      views: 2134,
      comments: 42,
      likes: 267,
      readTime: "8 min read"
    },
    {
      id: 6,
      title: "Sustainable Development Goals and Youth Action",
      excerpt: "How Nigerian youth can contribute to achieving the UN Sustainable Development Goals through creative and innovative approaches.",
      category: "Development",
      date: "October 3, 2025",
      image: "/img/sdg-youth.jpg",
      slug: "sustainable-development-goals-youth-action",
      views: 1123,
      comments: 27,
      likes: 178,
      readTime: "6 min read"
    },
    {
      id: 7,
      title: "Digital Literacy and Modern Youth Empowerment",
      excerpt: "The importance of digital skills in contemporary youth development and how technology can amplify young voices.",
      category: "Technology",
      date: "October 1, 2025",
      image: "/img/digital-literacy.jpg",
      slug: "digital-literacy-modern-youth-empowerment",
      views: 1876,
      comments: 35,
      likes: 298,
      readTime: "5 min read"
    },
    {
      id: 8,
      title: "Mental Health and Wellbeing in Youth Programs",
      excerpt: "Integrating mental health support into youth development initiatives and creating safe spaces for emotional growth.",
      category: "Mental Health",
      date: "September 28, 2025",
      image: "/img/mental-health.jpg",
      slug: "mental-health-wellbeing-youth-program",
      views: 1456,
      comments: 29,
      likes: 203,
      readTime: "7 min read"
    },
    {
      id: 9,
      title: "Environmental Activism and Green Leadership",
      excerpt: "How young environmental activists are leading the charge for climate action and sustainable practices in Nigeria.",
      category: "Environment",
      date: "September 25, 2025",
      image: "/img/environmental-activism.jpg",
      slug: "environmental-activism-green-leadership",
      views: 1034,
      comments: 19,
      likes: 145,
      readTime: "4 min read"
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Posts Section - Left Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* Featured Post Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <article className="space-y-6">
                  {/* Featured Image - First */}
                  <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Featured Image</span>
                    </div>
                  </div>

                  {/* Category Tag */}
                  <div>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                    >
                      {featuredPost.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                    {featuredPost.title}
                  </h1>

                  {/* Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium uppercase tracking-wide">{featuredPost.date}</span>
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
                    
                    {/* Comments */}
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{featuredPost.comments}</span>
                    </div>
                    
                    {/* Likes */}
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{featuredPost.likes}</span>
                    </div>
                    
                    {/* Read Time */}
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{featuredPost.readTime}</span>
                    </div>
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
              </div>

              {/* Blog Grid Section */}
              <section>
                <div className="w-full">
                  <div className="space-y-6">
                    {currentPosts.map((post, index) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row sm:items-stretch">
                          {/* Post Image - Left Side */}
                          <div className="relative w-full sm:w-80 flex-shrink-0 bg-gray-200 overflow-hidden h-48 sm:h-auto sm:min-h-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Post Image</span>
                            </div>
                          </div>

                          {/* Post Content - Right Side */}
                          <div className="flex-1 p-6 space-y-4">
                            {/* Category */}
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                              style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                            >
                              {post.category}
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
                              {post.date}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              {/* Views */}
                              <div className="flex items-center gap-1">
                                <Eye size={14} />
                                <span>{post.views.toLocaleString()}</span>
                              </div>
                              
                              {/* Comments */}
                              <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                <span>{post.comments}</span>
                              </div>
                              
                              {/* Likes */}
                              <div className="flex items-center gap-1">
                                <Heart size={14} />
                                <span>{post.likes}</span>
                              </div>
                              
                              {/* Read Time */}
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{post.readTime}</span>
                              </div>
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
          </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-12 px-4">
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
              </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Right Column */}
            <aside className="lg:col-span-1">
              <div className="space-y-12">
                
                {/* Recent Posts */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Recent Posts
                  </h2>
                  
                  <div className="space-y-6">
                    {recentPosts.map((post, index) => (
                      <article
                        key={post.id}
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
          </article>
                    ))}
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
                    {tags.map((tag, index) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                    Categories
                  </h2>
                  
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={category.name}>
                        <Link
                          href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                          className="flex items-center justify-between py-2 hover:text-gray-600 transition-colors"
                        >
                          <span className="text-gray-900 font-medium">{category.name}</span>
                          <span className="text-gray-500 text-sm">({category.count})</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
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