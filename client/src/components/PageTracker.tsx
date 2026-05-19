"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsAPI } from "@/lib/api";

function PageTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      analyticsAPI.trackPageView({
        path: pathname,
        referrer: document.referrer,
      }).catch(console.error);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerContent />
    </Suspense>
  );
}
