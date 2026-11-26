// Hält die Klassen-Tools offline verfügbar. Lädt nur Dateien dieser Seite.
const CACHE = 'klassen-tools-e336d9ddf3';
const FILES = ["./", "index.html", "laermampel/", "laermampel/index.html", "laermampel/manifest.webmanifest", "laermampel/icon-180.png", "laermampel/icon-192.png", "laermampel/icon-512.png", "korallenriff/", "korallenriff/index.html", "korallenriff/manifest.webmanifest", "korallenriff/icon-180.png", "korallenriff/icon-192.png", "korallenriff/icon-512.png", "fluesterriff/", "fluesterriff/index.html", "fluesterriff/manifest.webmanifest", "fluesterriff/icon-180.png", "fluesterriff/icon-192.png", "fluesterriff/icon-512.png", "fluesterriff-realistisch/", "fluesterriff-realistisch/index.html", "fluesterriff-realistisch/manifest.webmanifest", "fluesterriff-realistisch/icon-180.png", "fluesterriff-realistisch/icon-192.png", "fluesterriff-realistisch/icon-512.png"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('klassen-tools-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const res = await net;
    return res || new Response('Offline und noch nicht gespeichert.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }));
});
