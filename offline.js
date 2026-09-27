const OFFLINE_CACHE='quran-listen-audio-v2';
async function isCached(url){try{const c=await caches.open(OFFLINE_CACHE);return Boolean(await c.match(url));}catch{return false;}}
