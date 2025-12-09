'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, User, Clock, Eye, MessageCircle, Heart, Search, Tag, ArrowLeft } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types';

export default function BlogCategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<{id: string, name: string, slug: string} | null>(null);
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
    window.scrollTo(0, 0);
  }, [categorySlug, currentPage]);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);

        // Fetch category info
        const categoriesResponse = await fetch('/api/blogs/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
          const foundCategory = categoriesData.find((cat: {slug: string}) => cat.slug === categorySlug);
          if (foundCategory) {
            setCategory(foundCategory);
          }
        }

        // Fetch recent posts
        const recentResponse = await fetch('/api/blogs?limit=3');
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentPosts(recentData.slice(0, 3));
        }

        // Fetch tags
        const tagsResponse = await fetch('/api/blogs/tags');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }

        // Fetch all blog posts for this category
        const allPostsResponse = await fetch(`/api/blogs?category=${categorySlug}&limit=100`);
        if (allPostsResponse.ok) {
          const allPostsData = await allPostsResponse.json();
          setBlogPosts(allPostsData);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchBlogData();
    }
  }, [categorySlug]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter blog posts based on search term
  const filteredBlogPosts = blogPosts.filter(post => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(searchLower);
    const excerptMatch = post.excerpt?.toLowerCase().includes(searchLower);
    const authorMatch = post.author?.full_name?.toLowerCase().includes(searchLower);
    const categoryMatch = post.categories?.some(cat => 
      cat.name.toLowerCase().includes(searchLower) || 
      cat.slug.toLowerCase().includes(searchLower)
    ) || post.category?.name.toLowerCase().includes(searchLower) ||
       post.category?.slug.toLowerCase().includes(searchLower);
    const tagMatch = post.tags?.some(tag => 
      tag.name.toLowerCase().includes(searchLower) || 
      tag.slugs.toLowerCase().includes(searchLower)
    );
    
    return titleMatch || excerptMatch || authorMatch || categoryMatch || tagMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredBlogPosts.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link href="/blog" className="text-[#360e1d] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[#360e1d] hover:text-[#4a1a2a] mb-4 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Blog</span>
                </Link>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0f2a20] mb-2">
                  {category.name}
                </h1>
                <p className="text-gray-600">
                  {filteredBlogPosts.length} {filteredBlogPosts.length === 1 ? 'post' : 'posts'} in this category
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts in this category..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#360e1d] focus:border-transparent"
                    style={{ '--tw-ring-color': '#360e1d' } as React.CSSProperties}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Posts List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {paginatedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 'No posts found matching your search.' : 'No posts found in this category.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-[#360e1d] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  paginatedPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      variants={itemVariants}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="flex flex-col md:flex-row">
                          {post.featured_image && (
                            <div className="md:w-1/3 h-48 md:h-auto">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`flex-1 p-6 ${post.featured_image ? '' : 'md:p-8'}`}>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categories && post.categories.length > 0 ? (
                                post.categories.map((category) => (
                                  <span
                                    key={category.id}
                                    className="inline-flex items-center rounded-full bg-[#ebdfe4] px-4 py-1 text-sm font-medium text-[#360e1d]"
                                  >
                                    {category.name}
                                  </span>
                                ))
                              ) : post.category ? (
                                <span
                                  className="inline-flex items-center rounded-full bg-[#ebdfe4] px-4 py-1 text-sm font-medium text-[#360e1d]"
                                >
                                  {post.category.name}
                                </span>
                              ) : null}
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-[#360e1d] transition-colors">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              {post.author && (
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  <span>{post.author.full_name}</span>
                                </div>
                              )}
                              {post.published_at && (
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span>{formatDate(post.published_at)}</span>
                                </div>
                              )}
                              {post.read_time && (
                                <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  <span>{post.read_time} min read</span>
                                </div>
                              )}
                              {!post.hide_counts && post.views !== undefined && (
                                <div className="flex items-center gap-2">
                                  <Eye size={16} />
                                  <span>{post.views}</span>
                                </div>
                              )}
                              {!post.hide_counts && post.likes !== undefined && (
                                <div className="flex items-center gap-2">
                                  <Heart size={16} />
                                  <span>{post.likes}</span>
                                </div>
                              )}
                              {!post.hide_counts && post.comments_count !== undefined && post.comments_count > 0 && (
                                <div className="flex items-center gap-2">
                                  <MessageCircle size={16} />
                                  <span>{post.comments_count}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))
                )}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex justify-center items-center gap-2"
                >
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-md border ${
                        currentPage === page
                          ? 'bg-[#360e1d] text-white border-[#360e1d]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    →
                  </button>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-80 space-y-6"
            >
              {/* Recent Posts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    ))
                  ) : (
                    recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#360e1d] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        {post.published_at && (
                          <p className="text-xs text-gray-500">
                            {formatDate(post.published_at)}
                          </p>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Categories</h3>
                <div className="space-y-2">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id}>
                        <Link
                          href={`/blog/category/${cat.slug}`}
                          className={`flex items-center justify-between py-2 transition-colors ${
                            cat.slug === categorySlug
                              ? 'text-[#360e1d] font-semibold'
                              : 'text-gray-700 hover:text-[#360e1d]'
                          }`}
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-sm text-gray-500">({cat.count})</span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      ))
                    ) : (
                      tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog/tag/${tag.slugs}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#360e1d] transition-colors"
                        >
                          <Tag size={12} />
                          {tag.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
}

