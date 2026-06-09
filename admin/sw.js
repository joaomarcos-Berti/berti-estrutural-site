// Service Worker — garante que admin/index.html sempre vem do servidor (sem cache)
const VERSION = 'berti-admin-v5';

self.addEventListener('install', e => {
  self.skipWaiting(); // ativa imediatamente
});

self.addEventListener('activate', e => {
  // apaga todos os caches antigos
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Para qualquer página dentro de /admin/, força busca no servidor
  if (url.pathname.startsWith('/admin/') && url.pathname.endsWith('.html') ||
      url.pathname === '/admin/' || url.pathname === '/admin') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match(e.request)) // offline fallback
    );
  }
});
