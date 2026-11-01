import React, { useState } from 'react';
import { Certificate } from '../types';
import { portfolioService } from '../services/supabase';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Award,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
} from '../utils/icons';

interface CertificatesManagerProps {
  certificates: Certificate[];
  onRefresh: () => void;
}

export const CertificatesManager: React.FC<CertificatesManagerProps> = ({
  certificates,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingCert(null);
    setTitle('');
    setIssuingOrg('');
    setIssueDate('');
    setCredentialId('');
    setVerificationUrl('');
    setFileUrl('');
    setIsPublished(true);
    setDisplayOrder(certificates.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuingOrg(cert.issuing_org);
    setIssueDate(cert.issue_date || '');
    setCredentialId(cert.credential_id || '');
    setVerificationUrl(cert.verification_url || '');
    setFileUrl(cert.file_url || '');
    setIsPublished(cert.is_published);
    setDisplayOrder(cert.display_order);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const uploadedUrl = await portfolioService.uploadFile(file, 'certificates');
      setFileUrl(uploadedUrl);
      showNotification('success', 'Certificate document uploaded successfully.');
    } catch (err: any) {
      console.error('File upload failed:', err);
      showNotification('error', err.message || 'File upload failed.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuingOrg.trim()) {
      showNotification('error', 'Title and issuing organization are required.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        issuing_org: issuingOrg.trim(),
        issue_date: issueDate.trim() || null,
        credential_id: credentialId.trim() || null,
        verification_url: verificationUrl.trim() || null,
        file_url: fileUrl.trim() || null,
        is_published: isPublished,
        display_order: Number(displayOrder),
      };

      if (editingCert) {
        await portfolioService.updateCertificate(editingCert.id, payload);
        showNotification('success', `Certificate "${title}" updated.`);
      } else {
        await portfolioService.createCertificate(payload);
        showNotification('success', `Certificate "${title}" added.`);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving certificate:', err);
      showNotification('error', err.message || 'Failed to save certificate.');
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (cert: Certificate) => {
    try {
      await portfolioService.updateCertificate(cert.id, {
        is_published: !cert.is_published,
      });
      showNotification('success', `Certificate status updated.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update certificate visibility.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await portfolioService.deleteCertificate(id);
      showNotification('success', 'Certificate deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting certificate:', err);
      showNotification('error', err.message || 'Failed to delete certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Manage Certificates</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono">
              {certificates.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add verifiable certificates, upload credentials or PDFs, and manage verification links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
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

      {certificates.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <Award className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No certificates registered yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            The public portfolio currently displays the professional empty state. Click below to add your first certificate.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20"
          >
            Add Your First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                cert.is_published
                  ? 'bg-slate-900/70 border-slate-800'
                  : 'bg-slate-950/40 border-amber-900/30 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-medium">
                    {cert.issuing_org}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{cert.display_order}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{cert.title}</h3>

                {cert.issue_date && (
                  <p className="text-xs text-slate-400 mb-1">Date: {cert.issue_date}</p>
                )}
                {cert.credential_id && (
                  <p className="text-xs font-mono text-slate-500 mb-3">ID: {cert.credential_id}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => togglePublish(cert)}
                  className={`flex items-center gap-1 font-medium ${
                    cert.is_published ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {cert.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{cert.is_published ? 'Published' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Certificate"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border-rose-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Certificate?</h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to remove this certificate?
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

      {/* Add / Edit Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Responsive Web Design Certification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. freeCodeCamp / Coursera"
                    value={issuingOrg}
                    onChange={(e) => setIssuingOrg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CERT-8942-FCC"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Verification URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              {/* Upload Certificate File / PDF / Image */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Certificate Document / PDF
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="File URL or upload from device"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingFile ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingFile}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                    id="certPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="certPublished" className="text-xs text-slate-300 cursor-pointer">
                    Publish on Portfolio
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
                  disabled={loading || uploadingFile}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-colors font-bold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
