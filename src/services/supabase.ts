import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, Skill, Education, Project, Certificate, ContactMessage } from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_PROJECTS,
  INITIAL_CERTIFICATES,
} from './initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('...')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Local storage fallback keys for offline/demo/preview testing
const STORAGE_KEYS = {
  PROFILE: 'rr_portfolio_profile',
  SKILLS: 'rr_portfolio_skills',
  EDUCATION: 'rr_portfolio_education',
  PROJECTS: 'rr_portfolio_projects',
  CERTIFICATES: 'rr_portfolio_certificates',
  MESSAGES: 'rr_portfolio_messages',
  DEMO_AUTH: 'rr_portfolio_demo_auth',
};

// Initialize local storage with default seed data if not present
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

// -------------------------------------------------------------------------
// REPOSITORY LAYER (Supabase with Local Fallback)
// -------------------------------------------------------------------------

export const portfolioService = {
  // Check if live Supabase backend is active
  isConfigured: isSupabaseConfigured,

  // PROFILE
  async getProfile(): Promise<Profile> {
    if (supabase) {
      const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
      if (error) {
        console.warn('Supabase profile fetch error, using initial profile:', error.message);
        return INITIAL_PROFILE;
      }
      return data as Profile;
    }
    return getLocalData<Profile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (supabase) {
      const { data, error } = await supabase
        .from('profile')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Profile;
    }
    const current = getLocalData<Profile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocalData(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw new Error(error.message);
      return data as Skill[];
    }
    const skills = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    return skills.sort((a, b) => a.display_order - b.display_order);
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    if (supabase) {
      const { data, error } = await supabase.from('skills').insert([skill]).select().single();
      if (error) throw new Error(error.message);
      return data as Skill;
    }
    const skills = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    const newSkill: Skill = {
      ...skill,
      id: 'skill-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    skills.push(newSkill);
    setLocalData(STORAGE_KEYS.SKILLS, skills);
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (supabase) {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Skill;
    }
    const skills = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Skill not found');
    skills[index] = { ...skills[index], ...updates };
    setLocalData(STORAGE_KEYS.SKILLS, skills);
    return skills[index];
  },

  async deleteSkill(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const skills = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    const filtered = skills.filter((s) => s.id !== id);
    setLocalData(STORAGE_KEYS.SKILLS, filtered);
  },

  // EDUCATION
  async getEducation(): Promise<Education[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw new Error(error.message);
      return data as Education[];
    }
    const edus = getLocalData<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
    return edus.sort((a, b) => a.display_order - b.display_order);
  },

  async createEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    if (supabase) {
      const { data, error } = await supabase.from('education').insert([edu]).select().single();
      if (error) throw new Error(error.message);
      return data as Education;
    }
    const edus = getLocalData<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
    const newEdu: Education = {
      ...edu,
      id: 'edu-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    edus.push(newEdu);
    setLocalData(STORAGE_KEYS.EDUCATION, edus);
    return newEdu;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    if (supabase) {
      const { data, error } = await supabase
        .from('education')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Education;
    }
    const edus = getLocalData<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
    const index = edus.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Education entry not found');
    edus[index] = { ...edus[index], ...updates };
    setLocalData(STORAGE_KEYS.EDUCATION, edus);
    return edus[index];
  },

  async deleteEducation(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const edus = getLocalData<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
    const filtered = edus.filter((e) => e.id !== id);
    setLocalData(STORAGE_KEYS.EDUCATION, filtered);
  },

  // PROJECTS
  async getProjects(onlyPublished = true): Promise<Project[]> {
    if (supabase) {
      let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Project[];
    }
    const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const filtered = onlyPublished ? projects.filter((p) => p.is_published) : projects;
    return filtered.sort((a, b) => a.display_order - b.display_order);
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    if (supabase) {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (error) throw new Error(error.message);
      return data as Project;
    }
    const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    projects.push(newProj);
    setLocalData(STORAGE_KEYS.PROJECTS, projects);
    return newProj;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Project;
    }
    const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    projects[index] = { ...projects[index], ...updates };
    setLocalData(STORAGE_KEYS.PROJECTS, projects);
    return projects[index];
  },

  async deleteProject(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const filtered = projects.filter((p) => p.id !== id);
    setLocalData(STORAGE_KEYS.PROJECTS, filtered);
  },

  // CERTIFICATES
  async getCertificates(onlyPublished = true): Promise<Certificate[]> {
    if (supabase) {
      let query = supabase.from('certificates').select('*').order('display_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Certificate[];
    }
    const certs = getLocalData<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const filtered = onlyPublished ? certs.filter((c) => c.is_published) : certs;
    return filtered.sort((a, b) => a.display_order - b.display_order);
  },

  async createCertificate(cert: Omit<Certificate, 'id'>): Promise<Certificate> {
    if (supabase) {
      const { data, error } = await supabase.from('certificates').insert([cert]).select().single();
      if (error) throw new Error(error.message);
      return data as Certificate;
    }
    const certs = getLocalData<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const newCert: Certificate = {
      ...cert,
      id: 'cert-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    certs.push(newCert);
    setLocalData(STORAGE_KEYS.CERTIFICATES, certs);
    return newCert;
  },

  async updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
    if (supabase) {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Certificate;
    }
    const certs = getLocalData<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const index = certs.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Certificate not found');
    certs[index] = { ...certs[index], ...updates };
    setLocalData(STORAGE_KEYS.CERTIFICATES, certs);
    return certs[index];
  },

  async deleteCertificate(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const certs = getLocalData<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const filtered = certs.filter((c) => c.id !== id);
    setLocalData(STORAGE_KEYS.CERTIFICATES, filtered);
  },

  // CONTACT MESSAGES
  async submitContactMessage(message: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('contact_messages').insert([message]);
      if (error) throw new Error(error.message);
      return;
    }
    const messages = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const newMsg: ContactMessage = {
      ...message,
      id: 'msg-' + Date.now(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    messages.unshift(newMsg);
    setLocalData(STORAGE_KEYS.MESSAGES, messages);
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as ContactMessage[];
    }
    return getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  },

  async markMessageAsRead(id: string, is_read: boolean): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read })
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const messages = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages[index].is_read = is_read;
      setLocalData(STORAGE_KEYS.MESSAGES, messages);
    }
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const messages = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const filtered = messages.filter((m) => m.id !== id);
    setLocalData(STORAGE_KEYS.MESSAGES, filtered);
  },

  // FILE UPLOADS (Storage bucket 'portfolio-assets')
  async uploadFile(file: File, folder: 'images' | 'certificates' | 'resumes'): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
      return data.publicUrl;
    }

    // In local demo / offline mode, convert to Data URL or temporary Object URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // AUTHENTICATION
  async signIn(email: string, password: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return data;
    }

    // Demo/Development fallback authorization
    if (email === 'rohitrathod0543@gmail.com' && password === 'admin123') {
      const session = {
        user: {
          id: 'demo-admin-id',
          email: 'rohitrathod0543@gmail.com',
          user_metadata: { name: 'Rohit Rathod (Admin)' },
        },
      };
      localStorage.setItem(STORAGE_KEYS.DEMO_AUTH, JSON.stringify(session));
      return { session, user: session.user };
    }
    throw new Error('Invalid email or password. (Demo preview password is "admin123")');
  },

  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH);
  },

  async getCurrentSession() {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
    const item = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH);
    return item ? JSON.parse(item) : null;
  },

  async onAuthStateChange(callback: (session: any) => void) {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
      return () => subscription.unsubscribe();
    }
    // Poll or check localStorage
    const handleStorage = () => {
      const item = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH);
      callback(item ? JSON.parse(item) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  },
};
