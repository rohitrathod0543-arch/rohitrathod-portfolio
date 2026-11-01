import React from 'react';
import { Profile } from '../types';
import { Terminal, BookOpen, Compass, Target, Code2, Globe } from '../utils/icons';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Behind The Code</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-3">
            An overview of my academic background, current learning trajectory, and passion for web technologies.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Story Card */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between border-cyan-500/15">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Current Learning Journey</h3>
                  <p className="text-xs text-slate-400">Undergraduate Degree & Continuous Practice</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  {profile.about_details ||
                    'I am currently pursuing my 2nd Year of B.Sc. Computer Science at Government First Grade College, Noubad, Bidar. My journey in web engineering centers on mastering foundational core technologies, creating clean interactive user interfaces, and evolving into a well-rounded full-stack developer.'}
                </p>
                <p className="text-slate-400 text-sm">
                  I believe in learning by constructing practical projects. From building frontends using semantic HTML5, modern CSS3 layout systems (Flexbox & CSS Grid), and Bootstrap components, to implementing dynamic state logic in JavaScript, each project helps me solidify software development best practices.
                </p>
              </div>
            </div>

            {/* Quick Highlights */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400">Languages Known</p>
                <p className="text-sm font-semibold text-white mt-1">{profile.languages}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Institution</p>
                <p className="text-sm font-semibold text-white mt-1 truncate" title="GFGC, Noubad, Bidar">
                  GFGC Noubad, Bidar
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-sm font-semibold text-cyan-400 mt-1">2nd Year Student</p>
              </div>
            </div>
          </div>

          {/* Side Cards: Interests & Career Goals */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Interests Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl flex-1 border-cyan-500/15">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Interests & Curiosity</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {profile.interests}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Responsive Design', 'Modern JavaScript', 'Database Architecture', 'Clean Code', 'Web APIs'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-md bg-purple-950/40 border border-purple-500/20 text-purple-300 font-mono"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Career Goals Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl flex-1 border-cyan-500/15">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Career Vision</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {profile.career_goals}
              </p>
              <div className="p-3 rounded-xl bg-[#060a19] border border-blue-500/20 text-xs text-cyan-300/90 font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dedicated to continuous growth and building real-world software.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
