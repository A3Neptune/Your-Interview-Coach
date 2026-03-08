'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

export default function ModernDashboardFooter() {
  return (
    <footer className="relative mt-20 border-t-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Decorative gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/dashboard" className="flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg block">YourInterviewCoach</span>
                <span className="text-xs text-slate-500 -mt-1 block">Master Your Career</span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md mb-4">
              Empowering professionals with expert mentorship and personalized guidance for career success. Learn from industry leaders and achieve your goals.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/content" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Content
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} YourInterviewCoach. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-slate-500 hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-slate-500 hover:text-blue-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
