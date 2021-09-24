const cachNameToKeep="hafi#v16";
const contentToCache = [
  './',
  './img/144.png',
  './img/192.png',
  './img/512.png',
  './img/favi.png',
  './img/logo.png',
  './img/no-internet-connection.png',
];

// Installing Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cachNameToKeep).then((cache) => {
      return cache.addAll(contentToCache);
    })
  );
});
// Fetching content using Service Worker
self.addEventListener("fetch", (e) => {
  console.log('updating Cache...')
  e.respondWith(
    caches.match(e.request).then((resp) => {
      return resp || fetch(e.request).then((response) => {
        let responseClone = response.clone();
        caches.open(cachNameToKeep).then((cache) => {
        cache.put(e.request, responseClone);
        });

        return response;
      }).catch(() => {
        return caches.match('./static/img/no-internet-connection.png');
      });
    })
  );
});
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
      self.skipWaiting();
  }
});
self.addEventListener('activate', (event) => {
  const cacheKeeplist = [cachNameToKeep];

  event.waitUntil(
    caches.keys().then((keyList) => {
      console.log(keyList)
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log("removed",key,"rest is:",cacheKeeplist)
          return caches.delete(key);
        }
      }));
    })
  )
});



