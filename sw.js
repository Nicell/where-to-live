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
    "revision": "f62a4c887b85e206d88c96e01b56f1a7"
  },
  {
    "url": "assets/map.json",
    "revision": "3afc33bb206cc9d919eb74ebcb6c4869"
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
    "url": "build/p-5e401567.js"
  },
  {
    "url": "build/p-fledo5pd.css"
  },
  {
    "url": "build/p-pivhkgyj.entry.js"
  },
  {
    "url": "manifest.json",
    "revision": "d0932e0c7b7588ad2e5786febc5c8889"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
