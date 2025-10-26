'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Clock, MapPin, Share2, Facebook, Twitter, Instagram, Youtube, Users, ExternalLink, Video } from 'lucide-react';
import { Event } from '@/types';
import Footer from '@/components/Footer';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/events/${resolvedParams.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Event not found');
          } else {
            setError('Failed to load event');
          }
          return;
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming Event';
      case 'ongoing':
        return 'Event in Progress';
      case 'completed':
        return 'Event Completed';
      case 'cancelled':
        return 'Event Cancelled';
      default:
        return status;
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#360e1d' }}>
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#360e1d' }}>
        <div className="text-center text-gray-900">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/programme-areas" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Programme Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 sm:pt-20 pb-6 sm:pb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link 
              href="/programme-areas" 
              className="inline-flex items-center gap-2 text-gray-900/80 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Programme Areas
            </Link>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-gray-900 ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
            </div>

            {/* Programme Area Badge */}
            {event.programme_areas && (
              <div className="mb-4">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
                  style={{ backgroundColor: '#e6e1e3', color: '#360e1d' }}
                >
                  {event.programme_areas.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6 max-w-4xl">
              {event.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-900/80 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="text-sm">Created {formatDate(event.created_at)}</span>
              </div>
              {event.profiles?.full_name && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="text-sm">By {event.profiles.full_name}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured Image and Content Side by Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Featured Image */}
            {event.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-1"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={event.featured_image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {/* Content */}
            <motion.div variants={itemVariants} className="order-2 lg:order-2">
              {/* Event Details */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {event.description}
                  </p>
                  
                  {/* Event Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {event.start_date && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Calendar size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Start Date</p>
                          <p className="text-gray-900 font-semibold">{formatDateTime(event.start_date)}</p>
                        </div>
                      </div>
                    )}
                    {event.end_date && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Clock size={20} className="text-red-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">End Date</p>
                          <p className="text-gray-900 font-semibold">{formatDateTime(event.end_date)}</p>
                        </div>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <MapPin size={20} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Location</p>
                          <p className="text-gray-900 font-semibold">{event.location}</p>
                        </div>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <MapPin size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Venue</p>
                          <p className="text-gray-900 font-semibold">{event.venue}</p>
                        </div>
                      </div>
                    )}
                    {event.max_attendees && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <Users size={20} className="text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Max Attendees</p>
                          <p className="text-gray-900 font-semibold">{event.max_attendees} people</p>
                        </div>
                      </div>
                    )}
                    {event.is_online && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Video size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Event Type</p>
                          <p className="text-gray-900 font-semibold">Online Event</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink size={18} />
                        Register Now
                      </a>
                    )}
                    {event.meeting_url && (
                      <a
                        href={event.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Video size={18} />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Content */}
              {event.content && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Event Information</h3>
                    <div 
                      className="prose prose-lg prose-gray prose-enhanced max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:list-none prose-ol:list-none"
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  </div>
                </div>
              )}

              {/* Programme Area Details */}
              {event.programme_areas && (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Programme Area</h3>
                    <div className="flex items-start gap-4">
                      {event.programme_areas.icon && (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{event.programme_areas.icon}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-2">{event.programme_areas.name}</h4>
                        {event.programme_areas.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {event.programme_areas.description}
                          </p>
                        )}
                        <Link 
                          href={`/programme-areas/${event.programme_areas.slug}`}
                          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mt-3"
                        >
                          Learn more about this area
                          <ArrowLeft size={16} className="rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Event</h3>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Facebook size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Twitter size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Instagram size={20} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                      <Youtube size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
