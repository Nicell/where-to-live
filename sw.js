/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "0aa1248d0821112bd4fed180599222fb"
  },
  {
    "url": "assets/map.json",
    "revision": "02091e6a8e32726d6e7eb54c2d2c294d"
  },
  {
    "url": "assets/zip.json",
    "revision": "2a387ea3268f1aadfffc0713af20f150"
  },
  {
    "url": "build/p-3ea8955c.js"
  },
  {
    "url": "build/p-59290340.js"
  },
  {
    "url": "build/p-a7dc9574.js"
  },
  {
    "url": "build/p-c68d0961.js"
  },
  {
    "url": "build/p-fledo5pd.css"
  },
  {
    "url": "build/p-ruwholeh.entry.js"
  },
  {
    "url": "manifest.json",
    "revision": "d0932e0c7b7588ad2e5786febc5c8889"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
