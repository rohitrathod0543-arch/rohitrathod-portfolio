-- ========================================================================
-- ROHIT RATHOD PORTFOLIO - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ========================================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- It creates all required tables, Row Level Security (RLS) policies,
-- storage buckets, and seeds initial data for Rohit Rathod's portfolio.
-- ========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE (Explicit authorization for administrative access)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users who are already in admin_users can view admin list
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ------------------------------------------------------------------------
-- 2. PROFILE TABLE (Personal info, bio, contact links, resume)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id INT PRIMARY KEY DEFAULT 1,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  about_details TEXT,
  interests TEXT,
  career_goals TEXT,
  email TEXT NOT NULL,
  github_url TEXT NOT NULL,
  languages TEXT NOT NULL,
  resume_url TEXT,
  resume_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_profile_row CHECK (id = 1)
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profile read access"
  ON public.profile
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin profile update access"
  ON public.profile
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 3. SKILLS TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Frontend',
  proficiency INT NOT NULL DEFAULT 80,
  status TEXT NOT NULL DEFAULT 'Completed',
  icon_name TEXT DEFAULT 'Code',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skills"
  ON public.skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON public.skills
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 4. EDUCATION TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year_range TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view education"
  ON public.education
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage education"
  ON public.education
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 5. PROJECTS TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  live_url TEXT NOT NULL,
  github_url TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  ai_assisted BOOLEAN DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can only view published projects
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (is_published = true);

-- Admins can view and manage all projects (published & unpublished)
CREATE POLICY "Admins can manage projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 6. CERTIFICATES TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuing_org TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  verification_url TEXT,
  file_url TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published certificates"
  ON public.certificates
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage certificates"
  ON public.certificates
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 7. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit messages only
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(message) >= 5
  );

-- Only authenticated admins can read or manage contact messages
CREATE POLICY "Only admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Only admins can update/delete contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid()));

-- ------------------------------------------------------------------------
-- 8. STORAGE BUCKET CONFIGURATION (portfolio-assets)
-- ------------------------------------------------------------------------
-- Run to create the bucket for project thumbnails, certificate files, and resumes:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can read files
CREATE POLICY "Public Read portfolio-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-assets');

-- Storage RLS: Only authenticated admins can upload/update/delete files
CREATE POLICY "Admin Upload portfolio-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-assets' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admin Update portfolio-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-assets' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admin Delete portfolio-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-assets' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

-- ========================================================================
-- 9. INITIAL SEED DATA FOR ROHIT RATHOD
-- ========================================================================

-- Seed Profile
INSERT INTO public.profile (
  id,
  full_name,
  title,
  bio,
  about_details,
  interests,
  career_goals,
  email,
  github_url,
  languages,
  resume_url,
  resume_name
) VALUES (
  1,
  'Rohit Rathod',
  'Aspiring Full-Stack Web Developer',
  'I am a B.Sc. Computer Science student passionate about web development, modern technologies and creating responsive digital experiences. I enjoy learning new technologies and building practical projects.',
  'I am currently in my 2nd Year of B.Sc. Computer Science at Government First Grade College, Noubad, Bidar. My journey in software development began with curiosity about how the web works, leading me to delve deeply into modern frontend engineering, responsive UI design, and scalable backend services.',
  'Full-Stack Web Development, Responsive Web Design, Component Architecture, Database Design, Modern Web APIs, and UI/UX Optimization.',
  'To continuously expand my engineering expertise across both frontend and backend technologies, contribute to impactful open-source and real-world projects, and grow into a skilled full-stack software engineer.',
  'rohitrathod0543@gmail.com',
  'https://github.com/rohitrathod0543-arch',
  'Hindi, Kannada, and English (basic English)',
  NULL,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Seed Initial Skills
INSERT INTO public.skills (name, category, proficiency, status, icon_name, display_order)
VALUES
  ('HTML5', 'Frontend', 95, 'Completed', 'FileCode2', 1),
  ('CSS3', 'Frontend', 90, 'Completed', 'Palette', 2),
  ('Bootstrap', 'Framework', 85, 'Completed', 'Layout', 3),
  ('JavaScript', 'Programming Language', 75, 'Currently Learning', 'Code2', 4)
ON CONFLICT DO NOTHING;

-- Seed Initial Education (excluding 10th standard as requested)
INSERT INTO public.education (degree, institution, year_range, status, description, display_order)
VALUES
  (
    'B.Sc. Computer Science',
    'Government First Grade College, Noubad, Bidar',
    '2025–2028',
    'Currently pursuing — 2nd Year',
    'Focusing on computer science fundamentals, data structures, algorithm design, database management systems, and programming principles.',
    1
  ),
  (
    '2nd PUC Science',
    'Pre-University Board',
    'Completed in 2025',
    'Completed in 2025',
    'Completed with core focus on physics, chemistry, and mathematics with analytical problem-solving foundation.',
    2
  )
ON CONFLICT DO NOTHING;

-- Seed Initial 4 Projects (with transparent AI-assisted attribution)
INSERT INTO public.projects (
  title,
  category,
  description,
  live_url,
  github_url,
  image_url,
  tags,
  is_featured,
  is_published,
  ai_assisted,
  display_order
) VALUES
  (
    'US FOREVER',
    'Fashion / E-commerce Website',
    'A sleek, modern e-commerce storefront for trendsetting apparel. Features intuitive product browsing, responsive category grids, dynamic cart simulation, and clean UI styling.',
    'https://rohitrathod0543-arch.github.io/usforever/',
    NULL,
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    ARRAY['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'E-Commerce'],
    true,
    true,
    true,
    1
  ),
  (
    'RR Games',
    'Gaming Website',
    'An interactive web gaming hub featuring browser-based mini-games, dynamic score keeping, responsive mobile controls, and engaging arcade-inspired visual presentation.',
    'https://rohitrathod0543-arch.github.io/game-s/',
    NULL,
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    ARRAY['HTML5 Canvas', 'JavaScript', 'CSS3', 'Game Design'],
    true,
    true,
    true,
    2
  ),
  (
    'INSPIRA Hotel',
    'Hotel / Resort Website',
    'A luxury hospitality and resort showcase platform featuring elegant room previews, amenity highlights, interactive dining previews, and a seamless booking inquiry flow.',
    'https://inspira-stay-flow.base44.app',
    NULL,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Modern UI', 'Responsive Design', 'Hospitality', 'Web Design'],
    true,
    true,
    true,
    3
  ),
  (
    'Moonlight Cafe & Restro',
    'Restaurant Website',
    'An inviting restaurant website crafted for a warm culinary experience. Highlights include interactive food & drink menus, chef specials, table reservations, and contact directions.',
    'https://moonlight-dine-spot.base44.app',
    NULL,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Restaurant UI', 'Modern Layout', 'JavaScript', 'Responsive'],
    true,
    true,
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Helper instruction for adding your user as admin:
-- Once you sign up or create a user in Supabase Auth (Authentication > Users),
-- copy their User UID and execute:
-- INSERT INTO public.admin_users (id, email) VALUES ('PASTE_USER_UUID_HERE', 'rohitrathod0543@gmail.com');
