import React from 'react';
import { Profile } from '../types';
import { ArrowUpRight, Download, Mail, Sparkles, Terminal, Code2, Globe } from '../utils/icons';

interface HeroProps {
  profile: Profile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-sm shadow-sm shadow-cyan-500/10 animate-in fade-in zoom-in-95 duration-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Open to Opportunities & Collaborations</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Bidar, Karnataka</span>
          </div>

          {/* Main Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Hi, I'm{' '}
            <span className="relative inline-block bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              {profile.full_name}
            </span>
          </h1>

          {/* Professional Title */}
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 mb-6 tracking-tight flex items-center justify-center gap-2 flex-wrap">
            <span className="text-cyan-400 font-semibold">{profile.title}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400 text-lg sm:text-xl font-normal">B.Sc. Computer Science</span>
          </p>

          {/* Introduction */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 text-center font-normal">
            {profile.bio}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-black shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>View My Projects</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#resume"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Download className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Download Resume</span>
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Contact Me</span>
            </a>
          </div>

          {/* High-tech feature cards below hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-16 w-full max-w-3xl">
            <div className="p-3.5 rounded-xl bg-[#091024]/70 border border-cyan-500/10 text-left">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Education</p>
              <p className="text-sm font-semibold text-white mt-1">B.Sc. 2nd Year</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#091024]/70 border border-cyan-500/10 text-left">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Core Focus</p>
              <p className="text-sm font-semibold text-white mt-1">Full-Stack Web</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#091024]/70 border border-cyan-500/10 text-left">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Projects</p>
              <p className="text-sm font-semibold text-white mt-1">4 Live Portfolios</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#091024]/70 border border-cyan-500/10 text-left">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Location</p>
              <p className="text-sm font-semibold text-white mt-1">Bidar, Karnataka</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
