var CACHE = 'sw-cache';

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE).then(function(cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/script/app.js',
            '/style/style.css',
            '/icon.png'
        ]);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request));
  });

  function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    });
  }

  function update(request) {
    return caches.open(CACHE).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  }
  