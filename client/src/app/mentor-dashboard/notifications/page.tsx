'use client';

import { Bell, Trash2, Archive, Check, AlertCircle, MessageSquare, Calendar, DollarSign, Award } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah Johnson has requested a mock interview session for Feb 10',
      timestamp: '2m ago',
      unread: true,
      icon: Calendar,
      color: 'bg-blue-500/20 border-blue-500/50',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹1,500 received from John Doe for CV Review',
      timestamp: '15m ago',
      unread: true,
      icon: DollarSign,
      color: 'bg-emerald-500/20 border-emerald-500/50',
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Emily Chen: "Can we reschedule to next week?"',
      timestamp: '1h ago',
      unread: true,
      icon: MessageSquare,
      color: 'bg-purple-500/20 border-purple-500/50',
    },
    {
      id: 4,
      type: 'review',
      title: 'Session Rated',
      message: 'Michael Brown gave your GD Practice session a 5-star rating',
      timestamp: '3h ago',
      unread: false,
      icon: Award,
      color: 'bg-yellow-500/20 border-yellow-500/50',
    },
    {
      id: 5,
      type: 'system',
      title: 'Session Reminder',
      message: 'Your session with Sarah Johnson starts in 30 minutes',
      timestamp: '30m ago',
      unread: false,
      icon: AlertCircle,
      color: 'bg-red-500/20 border-red-500/50',
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

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

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Total Notifications</p>
          <p className="text-3xl font-bold text-blue-400">{notifications.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">Unread</p>
          <p className="text-3xl font-bold text-red-400">{unreadCount}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-2">This Week</p>
          <p className="text-3xl font-bold text-emerald-400">12</p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`border rounded-2xl p-6 transition ${
                notification.unread
                  ? `${notification.color} border-opacity-100`
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  notification.unread
                    ? 'bg-blue-500/20'
                    : 'bg-zinc-800'
                }`}>
                  <Icon size={24} className={notification.unread ? 'text-white' : 'text-zinc-400'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className={`font-bold ${notification.unread ? 'text-white' : 'text-zinc-300'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">{notification.message}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{notification.timestamp}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {notification.unread && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                    title="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Preferences */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'New Bookings', enabled: true },
            { label: 'Payment Notifications', enabled: true },
            { label: 'Messages', enabled: true },
            { label: 'Session Reminders', enabled: true },
            { label: 'Rating Notifications', enabled: true },
            { label: 'System Updates', enabled: false },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                defaultChecked={pref.enabled}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-zinc-300">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
