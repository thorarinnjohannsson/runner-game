const CACHE_NAME = 'animal-jump-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/ui.js',
  '/js/player.js',
  '/js/obstacle.js',
  '/js/background.js',
  '/js/audio.js',
  '/js/storage.js',
  '/js/zoom.js',
  '/js/level.js',
  '/js/themes.js',
  '/js/effects.js',
  '/js/transitions.js',
  '/js/analytics.js',
  '/js/supabase-client.js',
  '/js/player-stats.js',
  '/js/difficulty.js',
  '/favicon-wolfie.svg',
  '/og-image.png'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Serve cached content when offline, fetch fresh when online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch new
        if (response) {
          return response;
        }
        
        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it can only be used once
          const responseToCache = response.clone();
          
          // Cache the fetched resource for future use
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // If fetch fails (offline), return cached version or offline page
          return caches.match(event.request);
        });
      })
  );
});

// Clean up old caches when activating new service worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
