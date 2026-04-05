"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Main Footer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 pb-12 border-b-2 border-blue-100">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <img
                src="/yourinterviewcoach-logo1.png"
                alt="YourInterviewCoach"
                className="w-[80px] sm:w-[100px] h-auto group-hover:scale-[1.02] transition-transform duration-300"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.16))" }}
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Connecting students and professionals with expert mentors for
              career growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#twitter"
                className="p-2.5 rounded-xl bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition-all shadow-sm hover:shadow-md"
              >
                <Twitter className="w-4 h-4 text-blue-600" />
              </a>
              <a
                href="#linkedin"
                className="p-2.5 rounded-xl bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition-all shadow-sm hover:shadow-md"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
              </a>
              <a
                href="#github"
                className="p-2.5 rounded-xl bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition-all shadow-sm hover:shadow-md"
              >
                <Github className="w-4 h-4 text-blue-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600 font-medium">
          <p className="flex items-center gap-2">
            <span>© 2026</span>
            <img
              src="/yourinterviewcoach-logo1.png"
              alt="YourInterviewCoach"
              className="w-[30px] h-auto"
              style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }}
            />
            <span>All rights reserved.</span>
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
