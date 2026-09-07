//This code is combined from the same google example And from a mozilla example:
//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#deleting_old_caches
const cacheName = 'cache-v3.0.1.1';
const precacheResources = ['/', 'index.html', 'tablaspruebas.css', 'code.js', 'favicon.ico'];

async function deleteCache(key) {
  await caches.delete(key);
};

async function deleteOldCaches() {
  const cacheKeepList = [cacheName];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches()).then(
  	(DummyVariable) => event.waitUntil(caches.open(cacheName).then
  		((cache) => cache.addAll(precacheResources))));
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
