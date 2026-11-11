const CACHE = "ritter-v10";

const FILES = [
  "./", "index.html", "loader.html", "menu.html", "manifest.json",

  "assets/icon-rot.png", "assets/icon-gruen.png", "assets/icon-gelb.png",
  "assets/icon-blau.png", "assets/icon-pink.png",
  "assets/icon-snake.png", "assets/icon-tetris.png",
  "assets/icon-192.png", "assets/icon-512.png", "assets/Jost.ttf",

  "snake/", "snake/index.html", "snake/style.css", "snake/sketch.js",
  "snake/p5.js", "snake/p5.sound.min.js", "snake/icon.svg",
  "snake/schoki-dunkel.png", "snake/schoki-vollmilch.png", "snake/schoki-weiss.png",
  "snake/level-alpenmilch.svg", "snake/level-erdbeer.svg",
  "snake/level-haselnuss.svg", "snake/level-knusperflakes.svg",
  "snake/level-marzipan.svg",

  "tetris/", "tetris/index.html", "tetris/style.css", "tetris/sketch.js", "tetris/p5.js", 
  "tetris/icon.svg", 
  "tetris/schoki-dunkel.png", "tetris/schoki-vollmilch.png", "tetris/schoki-weiss.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(FILES.map(f => c.add(f).catch(() => console.warn("Nicht gecacht:", f))))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
