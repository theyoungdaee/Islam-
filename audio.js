/* Quran Listen audio controller — local MP3 files only */
let audioEl=null;
let currentId=Number(new URLSearchParams(location.search).get('surah') || localStorage.getItem('currentSurah') || 1);
let surahs=[];
let repeat=false;

async function audioInit(){
  audioEl=document.getElementById('audio');
  if(!audioEl) return;
  try{ surahs=await loadSurahs(); }catch(err){ console.error(err); setStatus('Quran data could not be loaded.'); return; }

  audioEl.preload='metadata';
  audioEl.addEventListener('loadedmetadata',updateProgress);
  audioEl.addEventListener('durationchange',updateProgress);
  audioEl.addEventListener('timeupdate',updateProgress);
  audioEl.addEventListener('play',()=>setPlayButton(true));
  audioEl.addEventListener('pause',()=>setPlayButton(false));
  audioEl.addEventListener('waiting',()=>setStatus('Loading recitation…'));
  audioEl.addEventListener('playing',()=>setStatus('My Recitation'));
  audioEl.addEventListener('ended',handleEnded);
  audioEl.addEventListener('error',handleAudioError);

  document.getElementById('mainPlay')?.addEventListener('click',togglePlay);
  document.getElementById('prevBtn')?.addEventListener('click',()=>change(-1));
  document.getElementById('nextBtn')?.addEventListener('click',()=>change(1));
  document.getElementById('repeatBtn')?.addEventListener('click',toggleRepeat);
  document.getElementById('seek')?.addEventListener('input',seekAudio);
  document.getElementById('favoritePlayer')?.addEventListener('click',()=>toggleFav(currentId));
  document.getElementById('cachePlayer')?.addEventListener('click',cacheCurrent);
  document.getElementById('moreBtn')?.addEventListener('click',()=>alert('Audio options are kept simple in Version 1.'));

  repeat=Boolean(QL.get('repeat',false));
  document.getElementById('repeatBtn')?.classList.toggle('active',repeat);
  setCurrent(currentId,false);
}

function getCurrentSurah(){return surahs.find(s=>Number(s.id)===Number(currentId));}

function audioUrlFor(s){
  // Relative URLs are intentional: this works on both user sites and project sites.
  return new URL('./'+String(s.audio).replace(/^\.\//,''),document.baseURI).href;
}

function setCurrent(id,reset=true){
  const s=surahs.find(x=>Number(x.id)===Number(id));
  if(!s||!audioEl)return;
  currentId=Number(id);
  QL.set('currentSurah',currentId);
  audioEl.pause();
  audioEl.removeAttribute('src');
  audioEl.load();
  audioEl.src=audioUrlFor(s);
  if(reset) audioEl.currentTime=0;
  audioEl.load();
  document.getElementById('playerArabic')?.replaceChildren(document.createTextNode(s.arabicName));
  document.getElementById('playerTitle')?.replaceChildren(document.createTextNode(s.transliteration));
  setStatus('Ready to play');
  setPlayButton(false);
  updateProgress();
}

function togglePlay(){
  if(!audioEl)return;
  if(!audioEl.paused){audioEl.pause();return;}
  const s=getCurrentSurah();
  if(!s){setStatus('This Surah is unavailable.');return;}
  setStatus('Loading recitation…');
  const promise=audioEl.play();
  if(promise?.catch) promise.catch(err=>{
    console.error('Playback failed:',err);
    if(err.name==='NotSupportedError') setStatus('This MP3 cannot be played. Check the file.');
    else if(err.name==='NotAllowedError') setStatus('Tap Play to start the recitation.');
    else setStatus('Could not play the MP3. Check its filename and location.');
    setPlayButton(false);
  });
}

function change(dir){
  if(!surahs.length)return;
  let i=surahs.findIndex(s=>Number(s.id)===Number(currentId));
  i=(i+dir+surahs.length)%surahs.length;
  setCurrent(surahs[i].id,true);
  // Only autoplay after a user explicitly pressed Previous/Next.
  const p=audioEl?.play(); if(p?.catch)p.catch(()=>{});
}
function toggleRepeat(){repeat=!repeat;QL.set('repeat',repeat);document.getElementById('repeatBtn')?.classList.toggle('active',repeat);}
function handleEnded(){if(repeat){audioEl.currentTime=0;const p=audioEl.play();if(p?.catch)p.catch(()=>{});}else change(1);}
function seekAudio(e){if(!audioEl||!Number.isFinite(audioEl.duration)||audioEl.duration<=0)return;audioEl.currentTime=(Number(e.target.value)/100)*audioEl.duration;}
function updateProgress(){
  if(!audioEl)return;
  const pct=Number.isFinite(audioEl.duration)&&audioEl.duration>0?(audioEl.currentTime/audioEl.duration)*100:0;
  const seek=document.getElementById('seek'); if(seek)seek.value=String(pct);
  const c=document.getElementById('currentTime'); if(c)c.textContent=fmt(audioEl.currentTime);
  const d=document.getElementById('duration'); if(d)d.textContent=fmt(audioEl.duration);
}
function setPlayButton(playing){const b=document.getElementById('mainPlay');if(!b)return;b.textContent=playing?'❚❚':'▶';b.setAttribute('aria-label',playing?'Pause':'Play');}
function setStatus(t){const e=document.getElementById('playerStatus');if(e)e.textContent=t;}
function handleAudioError(){
  setPlayButton(false);
  const code=audioEl?.error?.code;
  if(code===MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED)setStatus('Audio file missing or unsupported. Check assets/audio and the filename.');
  else if(code===MediaError.MEDIA_ERR_NETWORK)setStatus('The MP3 could not be loaded. Check your connection.');
  else setStatus('Audio could not be loaded. Check that the MP3 exists.');
}
async function cacheCurrent(){
  const s=getCurrentSurah();if(!s)return;
  try{
    const url=audioUrlFor(s);
    const r=await fetch(url,{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const c=await caches.open('quran-listen-audio-v2');
    await c.put(url,r.clone());
    setStatus('Saved for offline listening.');
  }catch(err){console.error(err);setStatus('Could not save audio. Check that the MP3 exists.');}
}
function fmt(n){if(!Number.isFinite(n))return'00:00';return String(Math.floor(n/60)).padStart(2,'0')+':'+String(Math.floor(n%60)).padStart(2,'0');}

document.addEventListener('DOMContentLoaded',audioInit);
