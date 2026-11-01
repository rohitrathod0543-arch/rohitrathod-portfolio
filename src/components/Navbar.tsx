import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight, Code2 } from '../utils/icons';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070b1a]/85 backdrop-blur-md border-b border-cyan-500/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            className="group flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-sm shadow-cyan-500/10">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                Rohit Rathod
              </span>
              <span className="hidden sm:block text-[11px] font-mono text-cyan-400/80 -mt-1 tracking-wide">
                Full-Stack Developer
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-lg transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-all duration-200 hover:border-cyan-400 hover:shadow-sm hover:shadow-cyan-500/20"
            >
              Get In Touch
            </a>
            <a
              href="#/admin"
              title="Admin Portal"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
            >
              <Shield className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="#/admin"
              className="p-2 text-slate-400 hover:text-cyan-300"
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 p-4 bg-[#0a1024] border border-cyan-500/20 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-800 flex flex-col gap-2">
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 rounded-xl"
                >
                  Get In Touch
                </a>
                <a
                  href="#/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Admin Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
