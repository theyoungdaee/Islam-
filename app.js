/* Quran Listen shared app utilities */
(function(){
  const QL = window.QL = {
    get(key, fallback=null){ try { const v=localStorage.getItem(key); return v===null?fallback:JSON.parse(v); } catch { return fallback; } },
    set(key,value){ try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
    del(key){ try { localStorage.removeItem(key); } catch {} },
    esc(s){ return String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  };

  function setTheme(){
    const pref=QL.get('theme','system');
    const dark=pref==='dark' || (pref==='system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme=dark?'dark':'light';
  }
  setTheme();
  window.addEventListener('storage',setTheme);
  window.addEventListener('online',()=>document.body.classList.remove('offline'));
  window.addEventListener('offline',()=>document.body.classList.add('offline'));
  if(!navigator.onLine) document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('offline'));

  if('serviceWorker' in navigator && location.protocol !== 'file:'){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(err=>console.warn('Service worker:',err)));
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const home=document.getElementById('homePlayBtn');
    if(home) home.addEventListener('click',()=>{
      const id=QL.get('currentSurah',1);
      location.href='./player.html?surah='+encodeURIComponent(id);
    });
  });
})();
