"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import LaunchBanner from "./LaunchBanner";

const NAV_LINKS_BASE = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Courses", href: "" }, // href filled dynamically below
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
  const navLinks = NAV_LINKS_BASE.map((l) =>
    l.name === "Courses" ? { ...l, href: "/courses" } : l
  );

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
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
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
                const coursesActive = link.name === "Courses" && (pathname === "/courses" || pathname === "/dashboard/content");
                const active = coursesActive || pathname === link.href;
                const hasFreeBadge = link.name === "Check Resume Score";
                const hasNewBadge = link.name === "Placement Prep" || link.name === "Courses";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium"
                    style={{ color: active ? "#1d4ed8" : "#475569" }}
                  >
                    {active && (
                      <span
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(29,78,216,0.08)" }}
                      />
                    )}
                    {hasFreeBadge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 inline-flex shrink-0 rounded-full bg-red-600 px-1.5 py-[2px] text-[9px] font-semibold leading-none text-white shadow-sm">
                        Free
                      </span>
                    )}
                    {hasNewBadge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 inline-flex shrink-0 rounded-full px-1.5 py-[2px] text-[9px] font-semibold leading-none text-white shadow-sm" style={{ background: "#2563eb" }}>
                        New
                      </span>
                    )}
                    <span className="relative text-center whitespace-nowrap">
                      {link.name}
                    </span>
                    {active && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                        style={{ background: "#1d4ed8", opacity: 0.6 }}
                      />
                    )}
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
                    className="px-3.5 py-1.5 text-[13px] font-medium text-slate-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 text-white text-[13px] font-semibold rounded-xl"
                    style={{ padding: "8px 16px", background: "#1d4ed8" }}
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
              className="lg:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-xl"
              aria-label="Toggle menu"
            >
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
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
          style={{
            background: "rgba(15,23,42,0.15)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMobileMenu(false)}
        />

        {/* panel */}
        <div
          className="absolute left-4 right-4 overflow-y-auto"
          style={{
            top: `calc(${bannerHeight}px + 76px)`,
            maxHeight: "calc(100dvh - 100px)",
            background: "rgba(255, 255, 255, 0.97)",
            border: "1px solid rgba(29, 78, 216, 0.14)",
            borderRadius: 18,
            boxShadow:
              "0 12px 48px rgba(29,78,216,0.12), 0 2px 8px rgba(29,78,216,0.06)",
          }}
        >
          {/* nav links */}
          <div className="p-2 pb-1">
            {navLinks.map((link) => {
              const coursesActiveMobile = link.name === "Courses" && (pathname === "/courses" || pathname === "/dashboard/content");
              const active = coursesActiveMobile || pathname === link.href;
              const hasFreeBadge = link.name === "Check Resume Score";
              const hasNewBadge = link.name === "Placement Prep" || link.name === "Courses";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{
                    background: active ? "rgba(29,78,216,0.07)" : "transparent",
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
            className="mx-4 my-1 h-px"
            style={{ background: "rgba(29,78,216,0.08)" }}
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
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-slate-700 rounded-xl border hover:bg-blue-50 hover:text-blue-600"
                  style={{ borderColor: "rgba(29,78,216,0.14)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white rounded-xl"
                  style={{ background: "#1d4ed8" }}
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* bottom links */}
          <div
            className="flex items-center justify-center gap-5 px-4 py-3 border-t"
            style={{ borderColor: "rgba(29,78,216,0.06)" }}
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
