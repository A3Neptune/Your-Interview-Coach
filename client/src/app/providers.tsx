'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import FeedbackButton from '@/components/FeedbackButton';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        {children}
        <FeedbackButton />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
