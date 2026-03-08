'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Clock, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'launch' | 'offer' | 'update';
  ctaText?: string;
  ctaLink?: string;
  icon: 'sparkles' | 'gift' | 'zap';
  showAt: number; // seconds after page load
  duration: number; // how long to show in ms
}

const LAUNCH_NOTIFICATIONS: ToastNotification[] = [
  {
    id: 'welcome-launch',
    title: '🎉 We\'re Live!',
    message: 'YourInterviewCoach is now officially launched! Get exclusive launch pricing today.',
    type: 'launch',
    ctaText: 'Claim Offer',
    ctaLink: '#pricing',
    icon: 'sparkles',
    showAt: 3,
    duration: 8000,
  },
  {
    id: 'limited-offer',
    title: '⚡ Limited Time Offer',
    message: 'Save up to 60% on all mentorship plans - Launch week special!',
    type: 'offer',
    ctaText: 'View Plans',
    ctaLink: '#pricing',
    icon: 'gift',
    showAt: 15,
    duration: 7000,
  },
  {
    id: 'new-features',
    title: '✨ New Features',
    message: 'Check out our company-specific prep, group discussions, and more!',
    type: 'update',
    ctaText: 'Explore',
    ctaLink: '#features',
    icon: 'zap',
    showAt: 30,
    duration: 6000,
  },
];

export default function LaunchNotificationToast() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed IDs from localStorage
    const dismissed = localStorage.getItem('dismissedLaunchNotifications');
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed));
    }

    // Schedule notifications
    const timers: NodeJS.Timeout[] = [];

    LAUNCH_NOTIFICATIONS.forEach((notification) => {
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('dismissedLaunchNotifications');
        const dismissedArray = dismissed ? JSON.parse(dismissed) : [];

        if (!dismissedArray.includes(notification.id)) {
          setNotifications((prev) => [...prev, notification]);

          // Auto-dismiss after duration
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }, notification.duration);
        }
      }, notification.showAt * 1000);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // Save to localStorage
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedLaunchNotifications', JSON.stringify(newDismissed));
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'gift':
        return <Gift className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto w-80 sm:w-96 bg-white border-2 border-blue-200 rounded-xl overflow-hidden animate-slide-in-right "
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Animated top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 animate-shimmer" />

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                {getIcon(notification.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {notification.title}
                  </h4>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-900 hover:bg-blue-50 rounded transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {notification.message}
                </p>

                {notification.ctaText && notification.ctaLink && (
                  <Link
                    href={notification.ctaLink}
                    onClick={() => dismissNotification(notification.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg transition-all duration-300"
                  >
                    {notification.ctaText}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-blue-50">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
              style={{
                animation: `shrink ${notification.duration}ms linear`,
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
