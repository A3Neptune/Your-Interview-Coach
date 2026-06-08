import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PageTracker from "@/components/PageTracker";
import MetaPixelTracker from "@/components/MetaPixelTracker";
import { Analytics } from "@vercel/analytics/next";

const META_PIXEL_ID = "1316585250580373";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />

      <body className="font-body antialiased bg-[#030712] text-white">
      <noscript>
        <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
        />
      </noscript>

      <Providers>{children}</Providers>
      <ServiceWorkerRegister />
      <PageTracker />
      <MetaPixelTracker />
      <Analytics />

      {/* Meta Pixel base code — loads once after hydration */}
      <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}
              (window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
            `,
          }}
      />
      </body>
      </html>
  );
}