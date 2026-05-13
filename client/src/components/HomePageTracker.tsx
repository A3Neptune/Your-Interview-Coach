"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

const STORAGE_KEY = "yic_home_last_hit";
// Re-track after this many ms have passed since the last hit on this device.
// Short enough that real refreshes/revisits register, long enough that
// React StrictMode double-mount + Turbopack hot-reload don't double-count.
const DEDUPE_MS = 30 * 1000;

export default function HomePageTracker() {
  const firedThisMount = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firedThisMount.current) return;
    firedThisMount.current = true;

    try {
      const lastRaw = localStorage.getItem(STORAGE_KEY);
      const last = lastRaw ? parseInt(lastRaw, 10) : 0;
      if (last && Date.now() - last < DEDUPE_MS) return;
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore quota / private mode errors and still try the beacon
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    axios
      .post(
        `${API_URL}/analytics/track`,
        { path: "/", referrer: document.referrer || "" },
        { withCredentials: false, timeout: 5000 }
      )
      .then((res: { data?: unknown }) => {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("[YIC analytics] tracked", res?.data);
        }
      })
      .catch((err: { message?: string }) => {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[YIC analytics] track failed", err?.message || err);
        }
      });
  }, []);

  return null;
}
