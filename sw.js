const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';

const assets = [
    '/',
    '/index.html',
    'index.js',
    '/index.css',

    '/fallback.html'
];
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', evt => {

    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => {
                    console.log(key)
                    return caches.delete(key)
                })
            );
        })
    );
});

self.addEventListener('fetch', evt => {
    console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    // check cached items size
                    limitCacheSize(dynamicCacheName, 15);
                    return fetchRes;
                })
            });
        }).catch(() => {
            return caches.match('fallback.html');
            // if (evt.request.url.indexOf('.html') > -1) {
            //     return caches.match('fallback.html');
            // }
        })
    );
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    clients.openWindow('http://www.google.com');
    notification.close()
})
self.addEventListener('push', function (event) {
    console.log(event.data)
    if (event.data) {

        var options = {
            body: 'Here is a notification body!',
            icon: 'images/avatar.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore', title: 'Explore this new world',
                    icon: 'images/check.svg'
                },
                {
                    action: 'close', title: 'Close notification',
                    icon: 'images/pwaLabs.svg'
                },
            ]
        }
        self.registration.showNotification(event.data.text(), options)



    } else {
        console.log('Push event but no data')
    }
})
