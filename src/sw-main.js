// Note: Do not import 'ngsw-worker.js' when using Workbox for caching,
// as Workbox caching conflicts with Angular Service Worker (ngsw).
// self.importScripts('ngsw-worker.js');

self.importScripts('firebase-messaging-sw.js');
self.importScripts('sw-workbox.js');
