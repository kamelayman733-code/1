const CACHE_NAME = "seyran-v3";

const FILES = [
    "./",
    "./index.html",
    "./manifest.json",

    "./css/variables.css",
    "./css/reset.css",
    "./css/header.css",
    "./css/layout.css",
    "./css/sidebar.css",
    "./css/chat.css",
    "./css/input-area.css",
    "./css/send-button.css",
    "./css/messages.css",
    "./css/textarea.css",
    "./css/buttons.css",
    "./css/icons.css",
    "./css/history.css",
    "./css/responsive.css",
    "./css/dark-mode.css",

    "./IMG/seyran_exact_pink_palette_icon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        const copy = response.clone();

                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, copy);
                        });

                        return response;
                    })
                    .catch(() => {
                        return caches.match("./index.html");
                    });
            })
    );
});