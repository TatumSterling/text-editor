// Import necessary modules from Workbox
const { registerRoute } = require('workbox-routing');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const {precacheAndRoute} = require('workbox-precaching')
// Define cache names
const staticAssetsCacheName = 'static-assets-cache';

// Precache and route static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache static assets using CacheFirst strategy
const staticAssetsCache = new CacheFirst({
  cacheName: staticAssetsCacheName,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    }),
  ],
});

// Cache images using StaleWhileRevalidate strategy
const imageCache = new StaleWhileRevalidate({
  cacheName: 'image-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

// Register routes for different types of assets
registerRoute(
  // Cache images using the imageCache strategy
  ({ request }) => request.destination === 'image',
  imageCache
);

registerRoute(
  // Cache stylesheets, scripts, and other static assets using the staticAssetsCache strategy
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  staticAssetsCache
);
