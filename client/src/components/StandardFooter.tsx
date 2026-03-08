'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Dashboard', href: '/user-dashboard' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Status', href: '#status' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#twitter', label: 'Twitter' },
  { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  { icon: Github, href: '#github', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@yourinterviewcoach.com', label: 'Email' },
];

interface StandardFooterProps {
  dark?: boolean;
}

export default function StandardFooter({ dark = false }: StandardFooterProps) {
  return (
    <footer className={`relative overflow-hidden ${
      dark
        ? 'bg-zinc-950 border-t border-zinc-800'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 border-t-2 border-blue-200'
    }`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-10 sm:mb-16">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6 group">
              <div className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                dark ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30' : 'bg-blue-600'
              }`}>
                <span className="text-white font-bold text-xs sm:text-sm font-heading">Y</span>
              </div>
              <div>
                <div className={`font-semibold text-sm sm:text-base font-heading ${dark ? 'text-white' : 'text-slate-900'}`}>yourinterviewcoach</div>
                <div className={`text-[10px] sm:text-xs font-body ${dark ? 'text-zinc-400' : 'text-slate-600'}`}>Mentorship Platform</div>
              </div>
            </Link>
            <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm font-body ${dark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Connect with industry experts and mentors to accelerate your career growth. Learn, practice, and succeed together.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-9 sm:w-10 h-9 sm:h-10 rounded-lg transition-all duration-300 flex items-center justify-center group ${
                      dark
                        ? 'bg-white/5 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                        : 'bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={`text-xs sm:text-sm font-semibold mb-4 sm:mb-6 font-heading ${dark ? 'text-white' : 'text-slate-900'}`}>{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-xs sm:text-sm transition-colors duration-300 inline-flex items-center gap-1 group font-body ${
                        dark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      {link.label}
                      <ArrowUpRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`h-px bg-gradient-to-r from-transparent to-transparent mb-6 sm:mb-8 ${dark ? 'via-zinc-800' : 'via-blue-200'}`}></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className={`text-[10px] sm:text-xs font-body text-center sm:text-left ${dark ? 'text-zinc-500' : 'text-slate-600'}`}>
            © 2026 yourinterviewcoach. All rights reserved. | Built with care for career growth.
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className={`text-[10px] sm:text-xs font-body flex items-center gap-1 ${dark ? 'text-zinc-500' : 'text-slate-600'}`}>
              Made with <span className="text-red-500">❤️</span> in Bangalore by <span className={`font-semibold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>A3Neptune</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
