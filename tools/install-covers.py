"""Install reviewed illustrations and keep API data from removing their metadata."""
import json,re,html
from pathlib import Path
from PIL import Image

root=Path('.')
entries=json.load(open('../review-entries.json'))
paths=json.load(open('../qa-paths.json'))
assert len(paths)==30
source=(root/'script.js').read_text()
match=re.search(r'const fallback=(.*?);\n',source)
data=json.loads(match.group(1))
for item,path in zip(entries,paths):
 assert item['slug']==path['slug']
 group='gear' if item['slug'].startswith('gear-') else 'articles'
 url=f'assets/{group}/{item["slug"]}.webp'
 target=root/url;target.parent.mkdir(exist_ok=True)
 Image.open(path['path']).convert('RGB').save(target,'WEBP',quality=87,method=6)
 if group=='articles':
  record=next(x for x in data['articles'] if x['slug']==item['slug'])
  record.update(coverImageUrl=url,coverImageAlt=item['title']+'｜HLPB 主題插圖')
 else:
  record=data['gear'][int(item['slug'][-2:])-1]
  record.update(imageUrl=url,imageAlt=item['title']+'｜匹克球器材選購插圖')
source=source[:match.start(1)]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+source[match.end(1):]
source=source.replace('<article class="guide-card"><span class="tag">${String(i+1)', '<article class="guide-card">${x.imageUrl?`<img class="gear-illustration" src="${safeUrl(x.imageUrl)}" alt="${safe(x.imageAlt||x.title)}" width="1672" height="941" loading="lazy">`:""}<span class="tag">${String(i+1)')
source=source.replace('fallback.articles.find(y=>y.slug===x.slug):x)', 'fallback.articles.find(y=>y.slug===x.slug):({...x,...(()=>{const local=fallback.articles.find(y=>y.slug===x.slug);return local?{coverImageUrl:local.coverImageUrl,coverImageAlt:local.coverImageAlt}:{}})()}))')
source=source.replace('fallback.gear.map(x=>(Array.isArray(v.gear)?v.gear:[]).find(y=>y.title===x.title)||x)', 'fallback.gear.map(x=>{const y=(Array.isArray(v.gear)?v.gear:[]).find(y=>y.title===x.title);return y?{...y,imageUrl:x.imageUrl,imageAlt:x.imageAlt}:x})')
(root/'script.js').write_text(source)
esc=lambda s:html.escape(str(s),quote=True)
cards=''.join(f'<article class="guide-card"><img class="gear-illustration" src="{esc(x["imageUrl"])}" alt="{esc(x["imageAlt"])}" width="1672" height="941" loading="lazy"><span class="tag">{i+1:02}｜{esc(x["type"])}</span><h2>{esc(x["title"])}</h2><p>{esc(x["audience"])}</p><p>{esc(x["points"])}</p><p class="note">{esc(x["note"])}</p></article>' for i,x in enumerate(data['gear']))
s=(root/'gear.html').read_text().replace('<div id="gear-list" class="gear-list"></div>','<div id="gear-list" class="gear-list">'+cards+'</div>')
(root/'gear.html').write_text(s)
generator=root/'tools/generate-content.mjs'
s=generator.read_text().replace('<meta name="twitter:card" content="summary">','<meta name="twitter:card" content="${image!==\'assets/hlpb-logo.png\'?\'summary_large_image\':\'summary\'}"><meta name="twitter:image" content="${imageUrl}">').replace('class="article-cover" src="../${esc(image)}"','class="article-cover" width="1672" height="941" src="../${esc(image)}"')
s=s.replace('20261001d','20261001f');generator.write_text(s)
print('Installed 25 article covers and 5 gear illustrations.')
