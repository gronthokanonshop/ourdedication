const CACHE = 'ourdedication-v4';
const SHELL = ['./index.html','./book.js','./books-live.js','./firebase-config.js','./book-placeholder.svg','./od-theme.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase/অন্য সাইটের ফাইল (বইয়ের কভার ছবি, ফন্ট, CDN) ক্যাশ/intercept করা হয় না — এগুলো জমে ফোনের স্টোরেজ ভরে ফেলত
  if(url.origin !== self.location.origin) return;
  // পেজগুলো (product.html?id=... ইত্যাদি) query ছাড়া একটা নামেই ক্যাশ হয় — প্রতিটা বইয়ের জন্য আলাদা কপি জমে না
  const key = req.mode === 'navigate' ? url.origin + url.pathname : req;
  e.respondWith(
    fetch(req).then(res => {
      if(res.ok && res.type === 'basic'){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.match(key)
      .then(cached => cached || (req.mode === 'navigate' ? caches.match('./index.html') : null))
      .then(r => r || Response.error()))
  );
});
