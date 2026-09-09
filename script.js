(function(){
  "use strict";
  const fallback={
    slides:[{title:"花蓮打匹克球，從這裡開始。",subtitle:"找球場、揪打球、看比賽、學規則、買球具",buttonText:"先找球場",buttonUrl:"courts.html",imageUrl:"",alt:"花蓮匹克球首頁輪播圖"}],
    news:[{date:"2026-08-22",category:"網站公告",title:"HLPB 花蓮匹克球資訊站",summary:"花蓮球場、球局、賽事與新手資訊集中整理。",url:"articles.html"}],
    courts:[{area:"花蓮市",name:"中山公園網球／匹克球場",indoor:"戶外",courts:3,net:"需自備",lighting:"投幣式照明",fee:"依現場公告",hours:"單數日網球優先、偶數日匹克球優先",note:"共用場地，遇到人多時請互相協調並輪流上場。",mapUrl:"https://www.google.com/maps/search/?api=1&query=中山公園網球場+花蓮",imageUrl:""},{area:"花蓮市美崙",name:"大陳二村匹克球場",indoor:"戶外",courts:3,net:"固定式球網",lighting:"請依現場公告",fee:"依現場公告",hours:"請依現場管理規定",note:"若現場有工程、社區活動或管理公告，請依現場規定辦理。",mapUrl:"https://www.google.com/maps/search/?api=1&query=大陳二村活動中心",imageUrl:""}],
    events:[{status:"資訊確認中",date:"2026-09-19",name:"第一屆花東快速盃匹克球邀請賽",location:"花蓮縣玉里鎮藝文中心",summary:"組別、資格、費用及賽制請以主辦單位最新公告為準。",url:"",imageUrl:""}],
    gear:[{type:"球拍",title:"先從重量與握把開始",audience:"第一次買拍的人",points:"確認整體重量、揮重、握把周長及握把長度，再考慮表面與內芯。",note:"規格是參考，能實際試拍最好。",storeUrl:"https://hlopb.qdm.tw/"}],
    articles:[{id:"article-001",date:"2026-09-05",category:"新手入門",title:"第一次打匹克球，要準備什麼？",slug:"first-pickleball-checklist",summary:"球鞋、飲水和基本用品先準備好，球拍可以先借用，不用急著買。",content:"第一次打匹克球，先準備止滑且方便移動的運動鞋、飲用水、毛巾與防曬用品。\n\n如果還沒有球拍，可以先詢問球友或體驗活動是否能借用。剛開始先熟悉發球、雙彈規則、非截擊區與基本計分，比急著買齊裝備更重要。",author:"HLPB",seoDescription:"花蓮匹克球新手第一次上場需要準備的用品與基本注意事項。",ctaText:"找花蓮匹克球場",ctaUrl:"courts.html",editorialStatus:"待上線"}]
  };
  let data=fallback,slide=0,timer;
  const $=s=>document.querySelector(s);
  const safe=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const safeUrl=(v,f="#")=>{const raw=String(v||"").trim();if(!raw)return f;if(raw.startsWith("#")||/^[a-z0-9_\/-]+\.html(?:[?#].*)?$/i.test(raw))return raw;if(/^\/[a-z0-9_\/-]*$/i.test(raw))return raw==="/courts"?"courts.html":raw==="/about"?"articles.html":raw;try{const u=new URL(raw,location.href);return ["http:","https:"].includes(u.protocol)?u.href:f}catch{return f}};
  const fmt=v=>{if(!v)return "";const d=new Date(v);return Number.isNaN(d.valueOf())?safe(v):d.toLocaleDateString("zh-TW")};
  const imageStyle=v=>v?`style="background-image:url('${safeUrl(v).replace(/'/g,"%27")}')"`:"";
  function renderHero(){if(!$("#hero-title"))return;const x=data.slides[slide]||fallback.slides[0];$("#hero-title").innerHTML=safe(x.title).replace(/[，,]/,"，<br>");$("#hero-subtitle").textContent=x.subtitle||"";const label=x.buttonText==="開始探索"?"先找球場":x.buttonText;$("#hero-button").textContent=label||"先找球場";$("#hero-button").href=safeUrl(x.buttonUrl,"courts.html");$("#hero-image").style.backgroundImage=x.imageUrl?`url("${String(x.imageUrl).replace(/["\\]/g,"")}")`:"";$("#hero-image").setAttribute("aria-label",x.alt||x.alternativeText||"花蓮匹克球首頁輪播圖");$(".slide-controls").hidden=data.slides.length<2;$("#slide-count").textContent=`${slide+1} / ${data.slides.length}`}
  function renderNews(){if(!$("#news-list"))return;$("#news-list").innerHTML=data.news.slice(0,3).map(x=>`<a href="${safeUrl(x.url,"articles.html")}"><time>${fmt(x.date)}</time><span class="tag">${safe(x.category)}</span><div><h3>${safe(x.title)}</h3><p>${safe(x.summary)}</p></div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></a>`).join("")}
  function renderCourts(list=data.courts){if(!$("#court-list"))return;$("#court-list").innerHTML=list.map(x=>`<article class="card"><div class="card-image" role="img" aria-label="${safe(x.name)}照片" ${imageStyle(x.imageUrl)}></div><div class="card-body"><div class="tags"><span class="tag">${safe(x.area)}</span><span class="tag">${safe(x.indoor)}</span></div><h2>${safe(x.name)}</h2><dl class="facts"><div><dt>球場</dt><dd>${safe(x.courts)} 面</dd></div><div><dt>球網</dt><dd>${safe(x.net)}</dd></div><div><dt>照明</dt><dd>${safe(x.lighting)}</dd></div><div><dt>費用</dt><dd>${safe(x.fee)}</dd></div></dl><p>${safe(x.hours)}</p><p class="note">${safe(x.note)}</p><a class="text-link" href="${safeUrl(x.mapUrl)}" target="_blank" rel="noopener noreferrer">開啟地圖</a></div></article>`).join("");$("#court-empty").hidden=!!list.length}
  function renderEvents(){if(!$("#event-list"))return;$("#event-list").innerHTML=data.events.map(x=>`<article class="event"><div class="event-image" role="img" aria-label="${safe(x.name)}照片" ${imageStyle(x.imageUrl)}></div><div><span class="tag">${safe(x.status)}</span><h2>${safe(x.name)}</h2><p>${fmt(x.date)}｜${safe(x.location)}</p><p class="note">${safe(x.summary)}</p>${x.url?`<a class="text-link" href="${safeUrl(x.url)}" target="_blank" rel="noopener noreferrer">查看主辦單位公告</a>`:""}</div></article>`).join("")}
  function renderGear(){if(!$("#gear-list"))return;$("#gear-list").innerHTML=data.gear.map((x,i)=>`<article class="guide-card"><span class="tag">${String(i+1).padStart(2,"0")}｜${safe(x.type)}</span><h2>${safe(x.title)}</h2><p>${safe(x.audience)}</p><p>${safe(x.points)}</p><p class="note">${safe(x.note)}</p></article>`).join("");const link=$("#store-link");if(link)link.href=safeUrl(data.gear[0]?.storeUrl,"https://hlopb.qdm.tw/")}
  function articleBody(value){
    const lines=String(value||"").replace(/\\n/g,"\n").split(/\n/),out=[];let list=[];
    const flush=()=>{if(list.length){out.push(`<ul>${list.map(item=>`<li>${safe(item)}</li>`).join("")}</ul>`);list=[]}};
    lines.forEach(line=>{const text=line.trim();if(!text){flush();return}if(/^###\s+/.test(text)){flush();out.push(`<h3>${safe(text.replace(/^###\s+/,""))}</h3>`)}else if(/^##\s+/.test(text)){flush();out.push(`<h2>${safe(text.replace(/^##\s+/,""))}</h2>`)}else if(/^[-*]\s+/.test(text)){list.push(text.replace(/^[-*]\s+/,""))}else{flush();out.push(`<p>${safe(text)}</p>`)}});flush();return out.join("")
  }
  function renderArticles(){
    const list=$("#article-list"),detail=$("#article-detail");if(!list||!detail)return;
    const slug=new URLSearchParams(location.search).get("slug");
    if(!slug){detail.hidden=true;list.hidden=false;list.innerHTML=(data.articles||[]).map(x=>`<article class="guide-card article-card">${x.coverImageUrl?`<img src="${safeUrl(x.coverImageUrl)}" alt="${safe(x.coverImageAlt||x.title)}" loading="lazy">`:""}<div><span class="tag">${safe(x.category||"文章")}</span><time>${fmt(x.date)}</time><h2>${safe(x.title)}</h2><p>${safe(x.summary)}</p><a class="text-link" href="articles.html?slug=${encodeURIComponent(x.slug||x.id)}">閱讀文章</a></div></article>`).join("")||`<p class="empty">文章整理中。</p>`;return}
    const x=(data.articles||[]).find(item=>(item.slug||item.id)===slug);list.hidden=true;detail.hidden=false;
    if(!x){detail.innerHTML=`<h2>找不到這篇文章</h2><p>文章可能尚未公開或網址已更新。</p><a class="text-link" href="articles.html">返回文章列表</a>`;return}
    document.title=(x.seoTitle||x.title)+"｜HLPB";const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=x.seoDescription||x.summary||"";
    const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=`https://hlpb.com.tw/articles.html?slug=${encodeURIComponent(x.slug||x.id)}`;
    $("#articles-title").textContent=x.title;$("#articles-intro").textContent=x.summary||"";
    detail.innerHTML=`${x.coverImageUrl?`<img class="article-cover" src="${safeUrl(x.coverImageUrl)}" alt="${safe(x.coverImageAlt||x.title)}">`:""}<div class="article-meta"><span class="tag">${safe(x.category||"文章")}</span><time>發布：${fmt(x.date)}</time>${x.updatedDate?`<time>更新：${fmt(x.updatedDate)}</time>`:""}</div><div class="prose">${articleBody(x.content)}</div>${x.ctaText&&x.ctaUrl?`<a class="button outline" href="${safeUrl(x.ctaUrl)}">${safe(x.ctaText)}</a>`:""}${x.lastVerifiedDate?`<p class="article-source">最後查證：${fmt(x.lastVerifiedDate)}${x.sources?`｜資料來源：${safe(x.sources)}`:""}</p>`:""}`
  }
  function render(){renderHero();renderNews();renderCourts();renderEvents();renderGear();renderArticles()}
  function next(n){slide=(slide+n+data.slides.length)%data.slides.length;renderHero()}
  const menu=$(".menu-button");if(menu)menu.addEventListener("click",()=>{const open=$(".site-header").classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
  const prev=$("#slide-prev"),nextButton=$("#slide-next");if(prev)prev.addEventListener("click",()=>next(-1));if(nextButton)nextButton.addEventListener("click",()=>next(1));
  const search=$("#court-search");if(search)search.addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();renderCourts(q?data.courts.filter(x=>[x.name,x.area,x.indoor,x.net,x.lighting].join(" ").toLowerCase().includes(q)):data.courts)});
  render();
  if(window.HLPB_DATA_URL)fetch(window.HLPB_DATA_URL).then(r=>{if(!r.ok)throw Error("bad response");return r.json()}).then(v=>{data={...fallback,...v};slide=0;render();clearInterval(timer);if(data.slides.length>1)timer=setInterval(()=>next(1),6500)}).catch(()=>console.warn("HLPB 公開資料暫時無法讀取，已顯示內建資料。"));
})();
