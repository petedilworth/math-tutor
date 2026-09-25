/* Chalk and Paper – offline support.
   The app shell is cached so the site opens without signal. Live data is fetched fresh when it can be. */
const CACHE = "chalk-paper-v2";
const SHELL = ["./", "index.html", "app.css", "js/config.js", "js/content.js", "js/generators.js", "js/engine.js", "js/sync.js", "js/app.js", "share.html", "manifest.webmanifest", "icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return; /* API calls go straight to the network */
  /* live data: network first, cache as fallback */
  if (url.pathname.endsWith("/data/live.json")) {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  /* fonts and everything else: cache first, then network, and keep what we fetch */
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r && (r.status === 200 || r.type === "opaque")) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => hit)));
});
