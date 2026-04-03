// TOLLET Service Worker
const CACHE = 'tollet-v1';
const PRECACHE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls
  if (e.request.url.includes('googleapis.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
