import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Github, Sparkles, Layers, ArrowUpRight } from '../utils/icons';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Live <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-3">
            Explorations in e-commerce, interactive gaming, hospitality, and dining websites.
            Developed with AI-assisted engineering and modern web technologies.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto">
            <p className="text-slate-400 text-sm">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border-cyan-500/15 group"
              >
                <div>
                  {/* Image Container with Overlay */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
                    <img
                      src={
                        project.image_url ||
                        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091024] via-transparent to-black/30" />

                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {project.category}
                      </span>
                    </div>

                    {/* AI-Assisted Attribution Badge */}
                    {project.ai_assisted && (
                      <div className="absolute top-4 right-4">
                        <span
                          title="This project was developed with AI assistance"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>AI-Assisted</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 sm:p-7 pt-0 mt-auto border-t border-slate-800/60 flex items-center justify-between gap-3 flex-wrap">
                  {/* Live Project Button */}
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Live Project</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>

                  {/* GitHub Button - ONLY shown when github_url exists */}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
