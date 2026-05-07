"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", {
          scope: "/",
        })
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is ready, notify user
                console.log("New app version available");
              }
            });
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
