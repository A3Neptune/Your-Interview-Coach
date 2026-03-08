'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, getAuthToken } from '@/lib/api';

interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  userType: 'student' | 'professional' | 'admin';
  profileImage?: string;
  bio?: string;
  company?: string;
  designation?: string;
  yearsOfExperience?: number;
  yearOfStudy?: number;
  skills?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        setUser(null);
        // Dispatch event for auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));
        return;
      }

      const response = await authAPI.getCurrentUser();
      if (response.data.user) {
        setUser(response.data.user);
        // Dispatch event for auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: response.data.user } }));
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: null } }));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
