const CACHE_NAME = 'mkk-dart-v1';
const ASSETS = [
  '/MKK-Spielbericht/',
  '/MKK-Spielbericht/index.html',
  '/MKK-Spielbericht/spieler.txt',
  '/MKK-Spielbericht/manifest.json'
];

// Installieren des Service Workers und Cachen der Dateien
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Aktivieren und alte Caches löschen
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

// Netzwerk-Anfragen abfangen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Wenn es im Cache ist, gib es zurück, ansonsten lade es aus dem Netzwerk
      return cachedResponse || fetch(event.request);
    })
  );
});
