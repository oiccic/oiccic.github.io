const CACHE_NAME = 'calcolatori-v3';
const FILES = [
    '/',
    '/index.html',
    '/margin-ITA.html',
    '/discount-ITA.html',
    '/alu-calc.html',
    '/manifest.json',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png'
];

// Installazione: metti tutto in cache
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
            .then(() => self.skipWaiting())
    );
});

// Attivazione: elimina cache vecchie
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: serve sempre dalla cache, rete solo se non trovato
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(cached => cached || fetch(e.request))
    );
});
