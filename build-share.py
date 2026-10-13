import json,re,html,math,subprocess,datetime,collections
from pathlib import Path
from zoneinfo import ZoneInfo
from PIL import Image

ROOT=Path(__file__).parent
BASE='https://hlpb.com.tw/'
specs={
'index':('花蓮匹克球資訊站 HLPB｜找球場、揪打球與新手指南','在花蓮想打匹克球，從這裡找球場、參與方式、賽事消息、入門教學與器材知識。'),
'articles':('花蓮匹克球文章｜規則、技術與選拍知識','從基本規則到技術、戰術與選拍，依主題找到你需要的匹克球文章，也能收藏留著慢慢看。'),
'news':('花蓮匹克球最新消息｜新聞與活動資訊','查看花蓮匹克球新聞、在地推廣與活動消息，找日期、來源及參與方式。'),
'courts':('花蓮哪裡打匹克球？｜球場與使用資訊','查花蓮匹克球場的位置、設備、照明與使用提醒。出發前先確認使用資格和管理單位規定。'),
'groups':('花蓮匹克球揪打球｜找球友與臨打入口','從花蓮縣匹克球協會官方 LINE、PickleTown 等入口找球局，先確認時間、程度與報名方式。'),
'events':('花蓮匹克球賽事｜報名資訊與比賽紀錄','整理花蓮匹克球賽事的日期、地點、報名入口與注意事項，也保留已結束的比賽資訊。'),
'gear':('匹克球拍與器材｜重量、握把與厚度怎麼選','先認識球拍重量、握把、材質、厚度與拍型的差異，再挑需要的球、球網和配件。'),
'beginners':('第一次打匹克球？｜新手規則、分級與學習順序','認識基本玩法、發球、非截擊區與計分，透過程度參考、閱讀連結和小測驗找到下一步。'),
'about':('關於 HLPB｜原點匹克球為什麼建立花蓮資訊站','從花蓮推廣現場的常見問題出發，原點匹克球建立 HLPB，讓新手更容易找到下一次打球的資訊。'),
'directory':('HLPB 網站導覽｜想找什麼，從這裡開始','了解 HLPB 各頁面的用途，快速找到花蓮球場、球友、比賽、文章、器材與新手資訊。'),
'updates':('HLPB 更新日誌｜一路新增與改善的紀錄','從網站建立到現在，查看 HLPB 新增的文章、功能、場地資料及內容修正。')}

def meta(s,title,desc,url,img,size):
    s=re.sub(r'<title>.*?</title>','<title>'+html.escape(title)+'</title>',s,flags=re.S)
    keys={'description':desc,'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':desc,'twitter:image':img,'twitter:image:alt':title,'og:title':title,'og:description':desc,'og:url':url,'og:image':img,'og:image:secure_url':img,'og:image:type':'image/jpeg','og:image:width':str(size[0]),'og:image:height':str(size[1]),'og:image:alt':title}
    for key,value in keys.items():
        attr='property' if key.startswith('og:') else 'name'
        tag=f'<meta {attr}="{key}" content="{html.escape(value,quote=True)}"/>'
        pat=r'<meta\b(?=[^>]*(?:name|property)=["\']'+re.escape(key)+r'["\'])[^>]*>'
        if re.search(pat,s):s=re.sub(pat,lambda m:tag,s)
        else:s=s.replace('</head>',tag+'\n</head>')
    s=re.sub(r'<link\b(?=[^>]*rel=["\']canonical["\'])[^>]*>',f'<link rel="canonical" href="{html.escape(url,quote=True)}"/>',s)
    return re.sub(r'script.js\?v=[^"\s>]+','script.js?v=20261013-page-sharing',s)

inputs={key:str(ROOT/'assets/share'/(key+'-20261013.jpg')) for key in specs};sizes={}
folder=ROOT/'assets/share';folder.mkdir(exist_ok=True)
for key,path in inputs.items():
    im=Image.open(path).convert('RGB');sizes[key]=im.size
    if Path(path).resolve() != (folder/(key+'-20261013.jpg')).resolve():
        im.save(folder/(key+'-20261013.jpg'),quality=92,optimize=True)
for key,(title,desc) in specs.items():
    p=ROOT/(key+'.html');s=p.read_text();url=BASE if key=='index' else BASE+p.name
    p.write_text(meta(s,title,desc,url,BASE+'assets/share/'+key+'-20261013.jpg',sizes[key]))

script=(ROOT/'script.js').read_text();start=script.index('const fallback=')+len('const fallback=');data=json.JSONDecoder().raw_decode(script[start:])[0]
cats={c:i+1 for i,c in enumerate(sorted({a.get('category','其他文章') for a in data['articles']}))}
route_rows={};generated=[]
for kind,items in [('articles',data['articles']),('news',data['news'])]:
    groups=[('',items)]+([(c,[x for x in items if x.get('category')==c]) for c in cats] if kind=='articles' else [])
    for category,rows in groups:
        rows=sorted(rows,key=lambda x:x.get('date',''),reverse=True)
        for n in range(1,math.ceil(len(rows)/10)+1):
            name=(f'{kind}-topic-{cats[category]}' if category else kind)+(f'-page-{n}' if n>1 else '')+'.html'
            if not category and n==1:name=kind+'.html'
            label=(category+'文章' if category else ('花蓮匹克球文章' if kind=='articles' else '花蓮匹克球最新消息'))
            title=label+(f'｜第 {n} 頁' if n>1 else '')+'｜HLPB'
            titles=[x['title'] for x in rows[(n-1)*10:n*10]]
            desc=f'{label}'+(f'第 {n} 頁' if n>1 else '')+'，本頁收錄：'+'、'.join(titles[:3])+'。'
            route_rows[f'{kind}|{category}|{n}']={'url':BASE+name,'title':title,'description':desc,'image':BASE+'assets/share/'+kind+'-20261013.jpg'}
            if name==kind+'.html':continue
            s=(ROOT/(kind+'.html')).read_text()
            settings=f'<script>window.HLPB_LISTING_DEFAULTS={json.dumps({"page":n,"category":category},ensure_ascii=False)};</script>'
            s=s.replace('</head>',settings+'\n</head>')
            s=re.sub(r'<h1([^>]*)>.*?</h1>',lambda m:'<h1'+m[1]+'>'+html.escape(label+(f'：第 {n} 頁' if n>1 else ''))+'</h1>',s,count=1,flags=re.S)
            s=meta(s,title,desc,BASE+name,BASE+'assets/share/'+kind+'-20261013.jpg',sizes[kind])
            # Make the indexed portion readable even when JavaScript is unavailable.
            static=''.join('<article><h2><a href="/'+kind+'/'+html.escape(x.get('slug',''))+'.html">'+html.escape(x['title'])+'</a></h2><p>'+html.escape(x.get('summary',''))+'</p></article>' for x in rows[(n-1)*10:n*10])
            s=s.replace('</main>','<noscript>'+static+'</noscript></main>')
            (ROOT/name).write_text(s);generated.append(name)

bootstrap='''(function(){const routes=ROUTES;window.hlpbSyncListingShare=function(kind,page,category){let r=routes[kind+'|'+(category==='全部'?'':category||'')+'|'+page];if(!r)return;window.HLPB_PAGE_SHARE=r;document.title=r.title;for(const [key,value] of Object.entries({'og:title':r.title,'og:description':r.description,'og:url':r.url,'twitter:title':r.title,'twitter:description':r.description,'description':r.description})){let node=document.querySelector('meta[property="'+key+'"],meta[name="'+key+'"]');if(node)node.content=value}const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=r.url;const dest=new URL(r.url);const current=new URL(location.href);for(const [k,v] of current.searchParams)if(k!=='page'&&k!=='category'&&k!=='slug')dest.searchParams.set(k,v);history.replaceState(null,'',dest.pathname+dest.search+current.hash)};})();\n'''.replace('ROUTES',json.dumps(route_rows,ensure_ascii=False))
script=bootstrap+script
script=script.replace('new URLSearchParams(location.search).get("page"),10)||1','new URLSearchParams(location.search).get("page"),10)||window.HLPB_LISTING_DEFAULTS?.page||1')
script=script.replace('new URLSearchParams(location.search).get("category")','(new URLSearchParams(location.search).get("category")||window.HLPB_LISTING_DEFAULTS?.category)')
script=script.replace('["認識匹克球","新手規則","場地知識","球具入門","找球友","在地推廣"].includes(requestedArticleCategory)',json.dumps(list(cats),ensure_ascii=False)+'.includes(requestedArticleCategory)')
script=script.replace('articlePage=Math.min(articlePage,total);if(pager)','articlePage=Math.min(articlePage,total);window.hlpbSyncListingShare("articles",articlePage,articleFilter);if(pager)')
script=script.replace('newsPage=Math.min(newsPage,total);if(pager)','newsPage=Math.min(newsPage,total);window.hlpbSyncListingShare("news",newsPage,"");if(pager)')
old="  const title = 'HLPB 花蓮匹克球資訊站';\n  const text = '👀 想在花蓮打匹克球？這個網站分享給你！\\n查球場、找球友、看賽事，也有新手教學與器材知識。';\n  const url = 'https://hlpb.com.tw/';\n  share.addEventListener('click', async () => {"
new="  share.textContent='分享這個頁面 ↗';\n  share.addEventListener('click', async () => {\n    const title=window.HLPB_PAGE_SHARE?.title||document.querySelector('meta[property=\\\"og:title\\\"]')?.content||document.title;\n    const summary=window.HLPB_PAGE_SHARE?.description||document.querySelector('meta[name=\\\"description\\\"]')?.content||'';\n    const text='👀 這個匹克球頁面分享給你！\\n'+title+'\\n'+summary;\n    const url=window.HLPB_PAGE_SHARE?.url||document.querySelector('link[rel=canonical]')?.href||location.href;"
assert old in script
script=script.replace(old,new).replace("share.textContent = '分享網站給朋友 ↗'","share.textContent = '分享這個頁面 ↗'").replace("share.textContent = '已複製網站介紹與連結'","share.textContent = '已複製頁面介紹與連結'")
(ROOT/'script.js').write_text(script)

# Include shareable collection pages in sitemap, never replace article entries.
s=(ROOT/'sitemap.xml').read_text()
for name in generated:
    if BASE+name not in s:s=s.replace('</urlset>',f'<url><loc>{BASE+name}</loc><lastmod>2026-10-13</lastmod></url></urlset>')
(ROOT/'sitemap.xml').write_text(s)
(ROOT/'share-routes.json').write_text(json.dumps(route_rows,ensure_ascii=False,indent=2))
print(json.dumps({'page_covers':len(inputs),'static_collection_pages':len(generated),'routes':len(route_rows)},ensure_ascii=False))
