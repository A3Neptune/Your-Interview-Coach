"use client";

import { useEffect } from "react";
import axios from "axios";

const SESSION_KEY = "yic_home_tracked_v1";

export default function HomePageTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    sessionStorage.setItem(SESSION_KEY, "1");

    axios
      .post(
        `${API_URL}/analytics/track`,
        { path: "/", referrer: document.referrer || "" },
        { withCredentials: false, timeout: 5000 }
      )
      .catch(() => {
        // Silent — analytics should never block the user
      });
  }, []);

  return null;
}
