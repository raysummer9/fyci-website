'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Eye, Heart, MessageCircle, Tag } from 'lucide-react';
import { BlogPost } from '@/types';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import BlogComments from '@/components/BlogComments';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string, count: number}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string, slugs: string, count: number}[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const viewTrackedRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const likePollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate or retrieve guest ID for anonymous users
  const getGuestId = (): string => {
    if (typeof window === 'undefined') return '';
    let guestId = localStorage.getItem('blog_guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('blog_guest_id', guestId);
    }
    return guestId;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track view count increment
  useEffect(() => {
    if (!blog?.id || viewTrackedRef.current) return;

    const trackView = async () => {
      try {
        // Debounce: wait 2 seconds before tracking view
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(`/api/blogs/${slug}/views`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.views);
          viewTrackedRef.current = true;
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [blog?.id, slug]);

  // Poll for view count updates (works without Supabase Realtime)
  useEffect(() => {
    if (!slug) return;

    // Poll every 5 seconds for view count updates
    const pollViewCount = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}/views`);
        if (response.ok) {
          const data = await response.json();
          setViewCount(data.views);
          // Update blog state with new view count
          setBlog((prev) => prev ? { ...prev, views: data.views } : null);
        }
      } catch (error) {
        console.error('Error polling view count:', error);
      }
    };

    // Start polling
    pollingIntervalRef.current = setInterval(pollViewCount, 5000);

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [slug]);

  // Fetch initial like status and count
  useEffect(() => {
    if (!slug) return;

    const fetchLikeStatus = async () => {
      try {
        const guestId = getGuestId();
        const response = await fetch(`/api/blogs/${slug}/like?guest_id=${guestId}`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likes || 0);
          setIsLiked(data.is_liked || false);
          // Update blog state
          setBlog((prev) => prev ? { ...prev, likes: data.likes || 0 } : null);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [slug]);

  // Poll for like count updates
  useEffect(() => {
    if (!slug) return;

    const pollLikeCount = async () => {
      try {
        const guestId = getGuestId();
        const response = await fetch(`/api/blogs/${slug}/like?guest_id=${guestId}`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likes || 0);
          setIsLiked(data.is_liked || false);
          // Update blog state
          setBlog((prev) => prev ? { ...prev, likes: data.likes || 0 } : null);
        }
      } catch (error) {
        console.error('Error polling like count:', error);
      }
    };

    // Start polling every 5 seconds
    likePollingIntervalRef.current = setInterval(pollLikeCount, 5000);

    // Cleanup interval on unmount
    return () => {
      if (likePollingIntervalRef.current) {
        clearInterval(likePollingIntervalRef.current);
        likePollingIntervalRef.current = null;
      }
    };
  }, [slug]);

  // Handle like/unlike action
  const handleLike = async () => {
    if (isLiking || !slug) return;

    setIsLiking(true);
    try {
      const guestId = getGuestId();
      const response = await fetch(`/api/blogs/${slug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guest_id: guestId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes || 0);
        setIsLiked(data.is_liked || false);
        // Update blog state
        setBlog((prev) => prev ? { ...prev, likes: data.likes || 0 } : null);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Fetch initial view count
  useEffect(() => {
    if (!slug) return;

    const fetchViewCount = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}/views`);
        if (response.ok) {
          const data = await response.json();
          setViewCount(data.views);
        }
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViewCount();
  }, [slug]);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Fetch main blog post
        const response = await fetch(`/api/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
          setViewCount(data.views || 0);
          setLikeCount(data.likes || 0);
        } else if (response.status === 404) {
          setError('Blog post not found');
        } else {
          setError('Failed to load blog post');
        }

        // Fetch recent posts (excluding current post)
        const recentResponse = await fetch('/api/blogs?limit=5');
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          // Filter out current post
          const filteredRecent = recentData.filter((post: BlogPost) => post.slug !== slug).slice(0, 3);
          setRecentPosts(filteredRecent);
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

  const richTextClasses =
    'prose prose-lg prose-gray prose-enhanced max-w-none text-lg text-gray-700 leading-relaxed ' +
    'prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-3 ' +
    'prose-p:text-gray-700 prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold ' +
    'prose-ul:list-disc prose-ul:pl-5 prose-ul:mt-1 prose-ul:mb-3 prose-ol:list-decimal prose-ol:pl-5 prose-ol:mt-1 prose-ol:mb-3 ' +
    'prose-li:text-gray-700 prose-li:mb-0.5 prose-a:text-[#360e1d] prose-a:no-underline hover:prose-a:underline ' +
    'prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic';

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="pt-28 sm:pt-36 pb-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 space-y-6">
            {((blog.categories && blog.categories.length > 0) || blog.category) && (
              <div className="flex flex-wrap gap-2">
                {(blog.categories && blog.categories.length > 0) ? (
                  blog.categories.map((category) => (
                    <span 
                      key={category.id}
                      className="inline-flex items-center rounded-full bg-[#ebdfe4] px-4 py-1 text-sm font-medium text-[#360e1d]"
                    >
                      {category.name}
                    </span>
                  ))
                ) : blog.category ? (
                  <span className="inline-flex items-center rounded-full bg-[#ebdfe4] px-4 py-1 text-sm font-medium text-[#360e1d]">
                    {blog.category.name}
                  </span>
                ) : null}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0f2a20] leading-tight max-w-4xl">
              {blog.title}
            </h1>

            <div className="flex flex-wrap gap-6 sm:gap-8 text-sm sm:text-base text-gray-600">
              {blog.author && (
                <div>
                  <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Author</p>
                  <p className="font-medium text-gray-900">{blog.author.full_name}</p>
                </div>
              )}
              
              <div>
                <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Published</p>
                <p className="font-medium text-gray-900">{formatDate(blog.published_at || blog.created_at)}</p>
              </div>

              {blog.read_time && (
                <div>
                  <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Read Time</p>
                  <p className="font-medium text-gray-900">{blog.read_time} min</p>
                </div>
              )}

              <div>
                <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Views</p>
                <p className="font-medium text-gray-900">{(viewCount || blog.views || 0).toLocaleString()}</p>
              </div>
            </div>

          </div>
        </section>

        <section className="py-8">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8"
          >
            {blog.featured_image ? (
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full rounded-[32px]"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 rounded-[32px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">No image available</p>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {blog.excerpt && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <h2 className="text-3xl font-semibold text-[#0f2a20]">Overview</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{blog.excerpt}</p>
                </motion.div>
              )}

              {blog.content && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <div
                    className={richTextClasses}
                    dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                  />
                </motion.div>
              )}

              {blog.tags && blog.tags.length > 0 && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-2xl font-semibold text-[#0f2a20]">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Comments Section */}
              <motion.div variants={itemVariants}>
                <BlogComments blogSlug={slug} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0f2a20]">Share this post</h3>
                      <p className="text-gray-600 text-sm">Spread the word with your community.</p>
                    </div>
                    <ShareButtons
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${blog.slug}`}
                      title={blog.title}
                      description={blog.excerpt || ''}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-8 sticky top-8">
                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Recent Posts</h3>
                    <div className="space-y-6">
                      {recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-4">
                            {post.featured_image && (
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={post.featured_image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#360e1d] transition-colors line-clamp-2">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formatDate(post.published_at || post.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className="flex items-center justify-between py-2 hover:text-[#360e1d] transition-colors"
                        >
                          <span className="text-gray-700 font-medium">{category.name}</span>
                          <span className="text-gray-500 text-sm">({category.count})</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-xl font-semibold text-[#0f2a20] mb-6">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog/tag/${tag.slugs}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#360e1d] transition-colors"
                        >
                          <Tag size={12} />
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </aside>
          </div>
        </motion.section>
      </main>

      {/* Floating Like Button */}
      {blog && (
        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex flex-col items-center gap-1 px-5 py-4 rounded-full shadow-lg transition-all duration-200 ${
              isLiked
                ? 'bg-[#360e1d] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
          >
            <Heart 
              size={24} 
              className={isLiked ? 'fill-current' : ''}
            />
            <span className="text-xs font-medium">
              {(likeCount || blog.likes || 0).toLocaleString()}
            </span>
            {!isLiked && (
              <span className="text-[10px] font-medium text-gray-600 mt-0.5 whitespace-nowrap">
                Like this post
              </span>
            )}
          </button>
        </div>
      )}
      
      <Footer />
    </>
  );
}
