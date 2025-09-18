const CACHE_NAME = 'maahad-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت الـ SW وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// تفعيل الـ SW وتنظيف الكاش القديم إن وجد
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// التعامل مع الطلبات: محاولة من الكاش أولا ثم الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
