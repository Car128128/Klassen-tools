/* Offline-Speicher für Tastenlauf & Saitenlauf. Version wechselt automatisch bei jeder Änderung. */
const CACHE='musik-5797313981', FONTS='musik-fonts';
const FILES=["./", "index.html", "tastenlauf.html", "saitenlauf.html", "tastenlauf.webmanifest", "saitenlauf.webmanifest", "icons/tastenlauf-180.png", "icons/tastenlauf-192.png", "icons/tastenlauf-512.png", "icons/tastenlauf-maskable-512.png", "icons/saitenlauf-180.png", "icons/saitenlauf-192.png", "icons/saitenlauf-512.png", "icons/saitenlauf-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('musik-')&&k!==CACHE&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{c.put(r,res.clone());return res}))).catch(()=>new Response('',{status:504})));return;
  }
  if(u.origin!==location.origin)return;
  // erst aus dem Speicher (schnell, offline), im Hintergrund aktualisieren
  e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  })));
});
