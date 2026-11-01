import React, { useState } from 'react';
import { isSupabaseConfigured } from '../services/supabase';
import {
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Terminal,
  Globe,
} from '../utils/icons';

export const SettingsManager: React.FC = () => {
  const isLive = isSupabaseConfigured();
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSample = `# .env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_BASE_PATH="/rohitrathodportfolio/"`;

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Website Settings & Deployment</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Backend database integration status, Supabase authentication, and GitHub Pages deployment instructions.
        </p>
      </div>

      {/* Database Connection Status Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Database Engine</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Supabase PostgreSQL</h3>
            </div>
          </div>

          <div>
            {isLive ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supabase Live Connected</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Local Preview Mode Active</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            {isLive
              ? 'Your application is connected directly to your live Supabase cloud database. All skills, projects, education entries, certificates, contact messages, and resume files are stored securely in PostgreSQL and Supabase Storage.'
              : 'Supabase credentials are not detected in your local .env file. The application is running in dynamic Local Preview Mode with initial seed data. You can test all CRUD operations, modals, and updates right here! When you are ready to connect your own Supabase project, follow the simple 3-step setup below.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span className="truncate">VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not Set'}</span>
            <span className="text-slate-500 shrink-0 ml-2">Client Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Not Set'}</span>
          </div>
        </div>
      </div>

      {/* Supabase 3-Step Setup Guide */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/20 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>How to Connect Your Free Supabase Project</span>
        </h3>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Create a free Supabase Project</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">supabase.com</a>, create a new project, and copy your <strong className="text-slate-200">Project URL</strong> and <strong className="text-slate-200">anon/public API key</strong> from Project Settings &gt; API.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-semibold text-white">Run the SQL Schema Script</p>
              <p className="text-xs text-slate-400 mt-0.5">
                In your Supabase dashboard, click <strong className="text-slate-200">SQL Editor</strong>, open the file <strong className="text-cyan-300 font-mono">/supabase/schema.sql</strong> provided in this repository, paste the contents, and click <strong className="text-slate-200">Run</strong>. This will create all tables, RLS policies, and insert Rohit's seed data!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Create Your Admin Account in Supabase Auth</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Go to <strong className="text-slate-200">Authentication &gt; Users &gt; Add User</strong> with email <span className="font-mono text-cyan-300">rohitrathod0543@gmail.com</span> and your desired password. Then run:
              </p>
              <div className="mt-2 p-3 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-cyan-300">
                INSERT INTO public.admin_users (id, email) VALUES ('USER_UUID_FROM_SUPABASE', 'rohitrathod0543@gmail.com');
              </div>
            </div>
          </div>
        </div>

        {/* Copy Env Template */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Sample .env Configuration
            </span>
            <button
              onClick={() => copyToClipboard(envSample, 'env')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono cursor-pointer"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied' : 'Copy .env'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-black/70 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
            {envSample}
          </pre>
        </div>
      </div>

      {/* GitHub Pages Deployment Guide */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/20 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>Publishing to GitHub Pages</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This portfolio is pre-configured with <strong className="text-white">HashRouter</strong> and Vite base path <strong className="text-cyan-400 font-mono">/rohitrathodportfolio/</strong> so refreshing sub-routes or admin URLs will never produce 404 errors on GitHub Pages.
        </p>
        <div className="space-y-2 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
            git remote add origin https://github.com/rohitrathod0543-arch/rohitrathodportfolio.git
          </div>
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
            npm run build
          </div>
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
            npx gh-pages -d dist
          </div>
        </div>
      </div>
    </div>
  );
};
