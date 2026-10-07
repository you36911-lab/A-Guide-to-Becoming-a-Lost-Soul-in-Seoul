/* Service worker: makes the app installable and usable offline.
   Bump VERSION whenever you change any file so visitors get the update. */
const VERSION = "lss-v15";
const CORE = [
  "./", "./index.html", "./styles.css", "./renderer.js", "./engine.js", "./curriculum.js",
  "./practice.js", "./curriculum-more.js", "./dictionary.js", "./hanja.js", "./deepdives.js", "./readings.js", "./voices.js",
  "./manifest.webmanifest", "./background.png", "./butterfly1.png", "./butterfly2.png",
  "./icons/icon-192.png", "./logo-mark.png", "./icons/favicon-32.png", "./icons/icon-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// App files: cache first. Everything else (fonts, dictionary, recordings): network first, cached as it's used.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res.ok && (res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
