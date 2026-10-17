// Versions-Nummer erhöht (v2), um alten Cache radikal zu löschen
const CACHE_NAME = 'mkk-dart-v4';
const ASSETS = [
  '/MKK-Spielbericht/',
  '/MKK-Spielbericht/index.html',
  '/MKK-Spielbericht/manifest.json'
];

// Installieren und sofort aktivieren ohne zu warten
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Alten, blockierenden Cache restlos entfernen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Netzwerk-Anfragen verarbeiten
self.addEventListener('fetch', event => {
  // Verhindert, dass der Service Worker GitHub-Raw-Anfragen blockiert
  if (event.request.url.includes('://githubusercontent.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
