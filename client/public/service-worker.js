const CACHE_NAME = 'yic-cache-v3';
const STATIC_CACHE = 'yic-static-v3';

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

  // Never intercept: external domains, API calls, or any authenticated app routes
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/dashboard/') ||
    url.pathname.startsWith('/mentor-dashboard/') ||
    url.pathname.startsWith('/admin/') ||
    event.request.url.includes('kpeduresumeapi.vercel.app')
  ) {
    return;
  }

  // Next.js content-hashed static chunks — safe to cache forever
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(event.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Public pages — Network First with safe offline fallback
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        const offline = await caches.match('/offline.html');
        if (offline) return offline;
        // Always return a valid Response — never let the promise reject
        return new Response('Service unavailable. Please check your connection.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});