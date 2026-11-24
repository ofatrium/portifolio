(()=>{
const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
const panel=document.querySelector('.mobile-menu');
const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
const openMenu=(state)=>{
 toggle?.setAttribute('aria-expanded',String(state));
 toggle?.setAttribute('aria-label',state?(document.documentElement.lang==='en'?'Close menu':document.documentElement.lang==='es'?'Cerrar menú':'Fechar menu'):(document.documentElement.lang==='en'?'Open menu':document.documentElement.lang==='es'?'Abrir menú':'Abrir menu'));
 panel?.classList.toggle('open',state);
 panel?.setAttribute('aria-hidden',String(!state));
 panel?.querySelectorAll('a').forEach(a=>{a.tabIndex=state?0:-1});
 header?.classList.toggle('menu-active',state);
 document.body.classList.toggle('menu-open',state);
};
openMenu(false);
toggle?.addEventListener('click',()=>openMenu(toggle.getAttribute('aria-expanded')!=='true'));
panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>openMenu(false)));
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){openMenu(false);toggle.focus()}});
const wide=window.matchMedia('(min-width:981px)');
const onWide=e=>{if(e.matches)openMenu(false)};
if(wide.addEventListener)wide.addEventListener('change',onWide);else wide.addListener(onWide);
const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
const hero=document.querySelector('.hero-media video');
if(hero){
 const stopForMotion=()=>{if(mq.matches)hero.pause();else if(!document.hidden)hero.play().catch(()=>{});}
 if(mq.addEventListener)mq.addEventListener('change',stopForMotion);else mq.addListener(stopForMotion);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.pause();else stopForMotion()});
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)hero.pause();else stopForMotion()}),{threshold:.08});io.observe(hero);
 }else stopForMotion();
}
if('IntersectionObserver' in window&&!mq.matches){
 const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');obs.unobserve(entry.target)}}),{threshold:.07,rootMargin:'0px 0px 80px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
const year=document.querySelector('[data-year]');if(year)year.textContent=String(new Date().getFullYear());
})();