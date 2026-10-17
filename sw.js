const CACHE_NAME = 'mkk-dart-v5'; // Erhöht auf v5, damit alle Browser den alten Speicher löschen
const ASSETS = [
  '/MKK-Spielbericht/',
  '/MKK-Spielbericht/index.html',
  '/MKK-Spielbericht/manifest.json'
];

// Installieren und Assets in den Cache laden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Alten Cache löschen
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
    })
  );
  self.clients.claim();
});

// Anfragen verarbeiten
self.addEventListener('fetch', event => {
  // WICHTIG: Wenn nach der spieler.txt gefragt wird, GEHE IMMER DIREKT INS INTERNET!
  if (event.request.url.includes('spieler.txt')) {
    return; // Ignoriert den Cache komplett für diese Datei
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
