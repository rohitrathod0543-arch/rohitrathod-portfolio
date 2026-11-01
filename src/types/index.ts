export interface Profile {
  id: number;
  full_name: string;
  title: string;
  bio: string;
  about_details: string;
  interests: string;
  career_goals: string;
  email: string;
  github_url: string;
  languages: string;
  resume_url?: string | null;
  resume_name?: string | null;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  status: 'Completed' | 'Currently Learning' | 'In Progress';
  icon_name?: string;
  display_order: number;
  created_at?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year_range: string;
  status: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  live_url: string;
  github_url?: string | null;
  image_url?: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  ai_assisted: boolean;
  display_order: number;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuing_org: string;
  issue_date?: string | null;
  credential_id?: string | null;
  verification_url?: string | null;
  file_url?: string | null;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
