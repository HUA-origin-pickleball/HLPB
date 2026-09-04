(function(){
  "use strict";
  const fallback={
    slides:[{id:"hero-01",title:"花蓮打匹克球，從這裡開始。",subtitle:"找球場、揪打球、看比賽、學規則、買球具",buttonText:"開始探索",buttonUrl:"#explore",imageUrl:""}],
    news:[{id:"news-001",date:"2026-08-22",category:"網站公告",title:"HLPB 花蓮匹克球資訊站",summary:"把花蓮球場、球局、賽事與新手資訊集中整理。",url:"#news"}],
    courts:[{id:"court-001",area:"花蓮市",name:"中山公園網球／匹克球場",indoor:"戶外",courts:3,net:"需自備",lighting:"投幣式照明",fee:"依現場公告",hours:"單數日網球優先、偶數日匹克球優先",note:"共用場地，遇到人多時請互相協調並輪流上場。",mapUrl:"https://www.google.com/maps/search/?api=1&query=中山公園網球場+花蓮",imageUrl:""},{id:"court-002",area:"花蓮市美崙",name:"大陳二村匹克球場",indoor:"戶外",courts:3,net:"固定式球網",lighting:"請依現場公告",fee:"依現場公告",hours:"請依現場管理規定",note:"若現場有工程、社區活動或管理公告，請依現場規定辦理。",mapUrl:"https://www.google.com/maps/search/?api=1&query=大陳二村活動中心",imageUrl:""}],
    groups:[],events:[{id:"event-001",status:"資訊確認中",date:"2026-09-19",name:"第一屆花東快速盃匹克球邀請賽",location:"花蓮縣玉里鎮藝文中心",summary:"組別、資格、費用及賽制請以主辦單位最新公告為準。",url:"",imageUrl:""}],
    gear:[{id:"gear-001",type:"球拍",title:"先從重量與握把開始",audience:"第一次買拍的人",points:"確認整體重量、揮重、握把周長及握把長度，再考慮表面與內芯。",note:"規格是參考，能實際試拍最好。",linkText:"前往原點匹克球商店",storeUrl:"https://hlopb.qdm.tw/"}]
  };
  let data=fallback,slide=0,timer;
  const $=(s)=>document.querySelector(s);
  const safe=(v)=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const url=(v,fallbackUrl="#")=>{const raw=String(v||"").trim();if(/^\/[a-z0-9_-]+\/?$/i.test(raw))return "#"+raw.replaceAll("/","");try{const u=new URL(raw,location.href);return ["http:","https:"].includes(u.protocol)||raw.startsWith("#")?u.href:fallbackUrl}catch{return fallbackUrl}};
  const imageStyle=(v)=>v?`style="background-image:url('${safe(v).replace(/'/g,"%27")}')"`:"";
  const fmt=(v)=>{if(!v)return "";const d=new Date(v);return Number.isNaN(d.valueOf())?safe(v):d.toLocaleDateString("zh-TW")};

  function renderHero(){const x=data.slides[slide]||fallback.slides[0];$("#hero-title").innerHTML=safe(x.title).replace(/[，,]/,"，<br>");$("#hero-subtitle").textContent=x.subtitle||"";$("#hero-button").textContent=(x.buttonText||"開始探索")+" →";$("#hero-button").href=url(x.buttonUrl,"#explore");$("#hero-image").style.backgroundImage=x.imageUrl?`url("${String(x.imageUrl).replace(/["\\]/g,"")}")`:"";$("#hero-image span").hidden=!!x.imageUrl;$("#slide-count").textContent=`${slide+1} / ${data.slides.length}`}
  function renderNews(){$("#news-list").innerHTML=data.news.slice(0,3).map((x,i)=>`<a href="${url(x.url,"#news")}"><b>0${i+1}</b><time>${fmt(x.date)}</time><em>${safe(x.category)}</em><div><h3>${safe(x.title)}</h3><p>${safe(x.summary)}</p></div><span>→</span></a>`).join("")}
  function renderCourts(list=data.courts){$("#court-list").innerHTML=list.map(x=>`<article class="card"><div class="card-image" ${imageStyle(x.imageUrl)}>${x.imageUrl?"":"場地圖片"}</div><div class="card-body"><div class="tags"><span class="tag">${safe(x.area)}</span><span class="tag">${safe(x.indoor)}</span></div><h3>${safe(x.name)}</h3><dl><div><dt>球場</dt><dd>${safe(x.courts)} 面</dd></div><div><dt>球網</dt><dd>${safe(x.net)}</dd></div><div><dt>照明</dt><dd>${safe(x.lighting)}</dd></div><div><dt>費用</dt><dd>${safe(x.fee)}</dd></div></dl><p>${safe(x.hours)}</p><small>${safe(x.note)}</small><a class="text-link" href="${url(x.mapUrl)}" target="_blank" rel="noopener noreferrer">開啟地圖 →</a></div></article>`).join("");$("#court-empty").hidden=!!list.length}
  function renderGroups(){const box=$("#group-list");box.innerHTML=data.groups.length?data.groups.map(x=>`<article class="group-item"><span class="tag">${safe(x.status)}</span><h3>${safe(x.name)}</h3><p>${fmt(x.date)} ${safe(x.startTime)}－${safe(x.endTime)}｜${safe(x.location)}</p><p>${safe(x.level)}｜剩餘 ${safe(x.remaining)} 名</p><a class="text-link" href="${url(x.signupUrl,"https://pipibro.com/")}" target="_blank" rel="noopener noreferrer">我要報名 →</a></article>`).join(""):`<div class="empty"><strong>目前沒有公開球局</strong><span>新增並啟用試算表資料後會顯示在這裡。</span></div>`}
  function renderEvents(){$("#event-list").innerHTML=data.events.map(x=>`<article class="event"><div class="card-image" ${imageStyle(x.imageUrl)}>${x.imageUrl?"":"賽事圖片"}</div><div><em>${safe(x.status)}</em><h3>${safe(x.name)}</h3><p>${fmt(x.date)}｜${safe(x.location)}</p><small>${safe(x.summary)}</small>${x.url?`<br><a class="text-link" href="${url(x.url)}" target="_blank" rel="noopener noreferrer">查看公告 →</a>`:""}</div></article>`).join("")}
  function renderGear(){$("#gear-list").innerHTML=data.gear.map((x,i)=>`<article class="check"><b>0${i+1}｜${safe(x.type)}</b><h3>${safe(x.title)}</h3><p>${safe(x.audience)}</p><p>${safe(x.points)}</p><small>${safe(x.note)}</small></article>`).join("")+`<a href="${url(data.gear[0]?.storeUrl,"https://hlopb.qdm.tw/")}" target="_blank" rel="noopener noreferrer">看完建議，再逛原點匹克球商店 <span>→</span></a>`}
  function render(){renderHero();renderNews();renderCourts();renderGroups();renderEvents();renderGear()}
  function next(n){slide=(slide+n+data.slides.length)%data.slides.length;renderHero()}
  function autoplay(){clearInterval(timer);if(data.slides.length>1)timer=setInterval(()=>next(1),6500)}
  $("#slide-prev").addEventListener("click",()=>next(-1));$("#slide-next").addEventListener("click",()=>next(1));
  $("#court-search").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();renderCourts(q?data.courts.filter(x=>[x.name,x.area,x.indoor,x.net,x.lighting].join(" ").toLowerCase().includes(q)):data.courts)});
  $(".menu-button").addEventListener("click",e=>{const open=$(".header").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(open));e.currentTarget.textContent=open?"×":"☰"});
  $(".header nav").addEventListener("click",()=>$(".header").classList.remove("open"));
  render();
  if(window.HLPB_DATA_URL){fetch(window.HLPB_DATA_URL).then(r=>{if(!r.ok)throw Error();return r.json()}).then(v=>{data={...fallback,...v};slide=0;render();autoplay()}).catch(()=>console.warn("HLPB 試算表讀取失敗，已使用內建資料。"))}
})();
