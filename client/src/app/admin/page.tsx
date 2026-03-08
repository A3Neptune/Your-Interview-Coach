'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Users, LogOut, Settings, Search, ChevronRight, ArrowUpRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, getAuthToken, removeAuthToken } from '@/lib/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authAPI.getCurrentUser();
        if (response.data.user.userType !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUser(response.data.user);
      } catch (err: any) {
        removeAuthToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Logout failed';
      toast.error(errorMsg);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Redirecting to login...</p>
          <Link href="/login" className="text-white hover:text-zinc-200 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">C</span>
            </div>
            <span className="font-bold">CareerCoach Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Admin: {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/10">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-zinc-400 text-sm mt-1">Manage users and platform analytics</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="text-emerald-400 flex items-center gap-1 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Students</p>
                <p className="text-3xl font-bold">{users.filter(u => u.userType === 'student').length}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/10">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Professionals</p>
                <p className="text-3xl font-bold">{users.filter(u => u.userType === 'professional').length}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/10">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="border-b border-white/10 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">All Users</h2>
                <p className="text-zinc-400 text-sm">Manage and monitor all registered users</p>
              </div>

              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.userType === 'student'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {u.userType.charAt(0).toUpperCase() + u.userType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-400 hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
