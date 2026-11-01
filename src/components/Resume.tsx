import React from 'react';
import { Profile } from '../types';
import { FileText, Download, Eye, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from '../utils/icons';

interface ResumeProps {
  profile: Profile;
}

export const Resume: React.FC<ResumeProps> = ({ profile }) => {
  const hasResume = Boolean(profile.resume_url);

  return (
    <section id="resume" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Professional <span className="text-cyan-400">Resume</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-3">
            View or download my technical resume outlining education, technical proficiencies, and web development projects.
          </p>
        </div>

        {/* Resume Action & Preview Card */}
        <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-10 rounded-2xl border-cyan-500/20 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 mb-2">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Resume Document</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {profile.full_name} — CV
                </h3>
                <p className="text-sm text-cyan-400 font-medium mt-0.5">
                  {profile.title}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {profile.resume_name || 'Rohit_Rathod_Resume.pdf'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {hasResume ? (
                <>
                  <a
                    href={profile.resume_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Resume</span>
                  </a>

                  <a
                    href={profile.resume_url!}
                    download={profile.resume_name || 'Rohit_Rathod_Resume.pdf'}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Resume</span>
                  </a>
                </>
              ) : (
                <div className="text-center md:text-right p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-amber-300 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="font-medium">No PDF Uploaded Yet</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    You can upload the official PDF resume from the Admin Dashboard (#/admin).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Structured Resume Summary View */}
          <div className="mt-8 pt-8 border-t border-slate-800/80">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
              Quick Profile Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Education</span>
                <span className="font-semibold text-white">B.Sc. Computer Science</span>
                <span className="text-xs text-cyan-400 block mt-0.5">2nd Year (2025–2028)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Core Tech</span>
                <span className="font-semibold text-white">HTML5, CSS3, JS, Bootstrap</span>
                <span className="text-xs text-cyan-400 block mt-0.5">Responsive Web Development</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Contact</span>
                <span className="font-semibold text-white truncate block" title={profile.email}>
                  {profile.email}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">Bidar, Karnataka</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
