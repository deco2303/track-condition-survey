const CACHE_NAME = 'track-survey-v1';
const OFFLINE_URL = 'track_survey.html';
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
  // add any other assets (e.g. CSS, additional JS files) here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches if you bump CACHE_NAME
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  // Always try network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(resp => resp || caches.match(OFFLINE_URL))
    )
  );
});
