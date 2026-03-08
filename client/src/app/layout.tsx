import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CareerCoach | Your Path to Professional Success",
  description: "Connect with expert mentors, get personalized career roadmaps, and master the skills needed to land your dream job. Join 10,000+ successful professionals.",
  keywords: ["career coaching", "mentorship", "professional development", "career guidance", "job placement"],
  authors: [{ name: "CareerCoach" }],
  openGraph: {
    title: "CareerCoach | Your Path to Professional Success",
    description: "Connect with expert mentors and transform your career with personalized guidance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCoach | Your Path to Professional Success",
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
        {/* Poppins - Modern geometric font for headings (e-learning standard) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Inter - Clean readable font for body text */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Space Grotesk - Modern tech font for accents/numbers */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-[#030712] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
