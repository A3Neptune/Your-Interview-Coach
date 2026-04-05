"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Video,
  FileText,
  Award,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { authAPI, getAuthToken, removeAuthToken } from "@/lib/api";
import StandardFooter from "@/components/StandardFooter";
import ProfileDropdown from "@/components/ProfileDropdown";
import NotificationBell from "@/components/NotificationBell";

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: string;
  profileImage?: string;
}

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-collapse sidebar after 5 seconds of inactivity (desktop only)
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only set timer on desktop when sidebar is open
    if (!isMobile && sidebarOpen) {
      inactivityTimerRef.current = setTimeout(() => {
        setSidebarOpen(false);
      }, 5000); // 5 seconds
    }
  }, [isMobile, sidebarOpen]);

  // Start inactivity timer when sidebar opens
  useEffect(() => {
    if (sidebarOpen && !isMobile) {
      resetInactivityTimer();
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [sidebarOpen, isMobile, resetInactivityTimer]);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;

        // Only admin (Neel) can access mentor dashboard
        if (userData.userType !== "admin") {
          toast.error("Only admins can access this area");
          router.push("/dashboard");
          return;
        }

        setUser(userData);
      } catch (err: any) {
        removeAuthToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const getInitials = () => {
    if (!user?.name) return "A";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const menuItems = [
    {
      name: "Overview",
      icon: Home,
      href: "/mentor-dashboard",
      color: "text-blue-400",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      href: "/mentor-dashboard/analytics",
      color: "text-emerald-400",
    },
    {
      name: "Bookings",
      icon: Calendar,
      href: "/mentor-dashboard/bookings",
      color: "text-purple-400",
    },
    {
      name: "Pricing",
      icon: DollarSign,
      href: "/mentor-dashboard/pricing",
      color: "text-orange-400",
    },
    {
      name: "Students",
      icon: Users,
      href: "/mentor-dashboard/students",
      color: "text-pink-400",
    },
    // { name: 'Messaging', icon: MessageSquare, href: '/mentor-dashboard/messages', color: 'text-cyan-400' },
    {
      name: "GD Practice",
      icon: Video,
      href: "/mentor-dashboard/gd-practice",
      color: "text-red-400",
    },
    {
      name: "CV Reviews",
      icon: FileText,
      href: "/mentor-dashboard/cv-reviews",
      color: "text-yellow-400",
    },
    {
      name: "Placements",
      icon: Award,
      href: "/mentor-dashboard/placements",
      color: "text-green-400",
    },
    {
      name: "Courses",
      icon: BookOpen,
      href: "/mentor-dashboard/courses",
      color: "text-indigo-400",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/mentor-dashboard/settings",
      color: "text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 border-b border-zinc-800 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 h-16">
          {/* Left: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition text-zinc-400 hover:text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/mentor-dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="font-bold text-white text-sm">Y</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
                yourinterviewcoach
              </span>
            </Link>
          </div>

          {/* Center: Page Title */}
          <h1 className="text-lg font-bold text-white hidden md:block">
            Mentor Dashboard
          </h1>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-4">
            {/* Real-time Notifications */}
            <NotificationBell />

            {/* Settings */}
            <Link
              href="/mentor-dashboard/settings"
              className="text-zinc-400 hover:text-white transition"
            >
              <Settings size={20} />
            </Link>

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 border-r border-zinc-800 transition-all duration-300 overflow-y-auto ${
          sidebarOpen ? "w-64" : isMobile ? "-translate-x-full w-64" : "w-20"
        }`}
        onMouseEnter={() => {
          if (!isMobile) {
            setSidebarOpen(true);
            resetInactivityTimer();
          }
        }}
        onMouseLeave={() => {
          if (!isMobile && sidebarOpen) {
            resetInactivityTimer();
          }
        }}
      >
        {/* Menu Items */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group relative"
              >
                <Icon
                  size={20}
                  className={`${item.color} group-hover:scale-110 transition`}
                />
                {sidebarOpen && (
                  <span className="font-medium group-hover:translate-x-1 transition">
                    {item.name}
                  </span>
                )}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-20 bg-zinc-800 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
        } mt-16 p-8 min-h-[calc(100vh-4rem)]`}
      >
        {children}
      </main>

      {/* Standard Footer */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <StandardFooter />
      </div>
    </div>
  );
}
