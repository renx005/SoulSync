
// Cache version
const CACHE_NAME = 'soulsync-cache-v2';

// Files to cache - include app assets
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/heart-icon-192x192.png',
  '/icons/heart-icon-512x512.png',
  '/placeholder.svg'
];

// Install service worker and cache required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(filesToCache);
      })
  );
  self.skipWaiting(); // Ensure new service worker activates immediately
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// Fetch strategy: Network first, then cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // For navigation requests, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Return error for other requests
            throw new Error('Network and cache both failed');
          });
      })
  );
});
