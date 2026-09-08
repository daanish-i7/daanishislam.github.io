(() => {
 const button=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-menu'),close=menu.querySelector('.menu-close');
 const mobile=matchMedia('(max-width:900px)');
 function reset(){button.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
 function dismiss(){menu.close();reset()}
 button.addEventListener('click',()=>{menu.showModal();button.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');close.focus()});
 close.addEventListener('click',dismiss);menu.addEventListener('close',reset);
 menu.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...menu.querySelectorAll('button,a[href]')],first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
 menu.addEventListener('click',e=>{if(e.target===menu){const b=menu.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dismiss()}});
 menu.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const target=document.querySelector(a.hash);dismiss();if(target){history.replaceState(null,'',a.hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}}));
 mobile.addEventListener('change',()=>{if(!mobile.matches&&menu.open)dismiss()});
})();
