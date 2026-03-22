'use client';

import ModernDashboardNavbar from '@/components/ModernDashboardNavbar';
import ModernDashboardFooter from '@/components/ModernDashboardFooter';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Dashboard Navbar */}
      <ModernDashboardNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </main>

      {/* Modern Dashboard Footer */}
      <ModernDashboardFooter />
    </div>
  );
}
