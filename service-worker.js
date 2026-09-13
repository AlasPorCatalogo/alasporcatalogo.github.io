//This code is combined from the same google example And from a mozilla example:
//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#deleting_old_caches
const cacheName = 'cache-v3.0.1.10';
const precacheResources = ['/', 'index.html', 'Fechas15.html', 'tablaspruebas.css', 'code.js', 'favicon.ico'];

async function deleteCache(key) {
	await caches.delete(key);
};

async function deleteOldCaches() {
	const cacheKeepList = [cacheName];
	const keyList = await caches.keys();
	const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
	console.log("deleting old caches", cachesToDelete);
	await Promise.all(cachesToDelete.map(deleteCache));
}

function cleanResponse(response) {
  const clonedResponse = response.clone();

  // Not all browsers support the Response.body stream, so fall back to reading
  // the entire body into memory as a blob.
  const bodyPromise = 'body' in clonedResponse ?
    Promise.resolve(clonedResponse.body) :
    clonedResponse.blob();

  return bodyPromise.then((body) => {
    // new Response() is happy when passed either a stream or a Blob.
    return new Response(body, {
      headers: clonedResponse.headers,
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
    });
  });
}

self.addEventListener('install', (event) => {
	console.log('Service worker install event!');
	event.waitUntil(caches.open(cacheName).then((cache) => {
		precacheResources.forEach(url => {
			fetch(url).then((response) => {
				if (!response.ok) {
					throw new TypeError("bad response status");
				}
				let CRV;
				cleanResponse(response).then(CR => {
					CRV = CR;
				});
				cache.put(url, CR);
			});
		})
	}));
});

self.addEventListener("activate", (event) => {
	event.waitUntil(deleteOldCaches());
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
