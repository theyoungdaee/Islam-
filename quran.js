let QL_SURAHS = [];
async function loadSurahs(){
  if(QL_SURAHS.length) return QL_SURAHS;
  const r=await fetch('./data/surahs.json', {cache:'no-store'}); const data=await r.json(); QL_SURAHS=data.surahs; return QL_SURAHS;
}
function surahCard(s){
  const favs=QL.get('favorites',[]);
  const isFav=favs.includes(s.id);
  return `<article class="surah-card">
    <div class="surah-num">${String(s.number).padStart(3,'0')}</div>
    <div class="surah-info"><div class="arabic-small">${QL.esc(s.arabicName)}</div><h3>${QL.esc(s.transliteration)}</h3><p>${QL.esc(s.englishName)} • ${s.verseCount} verses</p></div>
    <div class="card-actions">
      <button class="icon-btn small play-surah" data-id="${s.id}" aria-label="Play ${QL.esc(s.transliteration)}">▶</button>
      <button class="icon-btn small fav-surah ${isFav?'is-fav':''}" data-id="${s.id}" aria-label="Favorite">${isFav?'♥':'♡'}</button>
    </div>
  </article>`;
}
async function renderSurahs(filter=''){
  const el=document.getElementById('surahList') || document.getElementById('listenList') || document.getElementById('favoritesList') || document.getElementById('bookmarksList');
  if(!el) return;
  const all=await loadSurahs();
  if(el.id==='favoritesList'){
    const ids=QL.get('favorites',[]); const items=all.filter(s=>ids.includes(s.id));
    el.innerHTML=items.length?items.map(surahCard).join():'<div class="empty card">No favorite Surahs yet.</div>'; return;
  }
  if(el.id==='bookmarksList'){
    const marks=QL.get('bookmarks',[]);
    el.innerHTML=marks.length?marks.map(m=>`<article class="card"><span class="badge">${QL.esc(m.surahName||'Surah')}</span><h3>Ayah ${m.ayah}</h3><p>${QL.esc(m.note||'Saved reading position')}</p></article>`).join():'<div class="empty card">No bookmarks yet.</div>'; return;
  }
  const isListen=el.id==='listenList';
  const q=(filter||'').toLowerCase();
  const items=all.filter(s=>`${s.number} ${s.transliteration} ${s.englishName} ${s.arabicName}`.toLowerCase().includes(q));
  el.innerHTML=items.map(surahCard).join();
  el.querySelectorAll('.play-surah').forEach(b=>b.onclick=()=>{ localStorage.setItem('currentSurah',b.dataset.id); location.href='./player.html?surah='+encodeURIComponent(b.dataset.id); });
  el.querySelectorAll('.fav-surah').forEach(b=>b.onclick=()=>toggleFav(Number(b.dataset.id)));
}
function toggleFav(id){
  let a=QL.get('favorites',[]); a=a.includes(id)?a.filter(x=>x!==id):[...a,id]; QL.set('favorites',a); renderSurahs(document.getElementById('surahSearch')?.value||'');
}
document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('surahList')){renderSurahs();document.getElementById('surahSearch').oninput=e=>renderSurahs(e.target.value);}
  if(document.getElementById('listenList')) renderSurahs();
  if(document.getElementById('favoritesList')) renderSurahs();
  if(document.getElementById('bookmarksList')) renderSurahs();
});