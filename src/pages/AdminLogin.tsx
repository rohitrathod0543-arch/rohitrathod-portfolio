import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioService, isSupabaseConfigured } from '../services/supabase';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2, Database, Key } from '../utils/icons';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rohitrathod0543@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLive = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await portfolioService.signIn(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid credentials or access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Back to website button */}
      <div className="w-full max-w-md mb-6">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rohit Rathod's Portfolio</span>
        </a>
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border-cyan-500/20 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-lg shadow-cyan-500/10">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Private management dashboard for Rohit Rathod
          </p>
        </div>

        {/* Database Status Pill */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-mono">Backend Engine:</span>
          </div>
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Supabase Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono text-[11px]" title="Demo preview mode active">
              Local Preview Mode
            </span>
          )}
        </div>

        {!isLive && (
          <div className="mb-6 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Demo Access Information:
            </p>
            <p className="text-slate-400">
              Email: <span className="text-white font-mono">rohitrathod0543@gmail.com</span>
            </p>
            <p className="text-slate-400">
              Password: <span className="text-cyan-300 font-mono">admin123</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              (When Supabase is connected in .env, your real Supabase Auth credentials apply).
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohitrathod0543@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Protected route • Authorized access only
        </p>
      </div>
    </div>
  );
};
