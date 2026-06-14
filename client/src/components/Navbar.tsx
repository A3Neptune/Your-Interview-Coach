"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import LaunchBanner from "./LaunchBanner";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Placement Prep", href: "/placement-prep" },
  { name: "Check Resume Score", href: "/resume-analyzer" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  const handleBannerHeight = useCallback((h: number) => {
    setBannerHeight(h);
  }, []);

  // Keep --yic-header-h in sync so pages and anchor scroll-padding stay correct
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--yic-header-h",
      `${bannerHeight + 64}px`
    );
  }, [bannerHeight]);

  const handleLogoClick = () => {
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .nav-root {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
      `}</style>

      <LaunchBanner onHeightChange={handleBannerHeight} />

      {/* ── NAV SHELL ── */}
      <nav
        className="nav-root fixed left-0 right-0 z-50 w-full"
        style={{
          top: bannerHeight,
          background: "#F8F6F1",
          borderBottom: "2px solid #0f172a",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* ── LOGO ── */}
            <Link
              href={logoHref}
              onClick={handleLogoClick}
              scroll
              className="flex items-center shrink-0"
            >
              <img
                src="/yic-logo-sm.png"
                alt="YourInterviewCoach"
                className="w-[60px] sm:w-[80px] md:w-[95px] h-auto"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.16))" }}
              />
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const hasFreeBadge = link.name === "Check Resume Score";
                const hasNewBadge = link.name === "Placement Prep";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3.5 py-1.5 text-[13px] font-semibold transition-all"
                    style={{
                      color: active ? "#1d4ed8" : "#0f172a",
                      borderBottom: active ? "2px solid #1d4ed8" : "2px solid transparent",
                      paddingBottom: "4px",
                    }}
                  >
                    {hasFreeBadge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 inline-flex shrink-0 rounded-sm bg-red-600 px-1.5 py-[2px] text-[9px] font-bold leading-none text-white" style={{ border: "1.5px solid #0f172a" }}>
                        Free
                      </span>
                    )}
                    {hasNewBadge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 inline-flex shrink-0 rounded-sm px-1.5 py-[2px] text-[9px] font-bold leading-none text-white" style={{ background: "#2563eb", border: "1.5px solid #0f172a" }}>
                        New
                      </span>
                    )}
                    <span className="relative text-center whitespace-nowrap">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-1.5 text-[13px] font-medium text-slate-600 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-[13px] font-semibold text-slate-700 rounded-md"
                    style={{ border: "2px solid #0f172a", background: "#fff", boxShadow: "2px 2px 0 #0f172a" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 text-white text-[13px] font-bold rounded-md transition-all"
                    style={{ padding: "8px 18px", background: "#2563eb", border: "2px solid #0f172a", boxShadow: "3px 3px 0 #0f172a" }}
                  >
                    Sign up
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* ── HAMBURGER ── */}
            <button
              onClick={() => setMobileMenu((p) => !p)}
              className="lg:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9"
              aria-label="Toggle menu"
              style={{ border: "2px solid #0f172a", borderRadius: 6, background: "#fff", boxShadow: "2px 2px 0 #0f172a" }}
            >
              <span className="block w-4 h-[2px]" style={{ background: "#0f172a" }} />
              <span className="block w-4 h-[2px]" style={{ background: "#0f172a" }} />
              <span className="block w-4 h-[2px]" style={{ background: "#0f172a" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          display: isMobileMenuOpen ? "block" : "none",
        }}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(15,23,42,0.4)" }}
          onClick={() => setMobileMenu(false)}
        />

        {/* panel */}
        <div
          className="absolute left-4 right-4 overflow-y-auto"
          style={{
            top: `calc(${bannerHeight}px + 76px)`,
            maxHeight: "calc(100dvh - 100px)",
            background: "#F8F6F1",
            border: "2px solid #0f172a",
            borderRadius: 8,
            boxShadow: "6px 6px 0 #0f172a",
          }}
        >
          {/* nav links */}
          <div className="p-2 pb-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const hasFreeBadge = link.name === "Check Resume Score";
              const hasNewBadge = link.name === "Placement Prep";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-md"
                  style={{
                    background: active ? "#2563eb14" : "transparent",
                    borderLeft: active ? "3px solid #2563eb" : "3px solid transparent",
                  }}
                >
                  <span className="flex flex-col items-start gap-0.5">
                    {hasFreeBadge && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-semibold leading-none text-white shadow-sm">
                        Free
                      </span>
                    )}
                    {hasNewBadge && (
                      <span className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-semibold leading-none text-white shadow-sm" style={{ background: "#2563eb" }}>
                        New
                      </span>
                    )}
                    <span
                      className="text-[15px] font-medium whitespace-nowrap"
                      style={{ color: active ? "#1d4ed8" : "#475569" }}
                    >
                      {link.name}
                    </span>
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: active
                        ? "rgba(29,78,216,0.10)"
                        : "transparent",
                    }}
                  >
                    <ArrowRight
                      className="w-3 h-3"
                      style={{ color: active ? "#1d4ed8" : "#94a3b8" }}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* divider */}
          <div
            className="mx-4 my-1 h-[2px]"
            style={{ background: "#0f172a" }}
          />

          {/* auth buttons */}
          <div className="p-3 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl border hover:bg-blue-50"
                  style={{ borderColor: "rgba(29,78,216,0.12)" }}
                >
                  Dashboard <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl border hover:bg-blue-50"
                  style={{ borderColor: "rgba(29,78,216,0.12)" }}
                >
                  Profile Settings{" "}
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-800 rounded-md"
                  style={{ border: "2px solid #0f172a", background: "#fff", boxShadow: "3px 3px 0 #0f172a" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-white rounded-md"
                  style={{ background: "#2563eb", border: "2px solid #0f172a", boxShadow: "3px 3px 0 #0f172a" }}
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* bottom links */}
          <div
            className="flex items-center justify-center gap-5 px-4 py-3 border-t-2"
            style={{ borderColor: "#0f172a" }}
          >
            {[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="text-[11px] font-medium text-slate-400 hover:text-blue-500"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
