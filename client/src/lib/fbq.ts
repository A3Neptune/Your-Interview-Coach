declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}