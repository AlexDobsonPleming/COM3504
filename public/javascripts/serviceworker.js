console.log('sw called');
self.addEventListener('install', (event ) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil(caches.open('core').then((cache ) => {
        cache.add(new Request('test.html')).then(() => {
            console.log('[Service Worker] : Cached test')
        });
    }));
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] : Fetching');
    const request = event.request;
    if (request.headers.get("Accept").includes("text/html")) {
        event.respondWith(
            fetch(request).then((response ) => {
                return response;
            }).catch(() => {
                return caches.match('test.html');
            }));
    }
});