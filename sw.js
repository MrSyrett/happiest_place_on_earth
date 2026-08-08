/* Offline cache for Ropedrop Run.

   index.html carries React, the game and the font, so caching the shell plus the
   map and icons is everything the app needs.

   IMPORTANT: the page itself is network-FIRST. A cache-first shell meant a newly
   uploaded index.html could never reach a device that had already visited — it
   would keep serving the old build forever. */
const CACHE = "ropedrop-run-v4";
const SHELL = ["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png",
               "map.jpg", "map.jpeg", "map.png", "map.webp"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) =>
    // add individually: a missing map file must not fail the whole install
    Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))
  ).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// network first, falling back to cache — used for the page and the map
const fresh = (req, fallback) =>
  fetch(req).then((res) => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (fallback ? caches.match(fallback) : undefined)));

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const path = new URL(e.request.url).pathname;

  // the page: always try for a newer build, fall back to cache when offline
  if (e.request.mode === "navigate" || /(^\/$|index\.html$)/.test(path)) {
    e.respondWith(fresh(e.request, "index.html"));
    return;
  }
  // the map comes from the repo and may be replaced
  if (/map\.(jpg|jpeg|png|webp)$/i.test(path)) {
    e.respondWith(fresh(e.request));
    return;
  }
  // icons and the manifest rarely change: cache first is fine
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)
      .then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match("index.html")))
  );
});
