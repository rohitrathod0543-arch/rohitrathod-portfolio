import React, { useState } from 'react';
import { Project } from '../types';
import { portfolioService } from '../services/supabase';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Github,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
} from '../utils/icons';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fashion / E-commerce Website');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [aiAssisted, setAiAssisted] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Web Application');
    setDescription('');
    setLiveUrl('');
    setGithubUrl('');
    setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    setTagsInput('HTML5, CSS3, JavaScript, Responsive');
    setIsFeatured(false);
    setIsPublished(true);
    setAiAssisted(true);
    setDisplayOrder(projects.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setDescription(proj.description);
    setLiveUrl(proj.live_url);
    setGithubUrl(proj.github_url || '');
    setImageUrl(proj.image_url || '');
    setTagsInput((proj.tags || []).join(', '));
    setIsFeatured(proj.is_featured);
    setIsPublished(proj.is_published);
    setAiAssisted(proj.ai_assisted);
    setDisplayOrder(proj.display_order);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadedUrl = await portfolioService.uploadFile(file, 'images');
      setImageUrl(uploadedUrl);
      showNotification('success', 'Project thumbnail uploaded.');
    } catch (err: any) {
      console.error('Upload failed:', err);
      showNotification('error', err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !liveUrl.trim()) {
      showNotification('error', 'Title and Live URL are required.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      setLoading(true);
      const projectPayload = {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        live_url: liveUrl.trim(),
        github_url: githubUrl.trim() || null,
        image_url: imageUrl.trim() || null,
        tags: tagsArray,
        is_featured: isFeatured,
        is_published: isPublished,
        ai_assisted: aiAssisted,
        display_order: Number(displayOrder),
      };

      if (editingProject) {
        await portfolioService.updateProject(editingProject.id, projectPayload);
        showNotification('success', `Project "${title}" updated.`);
      } else {
        await portfolioService.createProject(projectPayload);
        showNotification('success', `Project "${title}" created.`);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving project:', err);
      showNotification('error', err.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      await portfolioService.updateProject(project.id, {
        is_published: !project.is_published,
      });
      showNotification('success', `Project "${project.title}" ${!project.is_published ? 'published' : 'unpublished'}.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await portfolioService.deleteProject(id);
      showNotification('success', 'Project deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting project:', err);
      showNotification('error', err.message || 'Failed to delete project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Manage Projects</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
              {projects.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add live projects, upload screenshots, configure tech tags, and control visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Notifications */}
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

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
              proj.is_published
                ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/50 border-amber-900/30 opacity-75'
            }`}
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-[21/9] w-full bg-slate-950 overflow-hidden">
                <img
                  src={proj.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/70 backdrop-blur-sm text-cyan-300 border border-cyan-500/30">
                    {proj.category}
                  </span>
                  {!proj.is_published && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-950/90 text-amber-300 border border-amber-500/40">
                      Draft (Hidden)
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <span className="text-xs text-slate-500 font-mono">Order: #{proj.display_order}</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 mb-3">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(proj.tags || []).map((tag, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* URLs */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => togglePublish(proj)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  proj.is_published
                    ? 'text-emerald-400 hover:bg-emerald-950/40'
                    : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                {proj.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{proj.is_published ? 'Published' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(proj)}
                  className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(proj.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete Project"
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to remove this project? It will be deleted from your public portfolio.
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US FOREVER"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fashion / E-commerce Website"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a concise description of the application and its features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Live Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/rohitrathod0543-arch/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Project Image / Screenshot
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload file below"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Technologies / Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="HTML5, CSS3, JavaScript, Responsive Design"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="isPublished" className="text-xs text-slate-300 cursor-pointer">
                    Publish on Website
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="aiAssisted"
                    checked={aiAssisted}
                    onChange={(e) => setAiAssisted(e.target.checked)}
                    className="w-4 h-4 rounded accent-purple-400 cursor-pointer"
                  />
                  <label htmlFor="aiAssisted" className="text-xs text-slate-300 cursor-pointer flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI-Assisted</span>
                  </label>
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
                  disabled={loading || uploadingImage}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-colors font-bold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
