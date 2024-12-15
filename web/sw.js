const currentCacheVersion = 'v3'

const doNotCacheUrls = ['/api/is_admin', '/web/register-sw.js'];
const maybePutInCache = async (request, response) => {

  if (checkUrlIncludesPath(request.url, doNotCacheUrls)) {
    console.log('not caching', response);
    return;
  }

  const cache = await caches.open(currentCacheVersion);
  console.log('caching new response', response);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // Try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    maybePutInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {

    // Return from cache if server is unavailable
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      console.log('returned from cache: ', responseFromCache);
      return responseFromCache;
    }  

    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
    })
  );
});

const deleteCache = async (key) => {
  console.log('deleting cache', key);
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [currentCacheVersion];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

function checkUrlIncludesPath(url, paths) {
  for (const path of paths) {
    if (url.includes(path)) {
      return true;
    }
  }
  return false;
}