const CACHE_NAME = 'track-survey-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    fetch(evt.request)
      .catch(() => caches.match(evt.request).then(r => r || caches.match('index.html')))
  );
});
