// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
    "/",
    "/add",
    "/plant",
    "/scripts/database/database.mjs",
    "/scripts/database/client_plants.mjs",
    "/scripts/database/synchronisation.mjs",
    "/scripts/create_plant_elements.mjs",
    "/scripts/fill_out_plant_page.mjs",
    "/scripts/filter.mjs",
    "/scripts/form_interactivity_common.mjs",
    "/scripts/form_submission.mjs",
    "/scripts/image_preview.mjs",
    "/scripts/index.js",
    "/scripts/list_plants.mjs",
    "/scripts/offline_status.mjs",
    "/scripts/search.mjs",
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
    "/manifest.json"
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
    let cacheMatchPattern = event.request;

    const url = event.request.url;
    const plantRegex = /.*\/plant\/.*/;
    if (plantRegex.test(url)) {
        const url_split = url.split("/");
        const shortened_url =  url.replace("/" + url_split[url_split.length - 1], "")
        cacheMatchPattern = shortened_url;
    }


    event.respondWith(
        caches.match(cacheMatchPattern).then(async (cachedResponse) => {
            try {
                const response = await fetch(event.request);

                if (!response.ok) {
                    //try and use cache
                    if (cachedResponse) {
                        console.log('Fetch intercepted for:', cachedResponse.url);
                        return cachedResponse;
                    } else {
                        console.log(`could not find item in cache: ${event.request.url}`)
                    }
                } else {
                    return response;
                }

            } catch (error) {
                console.log("There has been a problem with your fetch operation:");
                if (cachedResponse) {
                    console.log('Fetch intercepted for:', cachedResponse.url);
                    return cachedResponse;
                } else {
                    console.log(`could not find item in cache: ${event.request.url}`)
                }
            }
        }),
    );
});

