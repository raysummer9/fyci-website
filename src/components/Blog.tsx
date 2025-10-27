'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blogs?limit=3');
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data);
        } else {
          console.error('Failed to fetch blog posts');
          // Fallback to static data if API fails
          setBlogPosts([
            {
              id: '1',
              title: 'The Power of Creative Expression in Youth Development',
              slug: 'creative-expression-youth-development',
              excerpt: 'Exploring how artistic expression helps young people build confidence, develop critical thinking skills, and find their unique voice in today\'s world.',
              published_at: '2024-01-15T00:00:00Z',
              created_at: '2024-01-15T00:00:00Z',
              status: 'published',
              featured: false,
              views: 1240,
              likes: 156,
              read_time: 5,
              category: { id: '1', name: 'Youth Development', slug: 'youth-development' },
              author: { id: '1', full_name: 'Sarah Johnson', email: 'sarah@example.com' },
              tags: []
            },
            {
              id: '2',
              title: 'Building Inclusive Communities Through Art',
              slug: 'building-inclusive-communities-art',
              excerpt: 'How creative programs bring together young people from diverse backgrounds to collaborate, learn, and create meaningful change in their communities.',
              published_at: '2024-01-08T00:00:00Z',
              created_at: '2024-01-08T00:00:00Z',
              status: 'published',
              featured: false,
              views: 980,
              likes: 134,
              read_time: 6,
              category: { id: '2', name: 'Community Impact', slug: 'community-impact' },
              author: { id: '2', full_name: 'Michael Chen', email: 'michael@example.com' },
              tags: []
            },
            {
              id: '3',
              title: 'Digital Innovation in Creative Education',
              slug: 'digital-innovation-creative-education',
              excerpt: 'The role of technology in expanding access to creative education and empowering young people to explore new forms of artistic expression.',
              published_at: '2023-12-28T00:00:00Z',
              created_at: '2023-12-28T00:00:00Z',
              status: 'published',
              featured: false,
              views: 1567,
              likes: 189,
              read_time: 7,
              category: { id: '3', name: 'Innovation', slug: 'innovation' },
              author: { id: '3', full_name: 'Aisha Patel', email: 'aisha@example.com' },
              tags: []
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to static data
        setBlogPosts([
          {
            id: '1',
            title: 'The Power of Creative Expression in Youth Development',
            slug: 'creative-expression-youth-development',
            excerpt: 'Exploring how artistic expression helps young people build confidence, develop critical thinking skills, and find their unique voice in today\'s world.',
            published_at: '2024-01-15T00:00:00Z',
            created_at: '2024-01-15T00:00:00Z',
            status: 'published',
            featured: false,
            views: 1240,
            likes: 156,
            read_time: 5,
            category: { id: '1', name: 'Youth Development', slug: 'youth-development' },
            author: { id: '1', full_name: 'Sarah Johnson', email: 'sarah@example.com' },
            tags: []
          },
          {
            id: '2',
            title: 'Building Inclusive Communities Through Art',
            slug: 'building-inclusive-communities-art',
            excerpt: 'How creative programs bring together young people from diverse backgrounds to collaborate, learn, and create meaningful change in their communities.',
            published_at: '2024-01-08T00:00:00Z',
            created_at: '2024-01-08T00:00:00Z',
            status: 'published',
            featured: false,
            views: 980,
            likes: 134,
            read_time: 6,
            category: { id: '2', name: 'Community Impact', slug: 'community-impact' },
            author: { id: '2', full_name: 'Michael Chen', email: 'michael@example.com' },
            tags: []
          },
          {
            id: '3',
            title: 'Digital Innovation in Creative Education',
            slug: 'digital-innovation-creative-education',
            excerpt: 'The role of technology in expanding access to creative education and empowering young people to explore new forms of artistic expression.',
            published_at: '2023-12-28T00:00:00Z',
            created_at: '2023-12-28T00:00:00Z',
            status: 'published',
            featured: false,
            views: 1567,
            likes: 189,
            read_time: 7,
            category: { id: '3', name: 'Innovation', slug: 'innovation' },
            author: { id: '3', full_name: 'Aisha Patel', email: 'aisha@example.com' },
            tags: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

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
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            style={{ color: '#360e1d' }}
          >
            Latest Blog Posts
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-2xl sm:text-3xl lg:text-4xl max-w-5xl mx-auto"
            style={{ color: '#4a1a2a' }}
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200/30 shadow-sm animate-pulse overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : (
              blogPosts.map((post, index) => (
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
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}>
                        {post.category?.name || 'Blog'}
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
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={16} />
                          <span>{post.author.full_name}</span>
                        </div>
                      )}
                      {post.read_time && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{post.read_time} min read</span>
                        </div>
                      )}
                    </div>
                    
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all duration-200 cursor-pointer"
                    >
                      Read more
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.article>
              ))
            )}
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
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: '#360e1d' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#4a1a2a'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#360e1d'}
          >
            Visit Our Blog
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
