importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

// https://developers.google.com/web/tools/workbox/modules/workbox-sw

if (workbox) {
  console.log('[sw] Workbox loaded');
  const local = location.host.includes('localhost');
  const debug = false;
  workbox.setConfig({ debug: debug && local ? true : false });

  // This will trigger the importScripts() for workbox.strategies and its dependencies:
  // workbox.loadModule('workbox-strategies');
  // const { registerRoute } = workbox.routing;
  // const {} = workbox.expiration;
  // const { CacheableResponse } = workbox.cacheableResponse;

  /**
   * Caching
   */
  // const { NetworkFirst } = workbox.strategies;

  // https://developers.google.com/web/tools/workbox/modules/workbox-recipes
  const { googleFontsCache, staticResourceCache, imageCache, warmStrategyCache, pageCache } = workbox.recipes;

  // * doesn't work when offline
  // const strategy = new NetworkFirst();
  // const urls = ['/index.html'];
  // warmStrategyCache({ urls, strategy });

  // ! caches all spa html pages - duplicates
  pageCache(); // network first - html page cache

  googleFontsCache(); // cache first

  staticResourceCache(); // stale while revalidate

  imageCache({ maxAgeSeconds: 1 * 24 * 60 * 60 }); // cache first - 1 day
}
