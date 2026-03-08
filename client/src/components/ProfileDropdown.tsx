'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, removeAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get initials from user name
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Call backend logout
      try {
        await authAPI.logout();
      } catch (err) {
        console.error('Backend logout error:', err);
        // Continue with logout even if backend call fails
      }

      // Clear all auth data
      removeAuthToken(); // Delete from cookies
      logout(); // Clear from context (sets user to null)

      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      toast.success('Logged out successfully');
      setIsOpen(false);

      // Force full page reload after 1 second
      // This ensures complete state reset on the home page
      // Using reload with cache bypass to force fresh fetch
      setTimeout(() => {
        window.location.href = '/?t=' + Date.now(); // Add timestamp to bust cache
      }, 1000);
    } catch (err: any) {
      console.error('Logout error:', err);
      const errorMsg = err.response?.data?.error || 'Logout failed';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
      >
        {/* Profile Image or Avatar */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-blue-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white border border-blue-200">
            {getInitials()}
          </div>
        )}

        {/* Name */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-blue-600 capitalize">{user.userType}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-blue-200 z-50 overflow-hidden ">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-blue-100 bg-blue-50/50">
            <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
            <p className="text-xs text-slate-600 mt-1">{user.email}</p>
            <p className="text-xs text-blue-600 mt-1 capitalize">
              {user.userType}
              {user.userType === 'student' && user.yearOfStudy && ` • Year ${user.yearOfStudy}`}
              {user.userType === 'professional' && user.designation && ` • ${user.designation}`}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href="/dashboard?tab=profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-blue-100">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
