const CACHE_NAME = 'calcolatori-sepia-v2'; // INCREMENTA QUESTO NUMERO AD OGNI UPDATE
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

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// SOSTITUISCI IL VECCHIO FETCH CON QUESTO
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(e.request).then(cachedResponse => {
                const fetchedResponse = fetch(e.request).then(networkResponse => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchedResponse;
            });
        })
    );
});