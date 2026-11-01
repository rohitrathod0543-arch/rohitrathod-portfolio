import React, { useState } from 'react';
import { Profile } from '../types';
import { portfolioService } from '../services/supabase';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Sparkles,
} from '../utils/icons';

interface ResumeManagerProps {
  profile: Profile;
  onRefresh: () => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({ profile, onRefresh }) => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeName, setResumeName] = useState(profile.resume_name || 'Rohit_Rathod_Resume.pdf');
  const [savingName, setSavingName] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showNotification('error', 'Please select a valid PDF file.');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await portfolioService.uploadFile(file, 'resumes');
      await portfolioService.updateProfile({
        resume_url: uploadedUrl,
        resume_name: file.name,
      });
      setResumeName(file.name);
      showNotification('success', 'Resume PDF uploaded and published successfully!');
      onRefresh();
    } catch (err: any) {
      console.error('Resume upload failed:', err);
      showNotification('error', err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete the uploaded resume PDF?')) return;

    try {
      setUploading(true);
      await portfolioService.updateProfile({
        resume_url: null,
        resume_name: null,
      });
      showNotification('success', 'Resume removed successfully.');
      onRefresh();
    } catch (err: any) {
      console.error('Delete error:', err);
      showNotification('error', err.message || 'Failed to delete resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingName(true);
      await portfolioService.updateProfile({
        resume_name: resumeName.trim(),
      });
      showNotification('success', 'Resume display title updated.');
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update title.');
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Manage Resume</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Upload, preview, replace or remove your official curriculum vitae document.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Current Resume Status Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/20 max-w-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Status</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {profile.resume_url ? 'PDF Resume Active' : 'No PDF Uploaded'}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {profile.resume_name || 'No file registered'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : profile.resume_url ? 'Replace PDF' : 'Upload PDF'}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {profile.resume_url && (
              <>
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="View Current PDF"
                >
                  <Eye className="w-4 h-4" />
                </a>

                <button
                  onClick={handleDeleteResume}
                  disabled={uploading}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Update Resume Display Name */}
        {profile.resume_url && (
          <form onSubmit={handleUpdateName} className="pt-6 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Public Download File Name
              </label>
              <input
                type="text"
                required
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Rohit_Rathod_Resume.pdf"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={savingName}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer w-full sm:w-auto"
            >
              {savingName ? 'Updating...' : 'Save Title'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
