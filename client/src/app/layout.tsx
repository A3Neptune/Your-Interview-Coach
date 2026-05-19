import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PageTracker from "@/components/PageTracker";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "YourInterviewCoach | Your Path to Professional Success",
  description:
    "Connect with expert mentors, get personalized career roadmaps, and master the skills needed to land your dream job. Join 10,000+ successful professionals.",
  keywords: [
    "career coaching",
    "mentorship",
    "professional development",
    "career guidance",
    "job placement",
  ],
  authors: [{ name: "CareerCoach" }],
  icons: {
    icon: "/yic-logo-sm.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Your Interview Coach",
  },
  openGraph: {
    title: "YourInterviewCoach | Your Path to Professional Success",
    description:
      "Connect with expert mentors and transform your career with personalized guidance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourInterviewCoach | Your Path to Professional Success",
    description:
      "Connect with expert mentors and transform your career with personalized guidance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DM Sans - site-wide font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700&display=swap"
          rel="stylesheet"
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Apple Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Your Interview Coach"
        />
        {/* Apple Launch Icons */}
        <link rel="apple-touch-icon" href="/yic-logo-lg.png" />
        {/* Microsoft Web App Meta Tags */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/yic-logo-lg.png" />
        {/* Google Chrome Web App Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="font-body antialiased bg-[#030712] text-white">
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
        <PageTracker />
        <Analytics />
      </body>
    </html>
  );
}
