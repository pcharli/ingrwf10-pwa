const version = 1.02

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

self.addEventListener('install', event => {
    console.log("Log from event 'INSTALL' in SW version " + version)
    return self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log("Log from event 'ACTIVATE' in SW version " + version)
    return self.clients.claim()
})



/* 
//simple fetch général for install btn 
//on écoute chaque requête
self.addEventListener('fetch', event => {
    const requestUrl = new URL(
        event.request.url
    )
})
*/

// définition d'un cache pour les assets
const CACHE = "assets"
const API_CACHE_NAME = "api"

workbox.precaching.precacheAndRoute([
    {
      "url": "index.html"
    },
    {
      "url": "about.html"
    },
    {
      "url" : "manifest.json"
    },
    {
      "url": "android-icon-96x96.png"
    },
    {
      "url": "main.js"
    },
   /* {
      "url": "https://api.irail.be/stations/?format=json"
    },*/
    {
        "url" : "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
    },
    {
        "url" : "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"
    }
  ])

workbox.routing.registerRoute(
    /(.*)\.(?:png|gif|jpg|css|js|ico)$/,
    new workbox.strategies.CacheFirst({
      cacheName: CACHE
    })
  );

  workbox.routing.registerRoute(
    "https://api.irail.be/stations/?format=json",
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      /*plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]*/
    })
  );