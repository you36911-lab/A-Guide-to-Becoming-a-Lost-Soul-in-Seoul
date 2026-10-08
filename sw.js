/* Service worker: makes the app installable and usable offline.
   Pages and app files are fetched fresh when online (so updates arrive right away)
   and served from the cache when offline. Bump VERSION when you change files. */
const VERSION = "lss-v38";
const CORE = [
  "./", "./index.html", "./styles.css", "./renderer.js", "./engine.js", "./curriculum.js",
  "./practice.js", "./curriculum-more.js", "./curriculum-edits.js", "./dictionary.js", "./hanja.js", "./deepdives.js", "./readings.js", "./voices.js",
  "./manifest.webmanifest", "./background.png", "./logo-mark.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon-32.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const appFile = sameOrigin && (req.mode === "navigate" || /\.(html|js|css|webmanifest)$/.test(url.pathname));
  if (appFile) {
    // network first: fresh files when online, cached copy when offline
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match("./index.html"))));
    return;
  }
  // everything else (images, fonts, dictionary details, recordings): cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok && (res.type === "basic" || res.type === "cors")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
