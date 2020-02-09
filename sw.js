// caching and serving static assets

const cacheName = 'pwa-conf-v1';
const staticAssests =  [
    './',
    './index.html',
    './app.js',
    './styles.css'
]
// The install event is called when a service worker is detected
self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    cache = await cache.addAll(staticAssests);
});

self.addEventListener('fetch', async event => {
 const req = event.request;
 // check if the request is of type json or contains the './json'
 if(/.*(json)$/.test(req.url)){
     event.respondWith(this.networkFirst(req))
 }else {
    event.respondWith(cacheFirst(req));
 }

 
})
// dynamic caching on what is requested during fetch event one by one
async function cacheFirst(req){
const cache = await caches.open(cacheName);
const cachedResponse =  await cache.match(req);

// this.networkFirst(req);
return cachedResponse || this.networkFirst(req);
}

async function networkFirst(req){
  
      const cache = caches.open(cacheName);
    try{
        const fresh = await fetch(req.url);
        (await cache).put(req, fresh.clone());
        return fresh;
    }catch(e){
     
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}

