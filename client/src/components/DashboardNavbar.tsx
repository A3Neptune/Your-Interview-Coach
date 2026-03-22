'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, Calendar, BookOpen, User, Settings, LogOut } from 'lucide-react';
import { getAuthToken, removeAuthToken } from '@/lib/api';
import NotificationBell from './NotificationBell';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Content', href: '/dashboard/content', icon: BookOpen },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b border-black/5"
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-lg">YourInterviewCoach</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Notifications */}
              <NotificationBell />

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t-2 border-blue-200">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <hr className="my-2 border-blue-200" />

              <Link
                href="/dashboard/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-slate-600 hover:bg-blue-50 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
