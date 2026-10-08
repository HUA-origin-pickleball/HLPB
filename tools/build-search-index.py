from pathlib import Path
import re,json,html
r=Path(__file__).resolve().parents[1]
s=(r/'script.js').read_text(); data=json.JSONDecoder().raw_decode(s.split('const fallback=',1)[1])[0]
rows=[]
for folder,kind in [('articles','文章'),('news','消息'),('events','賽事')]:
 for p in sorted((r/folder).glob('*.html')):
  text=p.read_text(); title=re.search(r'<h1[^>]*>(.*?)</h1>',text,re.S)
  desc=re.search(r'<meta name="description" content="([^"]*)"',text)
  if not title: continue
  main=re.search(r'<main[^>]*>(.*?)</main>',text,re.S)
  body=html.unescape(re.sub('<[^>]+>',' ',main[1] if main else ''))
  rows.append(dict(title=html.unescape(re.sub('<[^>]+>','',title[1])),summary=html.unescape(desc[1]) if desc else '',text=' '.join(body.split()),url='/'+str(p.relative_to(r)),type=kind))
for x in data['courts']:
 rows.append(dict(title=x.get('name',''),summary=x.get('note',x.get('description','')),text=json.dumps(x,ensure_ascii=False),url='/courts.html',type='場地'))
for file,title in [('beginners.html','新手區'),('gear.html','匹克球拍與器材'),('groups.html','揪打球'),('about.html','關於 HLPB'),('directory.html','網站導覽')]:
 rows.append(dict(title=title,summary='查看 '+title+' 的資訊與使用方式',text=title,url='/'+file,type='頁面'))
(r/'search-index.json').write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
print('Indexed',len(rows),'items')
