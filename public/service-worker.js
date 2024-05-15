// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
    "/",
    "/add",
    "/javascripts/database/database.mjs",
    "/javascripts/database/combined_plants.mjs",
    "/javascripts/database/queued_plants.mjs",
    "/javascripts/database/server_plants.mjs",
    "/javascripts/database/synchronisation.mjs",
    "/javascripts/create_plant_elements.mjs",
    "/javascripts/fill_out_plant_page.mjs",
    "/javascripts/filter.mjs",
    "/javascripts/form_interactivity_common.mjs",
    "/javascripts/form_submission.mjs",
    "/javascripts/image_preview.mjs",
    "/javascripts/index.js",
    "/javascripts/list_plants.mjs",
    "/javascripts/offline_status.mjs",
    "/javascripts/register_service_worker.mjs",
    "/javascripts/search.mjs",
    "/service-worker.js",
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
    "/API/plants"
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
    console.log('Fetch requested for for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(async (cachedResponse) => {
            try {
                const response = await fetch(event.request);

                if (!response.ok) {
                    tryUseCache(cachedResponse);
                } else {
                    return response;
                }

            } catch (error) {
                console.log("There has been a problem with your fetch operation:");
                return tryUseCache(cachedResponse);
            }
        }),
    );
});

function tryUseCache(cachedResponse) {
    if (cachedResponse) {
        console.log('Fetch intercepted for:', cachedResponse.url);
        return cachedResponse;
    } else {
        console.log("could not find item in cache")
    }
}
