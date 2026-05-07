"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWA_INSTALLED_KEY = "pwaInstallInstalled";
const PWA_DISMISSED_UNTIL_KEY = "pwaInstallDismissedUntil";
const PWA_SNOOZE_MS = 24 * 60 * 60 * 1000;

const isRunningStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<
    "android" | "ios" | "desktop" | null
  >(null);

  useEffect(() => {
    const markInstalled = () => {
      localStorage.setItem(PWA_INSTALLED_KEY, "true");
      localStorage.removeItem(PWA_DISMISSED_UNTIL_KEY);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    const shouldSuppressPrompt = () => {
      if (localStorage.getItem(PWA_INSTALLED_KEY) === "true") return true;
      if (isRunningStandalone()) {
        markInstalled();
        return true;
      }

      const dismissedUntil = Number(
        localStorage.getItem(PWA_DISMISSED_UNTIL_KEY) || "0",
      );
      return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
    };

    if (shouldSuppressPrompt()) return;

    // Check if PWA install prompt should be shown
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (shouldSuppressPrompt()) return;

      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallPromptEvent);

      // Detect platform
      const ua = navigator.userAgent.toLowerCase();
      if (/android/.test(ua)) {
        setPlatform("android");
        setShowPrompt(true);
      } else if (/iphone|ipad|ipod/.test(ua)) {
        setPlatform("ios");
        // iOS doesn't support beforeinstallprompt, but we can show manual instructions
      } else {
        setPlatform("desktop");
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle app installed event
    const handleAppInstalled = () => {
      markInstalled();
      console.log("PWA installed successfully");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      if (outcome === "accepted") {
        localStorage.setItem(PWA_INSTALLED_KEY, "true");
        localStorage.removeItem(PWA_DISMISSED_UNTIL_KEY);
      } else {
        localStorage.setItem(
          PWA_DISMISSED_UNTIL_KEY,
          String(Date.now() + PWA_SNOOZE_MS),
        );
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(
      PWA_DISMISSED_UNTIL_KEY,
      String(Date.now() + PWA_SNOOZE_MS),
    );
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  if (platform === "ios") {
    // iOS manual installation instructions
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Download className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Install Your Interview Coach</p>
              <p className="text-blue-100 text-xs">
                Tap Share → Add to Home Screen for quick access
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-blue-500 rounded transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Android and Desktop installation prompt
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Install App</h3>
              <p className="text-blue-100 text-xs">
                Get instant access anytime
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Install Your Interview Coach to access resume analysis offline and
            get quick shortcuts on your device.
          </p>

          {/* Features */}
          <div className="space-y-2">
            {[
              "Offline access to your analyses",
              "Launch from home screen",
              "Faster performance",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                {feature}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-shadow text-sm"
            >
              Install Now
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
