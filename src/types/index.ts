/**
 * Common types used throughout the application
 */

export interface NavLink {
  href: string;
  label: string;
}

export interface Feature {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  year?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  duration?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  linkText: string;
  linkHref: string;
  titleColor: string;
  programmeArea: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  link: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}