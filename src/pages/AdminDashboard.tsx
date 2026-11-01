import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile, Skill, Education, Project, Certificate, ContactMessage } from '../types';
import { portfolioService, isSupabaseConfigured } from '../services/supabase';
import { INITIAL_PROFILE } from '../services/initialData';
import { SkillsManager } from '../admin/SkillsManager';
import { ProjectsManager } from '../admin/ProjectsManager';
import { EducationManager } from '../admin/EducationManager';
import { CertificatesManager } from '../admin/CertificatesManager';
import { ResumeManager } from '../admin/ResumeManager';
import { MessagesManager } from '../admin/MessagesManager';
import { ProfileManager } from '../admin/ProfileManager';
import { SettingsManager } from '../admin/SettingsManager';
import {
  Layout,
  User,
  Code2,
  GraduationCap,
  Layers,
  Award,
  FileText,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  Database,
  ArrowUpRight,
} from '../utils/icons';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'skills'
  | 'education'
  | 'projects'
  | 'certificates'
  | 'resume'
  | 'messages'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [userEmail, setUserEmail] = useState<string>('rohitrathod0543@gmail.com');

  const isLive = isSupabaseConfigured();

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await portfolioService.getCurrentSession();
        if (!session) {
          navigate('/admin/login');
          return;
        }
        if (session.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (err) {
        navigate('/admin/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setRefreshing(true);
      const [profData, skillsData, eduData, projData, certData, msgData] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getSkills(),
        portfolioService.getEducation(),
        portfolioService.getProjects(false), // fetch all, including unpublished
        portfolioService.getCertificates(false), // fetch all
        portfolioService.getContactMessages(),
      ]);

      setProfile(profData);
      setSkills(skillsData);
      setEducation(eduData);
      setProjects(projData);
      setCertificates(certData);
      setMessages(msgData);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await portfolioService.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/admin/login');
    }
  };

  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <Layout className="w-4 h-4" /> },
    { id: 'profile', label: 'Manage Profile', icon: <User className="w-4 h-4" /> },
    { id: 'skills', label: 'Manage Skills', icon: <Code2 className="w-4 h-4" />, badge: skills.length },
    { id: 'education', label: 'Manage Education', icon: <GraduationCap className="w-4 h-4" />, badge: education.length },
    { id: 'projects', label: 'Manage Projects', icon: <Layers className="w-4 h-4" />, badge: projects.length },
    { id: 'certificates', label: 'Manage Certificates', icon: <Award className="w-4 h-4" />, badge: certificates.length },
    { id: 'resume', label: 'Manage Resume', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'messages',
      label: 'Contact Messages',
      icon: <Mail className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="font-mono text-xs text-cyan-400">Loading Secure Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#070b1a] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">Rohit's Admin</span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          {isSidebarOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#070b1a] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800/80 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">Rohit Rathod</h1>
              <p className="text-[11px] font-mono text-cyan-400">Admin Panel</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.id === 'messages' && unreadMessagesCount > 0
                          ? 'bg-rose-500 text-white font-bold'
                          : isActive
                          ? 'bg-cyan-500/30 text-cyan-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Logout Area */}
        <div className="p-4 border-t border-slate-800/80 bg-[#060915]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
              <p className="text-[11px] font-mono text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
              title="Open Public Portfolio"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 px-6 bg-[#070b1a]/50 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Admin / <strong className="text-white capitalize">{activeTab}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Database indicator */}
            {isLive ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Live
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Database className="w-3.5 h-3.5" /> Local Preview
              </span>
            )}

            <button
              onClick={loadAllData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <a
              href="#/"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>View Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Welcome back, {profile.full_name}!
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Here is a high-level summary of your developer portfolio records and activity.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Projects</span>
                    <Layers className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{projects.length}</p>
                  <p className="text-[11px] text-cyan-400 mt-1 font-mono">
                    {projects.filter((p) => p.is_published).length} Published
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('skills')}
                  className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Skills</span>
                    <Code2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{skills.length}</p>
                  <p className="text-[11px] text-cyan-400 mt-1 font-mono">
                    {skills.filter((s) => s.status === 'Completed').length} Completed
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('education')}
                  className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Education</span>
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{education.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Undergraduate + PUC</p>
                </div>

                <div
                  onClick={() => setActiveTab('certificates')}
                  className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Certificates</span>
                    <Award className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{certificates.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Active</p>
                </div>

                <div
                  onClick={() => setActiveTab('messages')}
                  className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-400/50 col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Messages</span>
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{messages.length}</p>
                  <p className={`text-[11px] mt-1 font-mono ${unreadMessagesCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                    {unreadMessagesCount} Unread
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Shortcuts */}
                <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Quick Management Actions</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="font-semibold text-white block">Add New Project</span>
                      <span className="text-slate-400 text-[11px]">Upload thumbnail & live URL</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="font-semibold text-white block">Add New Skill</span>
                      <span className="text-slate-400 text-[11px]">Update proficiency & status</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('resume')}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="font-semibold text-white block">Upload Resume PDF</span>
                      <span className="text-slate-400 text-[11px]">Manage CV download</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="font-semibold text-white block">Setup Instructions</span>
                      <span className="text-slate-400 text-[11px]">SQL schema & GitHub Pages</span>
                    </button>
                  </div>
                </div>

                {/* Recent Messages Preview */}
                <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span>Recent Inquiries</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        View all
                      </button>
                    </div>

                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No contact inquiries yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {messages.slice(0, 3).map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => setActiveTab('messages')}
                            className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="overflow-hidden">
                              <p className="font-semibold text-white truncate">{msg.name}</p>
                              <p className="text-slate-400 truncate">{msg.subject}</p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                    <span>Database Status</span>
                    <span className="font-mono text-cyan-400">{isLive ? 'Supabase Connected' : 'Local Preview'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileManager profile={profile} onRefresh={loadAllData} />
          )}

          {activeTab === 'skills' && (
            <SkillsManager skills={skills} onRefresh={loadAllData} />
          )}

          {activeTab === 'education' && (
            <EducationManager education={education} onRefresh={loadAllData} />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager projects={projects} onRefresh={loadAllData} />
          )}

          {activeTab === 'certificates' && (
            <CertificatesManager certificates={certificates} onRefresh={loadAllData} />
          )}

          {activeTab === 'resume' && (
            <ResumeManager profile={profile} onRefresh={loadAllData} />
          )}

          {activeTab === 'messages' && (
            <MessagesManager messages={messages} onRefresh={loadAllData} />
          )}

          {activeTab === 'settings' && (
            <SettingsManager />
          )}
        </div>
      </main>
    </div>
  );
};
