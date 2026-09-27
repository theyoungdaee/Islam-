// Quran Listen service worker v3
const APP_CACHE = 'quran-listen-app-v3';
const AUDIO_CACHE = 'quran-listen-audio-v2';

const CORE = [
  './', './index.html', './quran.html', './listen.html', './player.html',
  './tools.html', './bookmarks.html', './favorites.html', './settings.html',
  './privacy.html', './terms.html', './about.html', './contact.html',
  './css/style.css', './js/app.js', './js/quran.js', './js/audio.js',
  './js/tools.js', './js/settings.js', './data/surahs.json',
  './data/translations.json', './manifest.json', './assets/icons/icon.svg', './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => ![APP_CACHE, AUDIO_CACHE].includes(key))
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Let media requests go directly to the browser/network. Explicitly cached
  // audio can still be served from AUDIO_CACHE for offline playback.
  if (url.pathname.match(/\.(mp3|m4a|ogg|wav)$/i)) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(APP_CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        // Only navigation requests should fall back to the app shell.
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        throw new Error('Network request failed');
      });
    })
  );
});
