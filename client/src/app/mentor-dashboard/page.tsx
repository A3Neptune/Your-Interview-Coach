'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, BookOpen, Calendar, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI, getAuthToken, removeAuthToken } from '@/lib/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  designation: string;
  company: string;
  profileImage?: string;
  userType: string;
}

interface Booking {
  _id: string;
  studentId: { name: string; email: string; _id?: string };
  sessionType: string;
  title: string;
  scheduledDate: string;
  duration: number;
  status: string;
}

interface WebinarGroup {
  slotKey: string;           // "YYYY-MM-DDTHH:MM"
  scheduledDate: string;
  duration: number;
  title: string;
  participants: Booking[];
}

export default function MentorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [webinarGroups, setWebinarGroups] = useState<WebinarGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;

        if (userData.userType !== 'admin') {
          toast.error('Only admins can access this dashboard');
          router.push('/dashboard');
          return;
        }

        setUser(userData);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // Fetch bookings
        try {
          const bookingsResponse = await fetch(`${API_URL}/bookings/mentor`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (bookingsResponse.ok) {
            const data = await bookingsResponse.json();
            const allBookings = data.bookings || [];
            const now = new Date();
            const upcoming = allBookings
              .filter((b: Booking) => new Date(b.scheduledDate) > now && b.status === 'confirmed')
              .sort((a: Booking, b: Booking) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

            // Split: webinars get grouped by slot, everything else shown individually
            const nonWebinar = upcoming.filter((b: Booking) => b.sessionType !== 'webinars').slice(0, 5);
            setBookings(nonWebinar);

            // Group webinar bookings by exact slot (date + time, rounded to minute)
            const wMap = new Map<string, WebinarGroup>();
            upcoming.filter((b: Booking) => b.sessionType === 'webinars').forEach((b: Booking) => {
              const d = new Date(b.scheduledDate);
              const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
              if (!wMap.has(key)) {
                wMap.set(key, { slotKey: key, scheduledDate: b.scheduledDate, duration: b.duration, title: b.title, participants: [] });
              }
              wMap.get(key)!.participants.push(b);
            });
            setWebinarGroups(Array.from(wMap.values()).slice(0, 5));

            const upcomingCount = allBookings.filter(
              (b: any) => new Date(b.scheduledDate) > now && b.status === 'confirmed'
            ).length;

            // completed = status 'completed' OR confirmed sessions that have already passed
            const completedCount = allBookings.filter(
              (b: any) => b.status === 'completed' ||
                (b.status === 'confirmed' && new Date(b.scheduledDate).getTime() + (b.duration || 60) * 60000 <= now.getTime())
            ).length;

            // Revenue = only paymentStatus 'completed' (excludes refunded/failed/pending)
            const totalRevenue = allBookings
              .filter((b: any) => b.paymentStatus === 'completed')
              .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

            setStats(prev => ({
              ...prev,
              upcomingSessions: upcomingCount,
              completedSessions: completedCount,
              totalRevenue: totalRevenue,
            }));
          }
        } catch (err) {
          console.error('Failed to fetch bookings for dashboard:', err);
        }

        // Fetch total users count (students + professionals)
        try {
          const usersResponse = await fetch(`${API_URL}/auth/all-users`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            // Count all non-admin users (students + professionals)
            const totalUsers = usersData.users?.filter((u: any) => u.userType !== 'admin').length || 0;
            setStats(prev => ({
              ...prev,
              totalStudents: totalUsers,
            }));
          } else {
            console.error('Failed to fetch users:', usersResponse.status);
          }
        } catch (err) {
          console.error('Error fetching users:', err);
        }

        // Fetch courses count
        try {
          const coursesResponse = await fetch(`${API_URL}/advanced/courses`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            const courses = coursesData.data?.courses || coursesData.courses || [];
            setStats(prev => ({
              ...prev,
              totalCourses: courses.length,
            }));
          } else {
            console.error('Failed to fetch courses:', coursesResponse.status);
          }
        } catch (err) {
          console.error('Error fetching courses:', err);
        }
      } catch (err: any) {
        removeAuthToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
          <p className="text-zinc-400">Manage your courses, bookings, and mentorship activities</p>
        </div>

        {/* Scheduled Sessions */}
        {(bookings.length > 0 || webinarGroups.length > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Scheduled Sessions</h2>
            <div className="grid md:grid-cols-2 gap-6">

              {/* ── Webinar groups — one card per slot ── */}
              {webinarGroups.map((group) => {
                const d = new Date(group.scheduledDate);
                const fDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fTime = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                return (
                  <div key={group.slotKey} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{group.title}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Live Webinar · {group.participants.length} registered</p>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {group.participants.length} seats
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-zinc-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{fDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{fTime} · {group.duration} min</span>
                      </div>
                    </div>

                    {/* Participant avatars */}
                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                      {group.participants.slice(0, 5).map((p) => (
                        <div
                          key={p._id}
                          title={p.studentId.name}
                          className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-300"
                        >
                          {initials(p.studentId.name)}
                        </div>
                      ))}
                      {group.participants.length > 5 && (
                        <span className="text-xs text-zinc-500">+{group.participants.length - 5} more</span>
                      )}
                    </div>

                    <Link
                      href="/mentor-dashboard/bookings"
                      className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      Manage Session
                    </Link>
                  </div>
                );
              })}

              {/* ── Individual non-webinar bookings ── */}
              {bookings.map((booking) => {
                const d = new Date(booking.scheduledDate);
                const fDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fTime = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={booking._id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white">{booking.title}</h3>
                        <p className="text-sm text-zinc-400">{booking.studentId.name}</p>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        Confirmed
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>{fDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{fTime} · {booking.duration} minutes</span>
                      </div>
                    </div>
                    <Link
                      href="/mentor-dashboard/bookings"
                      className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      Manage Session
                    </Link>
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { href: "/mentor-dashboard/bookings", label: "Upcoming", value: stats.upcomingSessions, sub: "confirmed sessions", icon: <Calendar className="w-8 h-8" />, color: "text-blue-400" },
            { href: "/mentor-dashboard/bookings", label: "Completed", value: stats.completedSessions, sub: "sessions done", icon: <Clock className="w-8 h-8" />, color: "text-emerald-400" },
            { href: "/mentor-dashboard/students", label: "Students", value: stats.totalStudents, sub: "registered users", icon: <Users className="w-8 h-8" />, color: "text-purple-400" },
            { href: "/mentor-dashboard/analytics", label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, sub: "from paid sessions", icon: <BarChart3 className="w-8 h-8" />, color: "text-amber-400" },
          ].map(s => (
            <Link key={s.label} href={s.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/8 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                <span className={`${s.color} opacity-40 group-hover:opacity-80 transition-opacity`}>{s.icon}</span>
              </div>
              <p className={`text-3xl font-bold text-white mb-1`}>{s.value}</p>
              <p className="text-xs text-zinc-600">{s.sub}</p>
            </Link>
          ))}
        </div>

        {/* Main Navigation */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Content Management */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
            <div className="space-y-3">
              <Link
                href="/mentor-dashboard/courses"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <BookOpen className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div>
                  <p className="font-semibold text-sm text-white">Manage Courses</p>
                  <p className="text-xs text-zinc-500">Create and edit your courses</p>
                </div>
              </Link>

              <Link
                href="/mentor-dashboard/courses"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <BookOpen className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div>
                  <p className="font-semibold text-sm text-white">Add Content</p>
                  <p className="text-xs text-zinc-500">Upload lessons and materials</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Booking Management */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Management</h2>
            <div className="space-y-3">
              <Link
                href="/mentor-dashboard/bookings"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <Calendar className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div>
                  <p className="font-semibold text-sm text-white">View Bookings</p>
                  <p className="text-xs text-zinc-500">Manage session requests</p>
                </div>
              </Link>

              <Link
                href="/mentor-dashboard/bookings"
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <Calendar className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div>
                  <p className="font-semibold text-sm text-white">Calendar</p>
                  <p className="text-xs text-zinc-500">View your schedule</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
