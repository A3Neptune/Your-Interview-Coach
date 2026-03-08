'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#09090b',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#09090b',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#09090b',
            },
          },
          error: {
            style: {
              background: '#09090b',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#09090b',
            },
          },
        }}
        />
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
