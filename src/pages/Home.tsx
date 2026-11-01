import React, { useState, useEffect } from 'react';
import { Profile, Skill, Education, Project, Certificate } from '../types';
import { portfolioService } from '../services/supabase';
import { INITIAL_PROFILE } from '../services/initialData';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Education as EducationSection } from '../components/Education';
import { Projects } from '../components/Projects';
import { Certificates } from '../components/Certificates';
import { Resume } from '../components/Resume';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [profData, skillsData, eduData, projData, certData] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getSkills(),
        portfolioService.getEducation(),
        portfolioService.getProjects(true), // only published
        portfolioService.getCertificates(true), // only published
      ]);

      setProfile(profData);
      setSkills(skillsData);
      setEducation(eduData);
      setProjects(projData);
      setCertificates(certData);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
            <div className="w-12 h-12 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
            <p className="font-mono text-sm text-cyan-400">Loading Rohit Rathod's Portfolio...</p>
          </div>
        ) : (
          <>
            <Hero profile={profile} />
            <About profile={profile} />
            <Skills skills={skills} />
            <EducationSection education={education} />
            <Projects projects={projects} />
            <Certificates certificates={certificates} />
            <Resume profile={profile} />
            <Contact profile={profile} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
