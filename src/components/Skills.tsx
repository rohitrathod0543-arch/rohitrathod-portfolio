import React, { useState } from 'react';
import { Skill } from '../types';
import { getSkillIcon, CheckCircle2, Clock, Sparkles, Filter } from '../utils/icons';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories dynamically
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Skills & <span className="text-cyan-400">Expertise</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-3">
            Technologies and tools I have completed and actively learning. Managed dynamically via database.
          </p>
        </div>

        {/* Dynamic Category Filter */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl max-w-md mx-auto">
            <p className="text-slate-400 text-sm">No skills found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredSkills.map((skill) => {
              const isCompleted = skill.status === 'Completed';
              return (
                <div
                  key={skill.id}
                  className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-bl-full transition-colors pointer-events-none" />

                  <div>
                    {/* Header: Icon & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-slate-900/90 text-cyan-400 border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all">
                        {getSkillIcon(skill.name, skill.icon_name, 'w-6 h-6')}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          isCompleted
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                        )}
                        <span>{skill.status}</span>
                      </span>
                    </div>

                    {/* Skill Name & Category */}
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {skill.category}
                    </p>
                  </div>

                  {/* Proficiency Indicator */}
                  <div className="mt-5 pt-4 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="font-mono text-cyan-400 font-medium">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isCompleted
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            : 'bg-gradient-to-r from-amber-400 to-cyan-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(10, skill.proficiency))}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
