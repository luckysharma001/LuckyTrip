import React from 'react';
import { X, Bell, Check, Clock, ExternalLink, Trash2, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (url: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onClearAll,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Travel Alerts & Notifications</h3>
              <p className="text-[11px] text-slate-500">Live booking updates, refunds & reminders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{notifications.length} Total Alerts</span>
            <button
              onClick={onClearAll}
              className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
              <p className="font-semibold text-sm text-slate-700">No Notifications Yet</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Booking receipts, seat assignments, and refund tracking notices will appear here automatically.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) onMarkRead(n.id);
                  if (n.actionUrl) {
                    onNavigate(n.actionUrl);
                    onClose();
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-sky-50/70 border-sky-200 hover:border-sky-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>}
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{n.message}</p>
                {n.actionUrl && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-700">
                    <span>View Journey Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
