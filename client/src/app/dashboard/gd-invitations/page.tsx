'use client';

import UserInvitedGDDashboard from '@/components/UserInvitedGDDashboard';

export default function GDInvitationsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <UserInvitedGDDashboard />
      </div>
    </div>
  );
}
