document.addEventListener('DOMContentLoaded',()=>{
 let n=QL.get('tasbih',0); const count=document.getElementById('count'); count.textContent=n;
 document.getElementById('tasbihAdd').onclick=()=>{n++;QL.set('tasbih',n);count.textContent=n;navigator.vibrate?.(15);};
 document.getElementById('tasbihReset').onclick=()=>{n=0;QL.set('tasbih',0);count.textContent=0;};
});