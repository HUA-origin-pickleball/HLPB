(() => {const root=document.documentElement,intro=document.getElementById('hlpb-intro');if(!intro||!root.classList.contains('hlpb-intro-active'))return;setTimeout(()=>{intro.classList.add('is-leaving');try{sessionStorage.setItem('hlpb-intro-v2','1')}catch(e){}setTimeout(()=>{root.classList.remove('hlpb-intro-active');intro.remove()},420)},500)})();

(() => {
const base=new URL('../',document.currentScript.src);
const nav=document.querySelector('.footer-directory');
if(nav&&!nav.querySelector('[data-directory-link]')){const a=document.createElement('a');a.href=new URL('directory.html',base).href;a.dataset.directoryLink='true';a.textContent='完整網站導覽與使用方式 →';nav.querySelector('h2').after(a);}
const related=document.querySelector('nav[aria-label="花蓮匹克球相關單位"]');
if(related&&!related.querySelector('a[href="https://www.facebook.com/hucuorg/"]')){const a=document.createElement('a');a.href='https://www.facebook.com/hucuorg/';a.target='_blank';a.rel='noopener noreferrer';a.textContent='花蓮縣社區大學 Facebook ↗';related.querySelector('.footer-hint').before(a);}
})();
