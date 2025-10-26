'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Eye, Heart, MessageCircle, Facebook, Twitter, Linkedin, Copy, Tag, Instagram, Youtube } from 'lucide-react';
import { BlogPost } from '@/types';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string, count: number}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string, slugs: string, count: number}[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Fetch main blog post
        const response = await fetch(`/api/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else if (response.status === 404) {
          setError('Blog post not found');
        } else {
          setError('Failed to load blog post');
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
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          // You could add a toast notification here
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#360e1d' }}>Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#360e1d' }}
          >
            View All Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {/* Featured Image - Full Width */}
          {blog.featured_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-contain rounded-lg shadow-lg bg-gray-50"
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2">
              {/* Title and Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-12"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: '#360e1d' }}>
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
                  {blog.category && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                        {blog.category.name}
                      </span>
                    </div>
                  )}
                  
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>By {blog.author.full_name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(blog.published_at || blog.created_at)}</span>
                  </div>

                  {blog.read_time && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{blog.read_time} min read</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{blog.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>{blog.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>{blog.comments_count || 0} comments</span>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                dangerouslySetInnerHTML={{ __html: blog.content || '' }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-12 pt-8 border-t border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Tag size={14} />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Share this post</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ color: '#360e1d' }}
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ color: '#360e1d' }}
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ color: '#360e1d' }}
                  >
                    <Linkedin size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{ color: '#360e1d' }}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </motion.div>
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
