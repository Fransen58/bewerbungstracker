// Story 13: minimal service worker. Some browsers only offer to install a
// web app that has one. It caches nothing; the app needs a connection.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
