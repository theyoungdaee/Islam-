# Quran Listen — Audio Guide

Put your own recordings in `assets/audio/`.

## Version 1 filenames

- `001-al-fatihah.mp3`
- `018-al-kahf.mp3`
- `032-as-sajdah.mp3`
- `036-ya-sin.mp3`
- `055-ar-rahman.mp3`
- `056-al-waqiah.mp3`
- `067-al-mulk.mp3`
- `112-al-ikhlas.mp3`
- `113-al-falaq.mp3`
- `114-an-nas.mp3`

## Adding a future Surah

1. Put its audio file in `assets/audio/`.
2. Add a matching object to `data/surahs.json`.
3. Keep the relative `audio` path, for example:
   `assets/audio/002-al-baqarah.mp3`
4. Test playback on a phone.

## Supported format

MP3 is recommended for broad Android/browser compatibility. Use a sensible bitrate to keep mobile data and storage requirements reasonable.

## Important

Do not upload recordings you do not have permission to distribute. Do not use fake audio URLs. If an audio file is missing, the app should report the missing file instead of silently substituting another recording.

GitHub repositories have file-size and bandwidth considerations. For very large audio collections, use a storage/CDN arrangement that you are authorized to use.

## GitHub Pages audio check

After uploading an MP3, open its repository file and confirm the path is exactly:

`assets/audio/001-al-fatihah.mp3`

The filename and capitalization must match `data/surahs.json` exactly. Do not put the MP3 inside another folder.
