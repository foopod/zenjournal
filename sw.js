self.addEventListener('install', function(event) {
    console.log("cache make");
    event.waitUntil(
      caches.open('sw-cache').then(function(cache) {
          console.log("made");
        return cache.addAll([
            '/',
            '/#menu',
            '/index.html',
            '/script/app.js',
            '/style/style.css',
            '/icon.png'
        ]);
      })
    );
  });
   
  self.addEventListener('fetch', function(event) {
    console.log("cache fetch");
    console.log(event.request);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });