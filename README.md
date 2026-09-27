# Quran Listen

Quran Listen is a mobile-first Quran reading and listening PWA.

## Version 1

Version 1 intentionally starts with 10 Surahs:

1. Al-Fatihah
2. Al-Kahf
3. As-Sajdah
4. Ya-Sin
5. Ar-Rahman
6. Al-Waqi'ah
7. Al-Mulk
8. Al-Ikhlas
9. Al-Falaq
10. An-Nas

The interface is data-driven so future Surahs can be added by extending `data/surahs.json` and adding the corresponding audio file.

## Features

- Quran reading architecture
- Local recitations
- Audio player
- Favorites
- Bookmarks
- Local storage
- Tasbih
- PWA installation
- Service worker
- Offline shell
- Privacy, Terms, About and Contact pages
- No account required in Version 1
- No advertising or subscriptions in Version 1

## Local testing

A service worker normally requires HTTPS or localhost. Do not rely on opening the HTML files directly with `file://`.

One simple option is a local static server, for example:

`python -m http.server 8000`

Then open:

`http://localhost:8000/`

## GitHub Pages

Upload the project to a repository and enable GitHub Pages for the appropriate branch/folder. Because the app uses relative paths, it is suitable for a project Pages site.

## Audio

Place your recordings in `assets/audio/`. See `AUDIO_README.md`.

## Quran data

`data/surahs.json` contains metadata and is deliberately prepared for expansion. The included `verses` arrays are empty placeholders in this starter build. Before public release, supply verified Quranic text from a trusted/licensed source and document the exact source/license in the attribution section.

## Translation

`data/translations.json` is a placeholder. Do not publish a translation dataset without confirming its license/permission.

## Attribution

Before public release, record the exact sources and licenses for Quran text, translation, Arabic font, icons and any third-party libraries actually used.

## Privacy

Version 1 is designed around local storage. Read `privacy.html` before release and update it if the implementation changes.

## Contact

abdulsammedtakiyudeen@gmail.com

## Future roadmap

- Surahs 11–114
- More translations
- More reciters
- Tafsir
- Juz/Hizb
- Advanced search
- Prayer times
- Qiblah
- Hijri calendar
- Reminders
- Optional synchronization

## Audio playback checklist

For each recording, place the MP3 in `assets/audio/` using the exact filename in `data/surahs.json`. The player resolves these paths relative to the page, so it works when deployed under a GitHub Pages project path. Audio is loaded only when a Surah is selected and Play is pressed.

If Play does not start:
1. Confirm the MP3 filename matches exactly, including spelling and `.mp3`.
2. Confirm the file is actually committed to GitHub under `assets/audio/`.
3. Open the deployed audio file path directly to confirm GitHub Pages serves it.
4. Refresh after a new deployment so the updated service worker is installed.
5. Use MP3 audio encoded in a browser-supported format; the player reports a clear error if the source is missing or unsupported.

## IMPORTANT: GitHub Pages upload

Upload the **contents inside `quran-listen/`** to the root of the GitHub Pages publishing source. Do not upload the `quran-listen` folder as an extra outer folder if `index.html` is already expected at the publishing root.

The final repository root should look like:

```text
index.html
css/
js/
data/
assets/
manifest.json
service-worker.js
.nojekyll
```

If the site shows plain Times New Roman/default HTML styling, the browser is loading `index.html` but **`css/style.css` is not being served**. Check that `css/style.css` exists at exactly that path (GitHub paths are case-sensitive), then hard-refresh the site or clear the old service-worker cache.

GitHub Pages project sites are served under `https://OWNER.github.io/REPOSITORY/`, so the app intentionally uses relative `./` paths instead of assuming the site is at the domain root.
