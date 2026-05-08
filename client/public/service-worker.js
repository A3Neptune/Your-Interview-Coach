const CACHE_NAME = 'yic-cache-v2';
const STATIC_CACHE = 'yic-static-v2';

// Install — only pre-cache the offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(['/offline.html']).catch(() => Promise.resolve()))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete ALL old caches, take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== CACHE_NAME && n !== STATIC_CACHE)
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never intercept API calls or external domains
  if (
    url.pathname.startsWith('/api/') ||
    event.request.url.includes('kpeduresumeapi.vercel.app') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Next.js content-hashed static chunks — safe to cache forever
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // Everything else (HTML pages, API routes, images) — Network First
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        return res;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cached) => cached || caches.match('/offline.html'))
      )
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
