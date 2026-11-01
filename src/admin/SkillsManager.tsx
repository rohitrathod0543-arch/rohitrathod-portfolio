import React, { useState } from 'react';
import { Skill } from '../types';
import { portfolioService } from '../services/supabase';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Clock,
  Sparkles,
  getSkillIcon,
} from '../utils/icons';

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState(80);
  const [status, setStatus] = useState<'Completed' | 'Currently Learning' | 'In Progress'>('Completed');
  const [iconName, setIconName] = useState('FileCode2');
  const [displayOrder, setDisplayOrder] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    setName('');
    setCategory('Frontend');
    setProficiency(80);
    setStatus('Completed');
    setIconName('FileCode2');
    setDisplayOrder(skills.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setStatus(skill.status);
    setIconName(skill.icon_name || 'FileCode2');
    setDisplayOrder(skill.display_order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('error', 'Skill name is required.');
      return;
    }

    try {
      setLoading(true);
      if (editingSkill) {
        await portfolioService.updateSkill(editingSkill.id, {
          name: name.trim(),
          category: category.trim(),
          proficiency: Number(proficiency),
          status,
          icon_name: iconName,
          display_order: Number(displayOrder),
        });
        showNotification('success', `Skill "${name}" updated successfully.`);
      } else {
        await portfolioService.createSkill({
          name: name.trim(),
          category: category.trim(),
          proficiency: Number(proficiency),
          status,
          icon_name: iconName,
          display_order: Number(displayOrder),
        });
        showNotification('success', `New skill "${name}" created successfully.`);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving skill:', err);
      showNotification('error', err.message || 'Failed to save skill.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await portfolioService.deleteSkill(id);
      showNotification('success', 'Skill deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      showNotification('error', err.message || 'Failed to delete skill.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Manage Skills</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
              {skills.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, update, or remove technical skills displayed on your public portfolio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Notification Toast */}
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

      {/* Skills Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {getSkillIcon(skill.name, skill.icon_name, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{skill.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{skill.category}</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    skill.status === 'Completed'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {skill.status}
                </span>
              </div>

              {/* Progress */}
              <div className="my-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Proficiency</span>
                  <span className="text-cyan-400 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2 text-xs">
              <span className="text-slate-500 font-mono">Order: #{skill.display_order}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Skill"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(skill.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Skill?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to delete this skill? It will be removed immediately from your public portfolio.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript, HTML5, React, Python"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Frontend, Framework, Tool"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Learning Status
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Currently Learning">Currently Learning</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono uppercase tracking-wider">Proficiency Level</span>
                  <span className="text-cyan-400 font-mono font-bold">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Icon Name (Lucide)
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="FileCode2">FileCode2 (HTML/Code)</option>
                    <option value="Palette">Palette (CSS/Design)</option>
                    <option value="Layout">Layout (Bootstrap/Grid)</option>
                    <option value="Code2">Code2 (JavaScript/Script)</option>
                    <option value="Database">Database (SQL/PostgreSQL)</option>
                    <option value="Server">Server (Backend)</option>
                    <option value="Cpu">Cpu (React/Frameworks)</option>
                    <option value="Globe">Globe (Web/APIs)</option>
                  </select>
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
                  {loading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
