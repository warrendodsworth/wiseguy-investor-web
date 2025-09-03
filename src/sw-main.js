// can include both sw's combined, except when using workbox
// workbox caching conflicts with ngsw
// importScripts('ngsw-worker.js');

self.importScripts('firebase-messaging-sw.js');
self.importScripts('sw-workbox.js');
