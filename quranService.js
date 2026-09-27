/* Local-first data service. Replace these functions with a server/API adapter later. */
const QuranService = {
  async getSurahs(){ const r=await fetch('./data/surahs.json'); if(!r.ok) throw new Error('Quran data unavailable'); return (await r.json()).surahs; },
  async getSurah(id){ return (await this.getSurahs()).find(s=>Number(s.id)===Number(id)) || null; },
  async getVerse(surahId, verseId){ const s=await this.getSurah(surahId); return s?.verses?.find(v=>Number(v.id)===Number(verseId)) || null; },
  async searchQuran(query){ const q=String(query||'').toLowerCase(); return (await this.getSurahs()).filter(s=>`${s.number} ${s.transliteration} ${s.englishName} ${s.arabicName}`.toLowerCase().includes(q)); },
  async getTranslations(){ const r=await fetch('./data/translations.json'); if(!r.ok) return {}; return r.json(); },
  async getAudio(surahId){ const s=await this.getSurah(surahId); return s?.audio || null; }
};
