importScripts("precache-manifest.cdf365d857bf032a71562c061a4337c8.js", "https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js");

// load static stuff from cache but also update cache
workbox.routing.registerRoute(
  /\.(?:html)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      // if we later want to add a notification to reload the page when a new version of the app is
      // there we can listen to this via `new BroadcastChannel('cache-update-index')`
      new workbox.broadcastUpdate.Plugin('cache-update-index')
    ]
  }),
);

workbox.routing.registerRoute(
  /\.(?:html)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      // if we later want to add a notification to reload the page when a new version of the app is
      // there we can listen to this via `new BroadcastChannel('cache-update-index')`
      new workbox.broadcastUpdate.Plugin('cache-update-index')
    ]
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css|png|gif|json)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'static-resources',
  }),
);


// cache the responses from have i been pwned indefinitely as they woun't update
workbox.routing.registerRoute(
  'https://api.pwnedpasswords.com/range/*',
  workbox.strategies.cacheFirst({
    cacheName: 'pwnedpasswords-range',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 1000
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  'https://api.pwnedpasswords.com/pwnedpassword/*',
  workbox.strategies.cacheFirst({
    cacheName: 'pwnedpasswords-passwords',
    plugins: [
      new workbox.expiration.Plugin({
        // only is a status code + number so we can cache a lot of these
        maxEntries: 10000
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [404, 200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  'https://media.giphy.com/*',
  workbox.strategies.cacheFirst({
    cacheName: 'gifs',
    plugins: [
      new workbox.expiration.Plugin({
        // only is a status code + number so we can cache a lot of these
        maxEntries: 100
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
  }),
);

// offline analytics
workbox.googleAnalytics.initialize();

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
