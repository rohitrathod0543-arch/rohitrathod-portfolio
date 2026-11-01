import React from 'react';
import { Education as EducationType } from '../types';
import { GraduationCap, Calendar, Award, Building2 } from '../utils/icons';

interface EducationProps {
  education: EducationType[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Education & <span className="text-cyan-400">Qualifications</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-3">
            Academic qualifications building a strong foundation in computer science and logical reasoning.
          </p>
        </div>

        {/* Education Timeline Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((item, index) => {
            const isCurrent = item.status.toLowerCase().includes('pursuing') || item.status.toLowerCase().includes('current');
            return (
              <div
                key={item.id}
                className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Accent glow bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isCurrent ? 'bg-gradient-to-b from-cyan-400 to-blue-500' : 'bg-slate-700'
                  }`}
                />

                <div className="flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        isCurrent
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.status}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.year_range}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {item.degree}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-cyan-400/90 font-medium mb-3">
                    <Building2 className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>{item.institution}</span>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right Badge / Year Box */}
                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Academic Period</span>
                  <span className="text-base font-mono font-semibold text-white mt-1">
                    {item.year_range}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
