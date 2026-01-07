// Service Worker for SoundBoardGo PWA
const CACHE_NAME = "soundboardgo-v2"
const STATIC_CACHE = "static-v2"
const DYNAMIC_CACHE = "dynamic-v2"

// Static assets to cache on install
const STATIC_ASSETS = ["/", "/main.png", "/ogimage.jpg", "/manifest.json"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Network first for API calls
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse))
          return response
        })
        .catch(() => caches.match(request))
        .catch(() => new Response("Network error", { status: 408 })),
    )
    return
  }

  // Network first for HTML pages to avoid stale content
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful HTML responses
          if (response && response.status === 200 && response.type === "basic") {
            const responseToCache = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache))
          }
          return response
        })
        .catch(() => caches.match(request))
        .catch(() => new Response("Offline", { status: 503 })),
    )
    return
  }

  // Cache first for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        const responseToCache = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache))

        return response
      })
    }),
  )
})
