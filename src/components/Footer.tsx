import React from 'react';
import { Code2, Github, Mail, Shield, ArrowUp } from '../utils/icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#04060f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">Rohit Rathod</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Aspiring Full-Stack Web Developer & B.Sc. Computer Science student passionate about crafting clean, responsive, and purposeful digital experiences.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/rohitrathod0543-arch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:rohitrathod0543@gmail.com"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="Email Rohit"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#/admin"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="Private Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#skills" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Skills & Tech
                </a>
              </li>
              <li>
                <a href="#education" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Education
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Live Projects
                </a>
              </li>
              <li>
                <a href="#certificates" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Certificates
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#resume" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Resume & CV
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Contact Form
                </a>
              </li>
              <li>
                <a href="#/admin" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Admin Dashboard</span>
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 pt-2 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rohit Rathod. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-cyan-400/80">Bidar, Karnataka, India</span>
            <span>•</span>
            <a href="#/admin" className="hover:text-slate-400 transition-colors">
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
