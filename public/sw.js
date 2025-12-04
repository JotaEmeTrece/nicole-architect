// Nicole Architect - Service Worker for PWA
// This service worker implements app-shell caching for offline support

const CACHE_NAME = "nicole-architect-v1"
const OFFLINE_URL = "/offline"

// Assets to cache for app shell
const APP_SHELL_ASSETS = ["/", "/offline", "/manifest.webmanifest", "/icons/icon-192.jpg", "/icons/icon-512.jpg"]

// Routes to cache for offline access
const CACHE_ROUTES = [
  "/field/levantamientos",
  "/field/planos",
  "/field/checklists",
  "/studio/moodboards",
  "/studio/calculadoras",
  "/design/sunpath",
  "/settings",
]

// Install event - cache app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell assets")
      return cache.addAll(APP_SHELL_ASSETS)
    }),
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name)
            return caches.delete(name)
          }),
      )
    }),
  )
  // Take control immediately
  self.clients.claim()
})

// Fetch event - network first, fall back to cache
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // For navigation requests, use network-first strategy
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses for routes
          if (response.ok && CACHE_ROUTES.some((route) => url.pathname.startsWith(route))) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Try cache, then offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL)
          })
        }),
    )
    return
  }

  // For other requests (assets), use cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        event.waitUntil(
          fetch(request)
            .then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, response)
                })
              }
            })
            .catch(() => {
              // Network failed, that's okay - we have cache
            }),
        )
        return cachedResponse
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
    }),
  )
})

// Handle push notifications (future feature)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192.jpg",
      badge: "/icons/icon-192.jpg",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data.url
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

// Background sync for offline data (future feature)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-projects") {
    event.waitUntil(
      // TODO: Implement data sync when backend is ready
      Promise.resolve(),
    )
  }
})
