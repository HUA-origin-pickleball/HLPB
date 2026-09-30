// Generate readable HTML detail pages from the verified fallback content in script.js?v=20260930g.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('script.js?v=20260930g','utf8');
const data=vm.runInNewContext('('+source.split('const fallback=')[1].split('\n  let data=')[0].replace(/;\s*$/,'')+')',{window:{HLPB_GROUPS:[]}});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=u=>{if(/^(https?:\/\/|(?:\.\.\/)?[a-z-]+\.html(?:\?slug=[a-z0-9-]+)?$)/i.test(u)){if(u.startsWith('http'))return u;const m=u.match(/^(?:\.\.\/)?(articles|news)\.html\?slug=([a-z0-9-]+)$/);return m?`../${m[1]}/${m[2]}.html`:`../${u.replace(/^\.\.\//,'')}`;}return '#'};
const inline=s=>String(s).split(/(\[[^\]]+\]\([^)]+\))/g).map(part=>{const match=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(match)return `<a href="${esc(link(match[2]))}"${match[2].startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${esc(match[1])}</a>`;return esc(part).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}).join('');
function body(s){let out='',list=[];const flush=()=>{if(list.length){out+=`<ul>${list.map(x=>`<li>${inline(x)}</li>`).join('')}</ul>`;list=[]}};for(const raw of String(s||'').split('\n')){const t=raw.trim();if(!t){flush();continue}if(t.startsWith('## ')){flush();out+=`<h2>${inline(t.slice(3))}</h2>`}else if(t.startsWith('### ')){flush();out+=`<h3>${inline(t.slice(4))}</h3>`}else if(t.startsWith('- ')){list.push(t.slice(2))}else{flush();out+=`<p>${inline(t)}</p>`}}flush();return out}
const nav=[['首頁','index.html'],['最新消息','news.html'],['找球場','courts.html'],['揪打球','groups.html'],['想參賽','events.html'],['新手區','beginners.html'],['買球具','gear.html'],['看文章','articles.html']];
let sitemap=readFileSync('sitemap.xml','utf8');
for(const [type,items] of [['articles',data.articles],['news',data.news]]){
 mkdirSync(type,{recursive:true});
 for(const x of items){if(!x.slug)continue;const uri=`https://hlpb.com.tw/${type}/${x.slug}.html`, title=x.seoTitle||x.title, pageTitle=title.endsWith('｜HLPB')?`${title.slice(0,-5)}｜花蓮匹克球資訊站`:title.includes('花蓮匹克球資訊站')?title:`${title}｜花蓮匹克球資訊站`, description=x.seoDescription||x.summary, image=x.coverImageUrl||x.imageUrl||'assets/hlpb-logo.png', imageUrl=`https://hlpb.com.tw/${image}`, date=x.updatedDate||x.date, kind=type==='news'?'NewsArticle':'Article';const json=JSON.stringify({'@context':'https://schema.org','@type':kind,headline:x.title,description,datePublished:x.date,dateModified:date,inLanguage:'zh-Hant',mainEntityOfPage:uri,author:{'@type':'Organization',name:'HLPB 花蓮匹克球資訊站'},publisher:{'@type':'Organization',name:'HLPB 花蓮匹克球資訊站',logo:{'@type':'ImageObject',url:'https://hlpb.com.tw/assets/hlpb-logo.png'}},...(image!=='assets/hlpb-logo.png'?{image:imageUrl}:{})}).replace(/</g,'\\u003c');const html=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${uri}"><meta property="og:type" content="article"><meta property="og:locale" content="zh_TW"><meta property="og:site_name" content="花蓮匹克球資訊站"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${uri}"><meta property="og:image" content="${imageUrl}"><meta property="article:published_time" content="${esc(x.date)}"><meta property="article:modified_time" content="${esc(date)}"><meta name="twitter:card" content="summary"><link rel="icon" href="../assets/hlpb-logo.png" type="image/png"><link rel="stylesheet" href="../style.css?v=20260930g"><script type="application/ld+json">${json}</script></head><body><header class="site-header"><a class="brand" href="../index.html" aria-label="HLPB 首頁"><img src="../assets/hlpb-logo.png" alt=""><b>花蓮匹克球資訊站</b></a><button class="menu-button" type="button" aria-label="開啟選單" aria-expanded="false"><span></span><span></span><span></span></button><nav aria-label="主要選單">${nav.map(([name,path])=>`<a href="../${path}"${path===`${type}.html`?' class="active"':''}>${name}</a>`).join('')}</nav></header><main><section class="page-hero"><div class="page-title"><a class="detail-back" href="../${type}.html">← ${type==='news'?'最新消息':'文章列表'}</a><h1>${esc(x.title)}</h1><p>${esc(x.summary)}</p></div></section><article class="content article-detail">${image!=='assets/hlpb-logo.png'?`<img class="article-cover" src="../${esc(image)}" alt="${esc(x.coverImageAlt||x.title)}">`:''}<div class="article-meta"><span class="tag">${esc(x.category||'資訊')}</span><time datetime="${esc(x.date)}">發布：${esc(x.date)}</time>${x.updatedDate?`<time datetime="${esc(x.updatedDate)}">更新：${esc(x.updatedDate)}</time>`:''}</div><div class="prose">${body(x.content||x.summary)}</div>${x.ctaText&&x.ctaUrl?`<a class="button outline" href="${esc(link(x.ctaUrl))}">${esc(x.ctaText)}</a>`:''}<p class="article-source">${x.lastVerifiedDate?`最後查證：${esc(x.lastVerifiedDate)}｜`:''}資料來源：${esc(x.sources||'HLPB 整理資訊')}</p><a class="text-link" href="../${type}.html">返回${type==='news'?'最新消息':'文章列表'}</a></article></main><footer class="site-footer">
  <div class="footer-main">
    <div class="footer-about">
      <a class="brand" href="../index.html" aria-label="花蓮匹克球資訊站首頁"><img src="../assets/hlpb-logo.png" alt=""><b>花蓮匹克球資訊站</b></a>
      <p>整理花蓮球場、球局、賽事與入門知識，讓想打球的人更容易找到正確資訊。</p>
      <p>本站由原點匹克球管理與維護。發現資料有誤，或想提供活動、場地與球局資訊，可透過<a class="footer-inline-link" href="https://line.me/ti/p/~@591lqpnj" target="_blank" rel="noopener noreferrer">官方 LINE 聯絡我們</a>。</p>
    </div>
    <nav class="footer-nav" aria-label="網站導覽"><h2>網站導覽</h2>
      <a href="../news.html">最新消息</a><a href="../courts.html">找球場</a><a href="../groups.html">揪打球</a><a href="../events.html">想參賽</a><a href="../beginners.html">新手區</a><a href="../articles.html">看文章</a>
    </nav>
    <nav class="footer-nav" aria-label="花蓮匹克球相關單位"><h2>花蓮相關單位</h2>
      <a href="https://www.facebook.com/HLPickleball" target="_blank" rel="noopener noreferrer">花蓮縣匹克球協會 Facebook ↗</a>
      <a href="https://www.facebook.com/people/%E8%8A%B1%E8%93%AE%E7%B8%A3%E9%AB%94%E8%82%B2%E6%9C%83%E5%8C%B9%E5%85%8B%E7%90%83%E5%A7%94%E5%93%A1%E6%9C%83/61593497999944/" target="_blank" rel="noopener noreferrer">花蓮縣體育會匹克球委員會 Facebook ↗</a>
      <p class="footer-hint">以上為各單位對外頁面，HLPB 並非其官方網站。</p>
    </nav>
    <nav class="footer-nav" aria-label="原點匹克球相關連結"><h2>原點匹克球</h2>
      <a href="https://www.facebook.com/people/%E5%8E%9F%E9%BB%9E%E5%8C%B9%E5%85%8B%E7%90%83/61586647553875/" target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href="https://www.instagram.com/origin.pickleball" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://line.me/ti/p/~@591lqpnj" target="_blank" rel="noopener noreferrer">LINE 官方帳號 ↗</a><a href="https://hlopb.com/" target="_blank" rel="noopener noreferrer">原點匹克球官網 ↗</a>
    </nav>
  </div>
  <div class="footer-bottom"><p>本站彙整公開資訊與球友提供內容，並非場館或賽事主辦單位公告。場地開放、費用及報名方式請以管理單位或主辦單位最新資訊為準。</p><small>© 2026 HLPB 花蓮匹克球資訊站</small></div>
</footer><script src="../script.js?v=20260930g" defer></script></body></html>`;writeFileSync(`${type}/${x.slug}.html`,html);const old=`https://hlpb.com.tw/${type}.html?slug=${x.slug}`;sitemap=sitemap.replace(`<loc>${old}</loc>`,`<loc>${uri}</loc>`);if(!sitemap.includes(`<loc>${uri}</loc>`))sitemap=sitemap.replace('</urlset>',`  <url><loc>${uri}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);
  // Keep the verified Huilan tournament schema when news detail pages are regenerated.
  if(type==='news'&&x.slug==='huilan-cup-pickleball-2026'){
    const event={'@context':'https://schema.org','@type':'SportsEvent',name:'115 年花蓮縣「洄瀾盃」綜合體育嘉年華競賽－匹克球項目',startDate:'2026-11-08',location:{'@type':'Place',name:'花蓮縣立中正體育館'},url:uri};
    const file=`${type}/${x.slug}.html`;
    writeFileSync(file,readFileSync(file,'utf8').replace('</head>',`<script type="application/ld+json">${JSON.stringify(event)}</script></head>`));
  }

 }
}
sitemap=sitemap.replace(/(<loc>https:\/\/hlpb\.com\.tw\/<\/loc>\s*<lastmod>)[^<]+/,'$12026-09-29');
writeFileSync('sitemap.xml',sitemap);

// Keep the key local listings readable in the source HTML before JavaScript loads.
const updateSnapshot=(file,start,end,html)=>{
 const original=readFileSync(file,'utf8');
 const pattern=new RegExp(`<!-- ${start} -->[\\s\\S]*?<!-- ${end} -->`);
 if(!pattern.test(original))throw Error(`Missing snapshot markers in ${file}`);
 writeFileSync(file,original.replace(pattern,`<!-- ${start} -->${html}<!-- ${end} -->`));
};
const facts=x=>[['球場',x.courts?`${x.courts} 面`:''],['球網',x.net],['照明',x.lighting],['費用',x.fee]].filter(([,value])=>value).map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('');
updateSnapshot('courts.html','COURT_STATIC_START','COURT_STATIC_END',data.courts.map(x=>`<article class="card"><div class="card-image" ${x.imageUrl?`style="background-image:url('${esc(x.imageUrl)}')"`:''} role="img" aria-label="${esc(x.name)}場地照片"></div><div class="card-body"><div class="tags"><span class="tag">${esc(x.area)}</span><span class="tag">${esc(x.indoor)}</span></div><h2>${esc(x.name)}</h2>${x.address?`<p class="court-address">${esc(x.address)}</p>`:''}<dl class="facts">${facts(x)}</dl>${x.hours?`<p>${esc(x.hours)}</p>`:''}${x.note?`<p class="note">${esc(x.note.replace(/【合作場館資訊】/g,'').split('｜')[0])}</p>`:''}<a class="text-link" href="${esc(x.mapUrl)}" target="_blank" rel="noopener noreferrer">開啟地圖</a></div></article>`).join(''));
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const upcoming=data.events.filter(x=>x.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
const past=data.events.filter(x=>x.date<today).sort((a,b)=>b.date.localeCompare(a.date));
const eventCard=x=>`<article class="event">${x.imageUrl?`<a class="event-poster" href="${esc(x.imageUrl)}" target="_blank" rel="noopener noreferrer" aria-label="放大檢視${esc(x.name)}海報"><img src="${esc(x.imageUrl)}" alt="${esc(x.name)}活動海報" loading="lazy"></a>`:'<div class="event-image" aria-hidden="true"></div>'}<div><span class="tag">${esc(x.status)}</span><h2>${esc(x.name)}</h2><p><time datetime="${esc(x.date)}">${esc(x.date)}</time>${x.endDate?`–<time datetime="${esc(x.endDate)}">${esc(x.endDate)}</time>`:''}${x.time?` ${esc(x.time)}`:''}｜${esc(x.location)}</p><p class="note">${esc(x.summary)}</p>${x.detailUrl?`<a class="text-link event-detail-link" href="${esc(x.detailUrl)}">查看賽事整理</a>`:''}${x.url?`<a class="text-link" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.linkText||'查看活動來源')}</a>`:''}</div></article>`;
updateSnapshot('events.html','EVENT_STATIC_START','EVENT_STATIC_END',upcoming.map(eventCard).join('')+(past.length?`<details class="past-events"><summary>查看已結束活動</summary><div>${past.map(eventCard).join('')}</div></details>`:''));
