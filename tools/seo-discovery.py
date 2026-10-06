"""Refresh crawlable list HTML from the same published source used by the site."""
import json,re,html
from pathlib import Path
import xml.etree.ElementTree as ET
p=Path('.')
source=(p/'script.js').read_text()
data=json.loads(re.search(r'const fallback=(.*?);\n',source).group(1))
esc=lambda s:html.escape(str(s or ''),quote=True)
def replace_slot(file,start,end,body):
 s=file.read_text();a=f'<!-- {start} -->';b=f'<!-- {end} -->'
 assert a in s and b in s
 file.write_text(s[:s.index(a)]+a+body+b+s[s.index(b)+len(b):])
def card(x,kind):
 image=x.get('coverImageUrl') if kind=='articles' else x.get('imageUrl')
 visual=f'<img src="{esc(image)}" alt="{esc(x.get("coverImageAlt",x["title"]))}" loading="lazy" width="1672" height="941">' if image else f'<div class="editorial-cover" aria-hidden="true"><span class="cover-kicker">{esc(x["category"])}</span><strong class="cover-title">{esc(x["title"])}</strong></div>'
 date=x.get('eventDate') if kind=='news' else None
 if kind=='news' and not date:
  found=re.search(r'(\d{1,2})/(\d{1,2})',x['title'])
  if found:date=f'2026-{int(found[1]):02}-{int(found[2]):02}'
 stamp=date or x.get('updatedDate',x['date'])
 label='活動日期：' if date else '更新：'
 return f'<article class="guide-card article-card {"has-photo" if image else "has-editorial-cover"}" data-article-category="{esc(x["category"])}">{visual}<div><span class="tag article-tag">{esc(x["category"])}</span><time datetime="{esc(stamp)}">{label}{esc(stamp)}</time><h2>{esc(x["title"])}</h2><p>{esc(x["summary"])}</p><a class="text-link" href="{kind}/{esc(x["slug"])}.html">{"閱讀文章" if kind=="articles" else "查看完整資訊"}</a></div></article>'
articles=sorted(data['articles'],key=lambda x:x['date'],reverse=True)
for kind,id in [('articles','article-list'),('news','news-page-list')]:
 file=p/f'{kind}.html';s=file.read_text();a=kind.upper()+'_STATIC_START';b=kind.upper()+'_STATIC_END'
 if f'<!-- {a} -->' not in s:
  s=s.replace(f'<div id="{id}" class="article-list" aria-live="polite"></div>',f'<div id="{id}" class="article-list" aria-live="polite"><!-- {a} --><!-- {b} --></div>')
  file.write_text(s)
 items=articles if kind=='articles' else data['news']
 replace_slot(file,a,b,''.join(card(x,kind) for x in (items[:10] if kind=='articles' else items)))
 # A genuine reader-facing subject directory makes every published article reachable.
 if kind=='articles':
  directory='<section class="article-topic-directory" aria-labelledby="topic-directory-title"><h2 id="topic-directory-title">依主題找文章</h2><div>'
  for cat in ['認識匹克球','新手規則','場地知識','找球友','球具入門','在地推廣']:
   entries=[x for x in articles if x['category']==cat]
   directory+=f'<details><summary>{cat}（{len(entries)} 篇）</summary><ul>'+''.join(f'<li><a href="articles/{esc(x["slug"])}.html">{esc(x["title"])}</a></li>' for x in entries)+'</ul></details>'
  directory+='</div></section>'
  s=file.read_text();s=re.sub(r'<section class="article-topic-directory"[\s\S]*?</section>','',s)
  s=s.replace('<noscript><p class="empty">請開啟瀏覽器的 JavaScript 以讀取最新文章。</p></noscript>',directory+'<noscript><p>可直接閱讀上方文章，或從主題目錄選擇其他文章。</p></noscript>')
  if directory not in s:s=s.replace('</main>',directory+'</main>')
  file.write_text(s)
 # ItemList describes actual linked articles, not search rankings.
 s=file.read_text();schema={'@context':'https://schema.org','@type':'ItemList','itemListElement':[{'@type':'ListItem','position':i+1,'name':x['title'],'url':f'https://hlpb.com.tw/{kind}/{x["slug"]}.html'} for i,x in enumerate(items)]}
 s=re.sub(r'<script id="listing-schema" type="application/ld\+json">[\s\S]*?</script>','',s)
 s=s.replace('</head>','<script id="listing-schema" type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')+'</script></head>')
 file.write_text(s)
for x in articles:
 file=p/'articles'/f'{x["slug"]}.html';s=file.read_text()
 similar=[y for y in articles if y['slug']!=x['slug'] and y['category']==x['category']][:3]
 related='<nav class="related-reading" aria-label="延伸閱讀"><h2>延伸閱讀</h2><ul>'+''.join(f'<li><a href="{esc(y["slug"])}.html">{esc(y["title"])}</a></li>' for y in similar)+'</ul><a class="text-link" href="../articles.html">查看所有匹克球文章</a></nav>'
 s=re.sub(r'<nav class="related-reading"[\s\S]*?</nav>','',s)
 s=s.replace('</article></main>',related+'</article></main>')
 file.write_text(s)
print(f'Static discovery: {len(articles)} article links and {len(data["news"])} news links.')
