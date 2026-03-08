'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

export function useNotificationsRealtime() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastNotifIdRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<number>(0);
  const isInitializedRef = useRef(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const STORAGE_KEY = 'notifications_lastId';
  const CACHE_KEY = 'notifications_cache';

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedLastId = localStorage.getItem(STORAGE_KEY);
    if (savedLastId) {
      lastNotifIdRef.current = savedLastId;
    }

    const cachedNotifs = localStorage.getItem(CACHE_KEY);
    if (cachedNotifs) {
      try {
        const parsed = JSON.parse(cachedNotifs);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
          parsed.forEach(n => seenIdsRef.current.add(n._id));
        }
      } catch (err) {
        console.error('Failed to restore cached notifications:', err);
      }
    }
  }, []);

  const fetchNotifications = useCallback(async (token: string) => {
    try {
      let url = `${API_URL}/notifications`;
      if (lastNotifIdRef.current) {
        url += `?lastNotificationId=${lastNotifIdRef.current}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.notifications && res.data.notifications.length > 0) {
        const newNotifs = res.data.notifications;

        // Filter out duplicates using Set
        const filteredNotifs = newNotifs.filter((notif: Notification) => {
          if (seenIdsRef.current.has(notif._id)) {
            console.log(`⏭️ Skipping duplicate notification: ${notif._id}`);
            return false;
          }
          seenIdsRef.current.add(notif._id);
          return true;
        });

        if (filteredNotifs.length > 0) {
          // Update last notif ID
          lastNotifIdRef.current = filteredNotifs[0]._id;
          localStorage.setItem(STORAGE_KEY, filteredNotifs[0]._id);

          // Show toast for new notifications
          filteredNotifs.forEach((notif: Notification) => {
            if (!notif.isRead) {
              console.log(`🔔 New notification: ${notif.title}`);
              toast.success(notif.title, { duration: 4000 });
            }
          });

          // Add to beginning of list and maintain size limit
          setNotifications(prev => {
            const updated = [...filteredNotifs, ...prev].slice(0, 50);
            // Cache updated notifications
            localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      }

      setUnreadCount(res.data.unreadCount);
      lastCheckRef.current = Date.now();
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, [API_URL]);

  // Initialize polling
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || isInitializedRef.current) return;

    isInitializedRef.current = true;

    // Fetch immediately
    fetchNotifications(token);

    // Poll every 10 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchNotifications(token);
    }, 10000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => {
        const updated = prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        );
        localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        return updated;
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark as read');
    }
  }, [API_URL]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      // Check if this is a payment-related notification
      const notif = notifications.find(n => n._id === notificationId);
      if (notif?.data?.isPaid) {
        const confirmed = window.confirm(
          'This notification is for a paid session/booking. Deleting it will trigger a refund. Continue?'
        );
        if (!confirmed) return;
      }

      await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      seenIdsRef.current.delete(notificationId);

      setNotifications(prev => {
        const updated = prev.filter(n => n._id !== notificationId);
        localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        return updated;
      });

      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('Failed to delete notification');
    }
  }, [API_URL, notifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
  };
}
