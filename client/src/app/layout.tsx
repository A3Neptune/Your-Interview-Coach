import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "YourInterviewCoach | Your Path to Professional Success",
  description: "Connect with expert mentors, get personalized career roadmaps, and master the skills needed to land your dream job. Join 10,000+ successful professionals.",
  keywords: ["career coaching", "mentorship", "professional development", "career guidance", "job placement"],
  authors: [{ name: "CareerCoach" }],
  icons: {
    icon: "/yic-logo-sm.png",
  },
  openGraph: {
    title: "YourInterviewCoach | Your Path to Professional Success",
    description: "Connect with expert mentors and transform your career with personalized guidance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourInterviewCoach | Your Path to Professional Success",
    description: "Connect with expert mentors and transform your career with personalized guidance.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DM Sans - Geometric sans-serif for modern UI */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-[#030712] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
