const ApiDex = "api-dex-v1";
const assets = [
  "/",
  "/index.html",
  "/pokemon.html",
  "/css/style.css",
  "/css/sidebar.css",
  "/css/navbar.css",
  "/css/switch.css",
  "/css/var.css",
  "/js/main.js",
  "/js/functions.js",
  "/assets/img/moon.png",
  "/assets/img/sun.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(ApiDex).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
