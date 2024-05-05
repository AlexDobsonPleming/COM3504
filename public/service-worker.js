// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
    "/",
    "/add",
    "/javascripts/create_plant_elements.mjs",
    "/javascripts/database.mjs",
    "/javascripts/fill_out_plant_page.mjs",
    "/javascripts/filter.mjs",
    "/javascripts/image_preview.mjs",
    "/javascripts/index.js",
    "/javascripts/list_plants.mjs",
    "/javascripts/search.mjs",
    "/stylesheets/style.css",
    "/stylesheets/style2.css",
    "/images/background.jpg",
    "/images/cactus.jpeg",
    "/images/favicon.png",
    "/images/favicon512.png",
    "/images/plant.png",
    "/images/header-background.jpg",
    "/images/plant-image.png",
    "/images/potted-plants.png",
    "/manifest.json",
    "/API/plants",
    "/service-worker.js"
];


// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});
