// Service Worker Registration Helper
// TODO: Llamar esta función en el layout principal cuando la app esté lista

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("[PWA] Service workers not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    console.log("[PWA] Service Worker registered:", registration.scope)

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New content available, notify user
            console.log("[PWA] New content available, please refresh")
            // TODO: Show toast notification to user
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("[PWA] Service Worker registration failed:", error)
    return null
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const success = await registration.unregister()
    console.log("[PWA] Service Worker unregistered:", success)
    return success
  } catch (error) {
    console.error("[PWA] Service Worker unregistration failed:", error)
    return false
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export function isPWAInstalled(): boolean {
  return isStandalone()
}
