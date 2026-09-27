document.addEventListener('DOMContentLoaded',()=>{
 const theme=document.getElementById('themeSelect'),font=document.getElementById('fontSize'),auto=document.getElementById('autoplay'),rep=document.getElementById('repeat');
 theme.value=QL.get('theme','system'); font.value=QL.get('fontSize',32); auto.checked=QL.get('autoplay',false); rep.checked=QL.get('repeat',false);
 theme.onchange=()=>{QL.set('theme',theme.value);document.documentElement.dataset.theme=theme.value;};
 font.oninput=()=>QL.set('fontSize',Number(font.value));
 auto.onchange=()=>QL.set('autoplay',auto.checked); rep.onchange=()=>QL.set('repeat',rep.checked);
 document.getElementById('clearData').onclick=()=>{if(confirm('Clear local Quran Listen data?')){localStorage.clear();location.reload();}};
 let deferred; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});
 document.getElementById('installBtn').onclick=async()=>{if(deferred){deferred.prompt();deferred=null;}else alert('Use your browser menu and choose Add to Home screen when available.');};
});