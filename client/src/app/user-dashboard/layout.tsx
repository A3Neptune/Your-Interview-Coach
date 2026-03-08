'use client';

import StandardNavbar from '@/components/StandardNavbar';
import StandardFooter from '@/components/StandardFooter';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Standard Navbar */}
      <StandardNavbar variant="dashboard" />

      {/* Main Content */}
      <div className="flex-1 pt-24">
        {children}
      </div>

      {/* Standard Footer */}
      <StandardFooter />
    </div>
  );
}
