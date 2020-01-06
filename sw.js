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
    "revision": "8f45f6ea6029212a0d15f5b445d61f36"
  },
  {
    "url": "assets/map.json",
    "revision": "48b99f0b734e2f987348de14c6c6ead5"
  },
  {
    "url": "assets/zip.json",
    "revision": "2a387ea3268f1aadfffc0713af20f150"
  },
  {
    "url": "build/p-2l61exce.entry.js"
  },
  {
    "url": "build/p-3ea8955c.js"
  },
  {
    "url": "build/p-59290340.js"
  },
  {
    "url": "build/p-8zwjn2er.css"
  },
  {
    "url": "build/p-a7dc9574.js"
  },
  {
    "url": "build/p-c68d0961.js"
  },
  {
    "url": "manifest.json",
    "revision": "d0932e0c7b7588ad2e5786febc5c8889"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
