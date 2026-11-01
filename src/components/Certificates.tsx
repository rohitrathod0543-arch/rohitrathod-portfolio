import React from 'react';
import { Certificate } from '../types';
import { Award, ExternalLink, Download, FileText, Calendar, ShieldCheck } from '../utils/icons';

interface CertificatesProps {
  certificates: Certificate[];
}

export const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Certificates & <span className="text-cyan-400">Accomplishments</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-3">
            Accredited course completions, technical assessments, and professional credentials.
          </p>
        </div>

        {/* Dynamic List or Initial Empty State */}
        {certificates.length === 0 ? (
          <div className="max-w-xl mx-auto p-8 sm:p-12 text-center rounded-2xl glass-panel border border-cyan-500/20 shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5 text-cyan-400">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              No certificates added yet
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
              New certificates will appear here as I complete upcoming technical certifications and specialized course curriculums.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400/90">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verifiable records via Supabase database</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between border-cyan-500/15 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    {cert.issue_date && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{cert.issue_date}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-sm font-medium text-cyan-400 mb-3">
                    {cert.issuing_org}
                  </p>

                  {cert.credential_id && (
                    <p className="text-xs font-mono text-slate-500 mb-4">
                      ID: {cert.credential_id}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View / Download</span>
                    </a>
                  )}

                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
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
