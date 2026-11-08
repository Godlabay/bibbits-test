const V='bibbits-duel-v12';
const CORE=['./','./index.html','./game.css','./game.js','./manifest.webmanifest','./icon-180.png','./icon-512.png','./img/board.webp','./img/card_frame.webp'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    const copy=res.clone();
    caches.open(V).then(c=>c.put(e.request,copy)).catch(()=>{});
    return res;
  }).catch(()=>caches.match('./index.html'))));
});
