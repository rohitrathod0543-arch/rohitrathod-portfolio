import React, { useState } from 'react';
import { Education } from '../types';
import { portfolioService } from '../services/supabase';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  GraduationCap,
  Calendar,
  Building2,
} from '../utils/icons';

interface EducationManagerProps {
  education: Education[];
  onRefresh: () => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({ education, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [yearRange, setYearRange] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingEdu(null);
    setDegree('');
    setInstitution('');
    setYearRange('2025–2028');
    setStatus('Currently pursuing');
    setDescription('');
    setDisplayOrder(education.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setDegree(edu.degree);
    setInstitution(edu.institution);
    setYearRange(edu.year_range);
    setStatus(edu.status);
    setDescription(edu.description || '');
    setDisplayOrder(edu.display_order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim() || !yearRange.trim()) {
      showNotification('error', 'Degree, institution, and year range are required.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        degree: degree.trim(),
        institution: institution.trim(),
        year_range: yearRange.trim(),
        status: status.trim(),
        description: description.trim(),
        display_order: Number(displayOrder),
      };

      if (editingEdu) {
        await portfolioService.updateEducation(editingEdu.id, payload);
        showNotification('success', `Education entry "${degree}" updated.`);
      } else {
        await portfolioService.createEducation(payload);
        showNotification('success', `Education entry "${degree}" created.`);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving education:', err);
      showNotification('error', err.message || 'Failed to save education entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await portfolioService.deleteEducation(id);
      showNotification('success', 'Education entry deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting education:', err);
      showNotification('error', err.message || 'Failed to delete education entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Manage Education</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
              {education.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your academic credentials, college, passing years, and descriptions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
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

      {/* Cards list */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
                  {edu.status}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {edu.year_range}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
              <p className="text-xs sm:text-sm text-cyan-400/90 font-medium">{edu.institution}</p>
              {edu.description && (
                <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">{edu.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-xs text-slate-500 font-mono mr-2">#{edu.display_order}</span>
              <button
                onClick={() => openEditModal(edu)}
                className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit Education"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingId(edu.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Delete Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border-rose-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Education Entry?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to delete this qualification?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Education Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingEdu ? 'Edit Education' : 'Add Education'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Degree / Program *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Sc. Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Institution / College *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government First Grade College, Noubad, Bidar"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Year Range *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025–2028 or Completed in 2025"
                    value={yearRange}
                    onChange={(e) => setYearRange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Status *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Currently pursuing — 2nd Year"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Description / Focus Areas
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about syllabus, subjects, or academic highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-colors font-bold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingEdu ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
