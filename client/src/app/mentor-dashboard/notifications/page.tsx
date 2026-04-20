'use client';

import { useEffect, useState } from 'react';
import { Bell, Trash2, Check, AlertCircle, MessageSquare, Calendar, DollarSign, Award, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  booking:  { icon: Calendar,      color: 'bg-blue-500/20 border-blue-500/40' },
  payment:  { icon: DollarSign,    color: 'bg-emerald-500/20 border-emerald-500/40' },
  message:  { icon: MessageSquare, color: 'bg-purple-500/20 border-purple-500/40' },
  review:   { icon: Award,         color: 'bg-yellow-500/20 border-yellow-500/40' },
  system:   { icon: AlertCircle,   color: 'bg-red-500/20 border-red-500/40' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(res.data.notifications || res.data || []);
    } catch {
      // silently degrade — don't block the UI
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
    } catch { toast.error('Failed to mark as read'); }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(n => n.filter(x => x._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markAsRead(n._id)));
    toast.success('All marked as read');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const thisWeek = notifications.filter(n => {
    return Date.now() - new Date(n.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-zinc-400 mt-2">Stay updated with important events</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Total</p>
          <p className="text-3xl font-bold text-blue-400">{notifications.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Unread</p>
          <p className="text-3xl font-bold text-red-400">{unreadCount}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">This Week</p>
          <p className="text-3xl font-bold text-emerald-400">{thisWeek}</p>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-semibold">No notifications yet</p>
          <p className="text-zinc-600 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.system;
            const Icon = cfg.icon;
            return (
              <div
                key={n._id}
                className={`border rounded-2xl p-5 transition ${
                  !n.isRead ? `${cfg.color}` : 'bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${!n.isRead ? 'bg-white/10' : 'bg-zinc-800'}`}>
                    <Icon size={20} className={!n.isRead ? 'text-white' : 'text-zinc-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${!n.isRead ? 'text-white' : 'text-zinc-300'}`}>
                        {n.title}
                        {!n.isRead && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-blue-400 align-middle" />}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400">{n.message}</p>
                    <p className="text-xs text-zinc-600 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.isRead && (
                      <button onClick={() => markAsRead(n._id)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition" title="Mark as read">
                        <Check size={16} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
