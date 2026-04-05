"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import { getAuthToken, removeAuthToken } from "@/lib/api";
import NotificationBell from "./NotificationBell";

export default function ModernDashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Content", href: "/dashboard/content", icon: BookOpen },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 w-full z-50 border-b border-black/5"
        style={{
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center group">
              <img
                src="/yourinterviewcoach-logo1.png"
                alt="YourInterviewCoach"
                className="w-[60px] sm:w-[80px] md:w-[95px] h-auto group-hover:scale-[1.02] transition-transform duration-300"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.16))" }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      active
                        ? "text-blue-600"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-blue-50 rounded-xl"></span>
                    )}
                    <Icon
                      className={`w-4 h-4 relative z-10 ${active ? "text-blue-600" : ""}`}
                    />
                    <span className="relative z-10">{link.name}</span>
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Notifications */}
              <NotificationBell />

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t-2 border-blue-200">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t-2 border-blue-100 space-y-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}
