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
  type: 'programme' | 'competition' | 'event';
  endDate?: string;
}

export interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured_image?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  programme_areas?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CompetitionFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file' | 'number' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface CompetitionApplicationForm {
  enabled: boolean;
  fields: CompetitionFormField[];
  submitButtonText?: string;
  successMessage?: string;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured_image?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  rules?: string;
  prizes?: string;
  featured: boolean;
  application_form?: CompetitionApplicationForm;
  created_at: string;
  updated_at: string;
  programme_areas?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CompetitionApplication {
  id: string;
  competition_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  form_data: Record<string, any>;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured_image?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  venue?: string;
  is_online?: boolean;
  meeting_url?: string;
  registration_url?: string;
  max_attendees?: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  programme_areas?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
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

export interface PublicationCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  cover_image?: string;
  file_url?: string;
  status: string;
  published_at?: string;
  created_at: string;
  publication_categories?: PublicationCategory;
  profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  status: string;
  featured: boolean;
  views: number;
  likes: number;
  read_time?: number;
  published_at?: string;
  created_at: string;
  comments_count?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    full_name?: string;
    email?: string;
  };
  tags?: {
    id: string;
    name: string;
    slugs: string;
  }[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}