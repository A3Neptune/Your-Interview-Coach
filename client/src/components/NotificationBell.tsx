'use client';

import { useState } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotificationsRealtime } from '@/hooks/useNotificationsRealtime';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification } =
    useNotificationsRealtime();

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    // Mark all notifications as read
    for (const notif of notifications.filter(n => !n.isRead)) {
      await markAsRead(notif._id);
    }
    toast.success('All notifications marked as read');
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition rounded-lg"
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      >
        <Bell size={20} />
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-2xl z-50">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 transition font-medium"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded transition text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-slate-50 transition ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'gd-invite' && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      {notification.type === 'gd-user-accepted' && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                      {notification.type === 'gd-user-declined' && (
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                            {new Date(notification.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                              title="Mark as read"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="mt-2 flex gap-2">
                        {/* {notification.type === 'gd-invite' && (
                          <>
                            <a
                              href="/dashboard/gd-invitations"
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition font-medium"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {(notification.type === 'gd-user-accepted' ||
                          notification.type === 'gd-user-declined') && (
                          <a
                            href="/mentor-dashboard/gd-practice"
                            className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition"
                          >
                            View GDs
                          </a>
                        )} */}
                        {!notification.actionUrl &&
                          notification.type !== 'gd-invite' &&
                          notification.type !== 'gd-user-accepted' &&
                          notification.type !== 'gd-user-declined' && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition"
                            >
                              Dismiss
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
