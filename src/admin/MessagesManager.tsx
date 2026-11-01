import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { portfolioService } from '../services/supabase';
import {
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Eye,
  Check,
} from '../utils/icons';

interface MessagesManagerProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({ messages, onRefresh }) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleRead = async (message: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await portfolioService.markMessageAsRead(message.id, !message.is_read);
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({ ...selectedMessage, is_read: !message.is_read });
      }
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update read status.');
    }
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await handleToggleRead(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await portfolioService.deleteContactMessage(id);
      showNotification('success', 'Message deleted.');
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Delete message error:', err);
      showNotification('error', err.message || 'Failed to delete message.');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Contact Submissions</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Confidential inquiries sent through the public contact form.
          </p>
        </div>
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

      {messages.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Inbox is clear</h3>
          <p className="text-xs text-slate-400 mt-1">
            When visitors send inquiries from the contact form, their messages will securely appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                msg.is_read
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-500/60 shadow-sm shadow-cyan-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 overflow-hidden">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    msg.is_read
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-white text-sm sm:text-base">{msg.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-cyan-300 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{msg.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleToggleRead(msg, e)}
                    className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(msg.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400">Contact Inquiry</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedMessage.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Sender Name:</span>
                    <span className="font-semibold text-white">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sender Email:</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-mono text-cyan-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block">Received At:</span>
                    <span className="text-slate-300 font-mono">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                  Message Content:
                </span>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => setDeletingId(selectedMessage.id)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border-rose-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Message?</h3>
            <p className="text-slate-300 text-sm mb-6">
              This message will be permanently deleted from the database.
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
    </div>
  );
};
