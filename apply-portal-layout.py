from pathlib import Path
import re,json,subprocess
ROOT=Path(__file__).parent
footer='''<footer class="site-footer">
<div class="footer-main footer-main-clean">
<div class="footer-about"><a class="brand" href="/" aria-label="花蓮匹克球資訊站首頁"><img src="/assets/hlpb-logo.png" alt=""/><b>花蓮匹克球資訊站</b></a><p>花蓮球場、球局、賽事與新手資訊。<br/>由原點匹克球整理維護，歡迎一起把資訊補完整。</p></div>
<nav class="footer-nav footer-directory" aria-label="常用頁面"><h2>常用頁面</h2><div class="footer-link-grid"><a href="/">首頁</a><a href="/news.html">最新消息</a><a href="/courts.html">找球場</a><a href="/groups.html">揪打球</a><a href="/events.html">想參賽</a><a href="/articles.html">看文章</a><a href="/gear.html">匹克球拍與器材</a><a href="/beginners.html">新手區</a></div></nav>
<nav class="footer-nav footer-support" aria-label="關於與聯絡"><h2>關於與聯絡</h2><div class="footer-link-grid"><a href="/about.html" data-about-link="true">關於 HLPB</a><a href="/directory.html">網站導覽</a><a href="/updates.html" data-updates-link="true">更新日誌</a><a href="https://line.me/ti/p/~@591lqpnj" target="_blank" rel="noopener noreferrer">提供資訊／聯絡我們 ↗</a></div></nav>
<details class="footer-related"><summary>相關單位與原點匹克球連結</summary><div class="footer-related-links"><a href="https://www.facebook.com/HLPickleball" target="_blank" rel="noopener noreferrer">花蓮縣匹克球協會 Facebook ↗</a><a href="https://www.facebook.com/hucuorg/" target="_blank" rel="noopener noreferrer">花蓮縣社區大學 Facebook ↗</a><a href="https://www.facebook.com/people/%E5%8E%9F%E9%BB%9E%E5%8C%B9%E5%85%8B%E7%90%83/61586647553875/" target="_blank" rel="noopener noreferrer">原點匹克球 Facebook ↗</a><a href="https://www.instagram.com/origin.pickleball" target="_blank" rel="noopener noreferrer">原點匹克球 Instagram ↗</a><a href="https://hlopb.com/" target="_blank" rel="noopener noreferrer">原點匹克球官網 ↗</a></div></details>
</div><div class="footer-bottom"><p>場地使用與活動報名，請以管理或主辦單位公告為準。</p><small>© 2026 HLPB 花蓮匹克球資訊站</small></div></footer>'''
changed=0
for p in ROOT.rglob('*.html'):
    s=p.read_text()
    if not re.search(r'<footer\b[^>]*class=["\']site-footer["\']',s):continue
    s=re.sub(r'<footer\b[^>]*class=["\']site-footer["\'][^>]*>[\s\S]*?</footer>',lambda m:footer,s)
    if '/portal-layout.css?' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/portal-layout.css?v=20261013-footer-rhythm"/></head>')
    s=re.sub(r'script.js\?v=[^"\s>]+','script.js?v=20261013-footer-rhythm',s)
    p.write_text(s);changed+=1
p=ROOT/'index.html';s=p.read_text().replace('花蓮匹克球索引</h2>','想找什麼？從這裡開始</h2>').replace('消息、球場、球局、賽事、文章、器材與新手入門，直接選你要找的資料。','找球場、找球友、看賽事，或先學怎麼打。').replace('雙彈規則、廚房區與計分方式','雙彈規則、非截擊區與計分方式');p.write_text(s)
p=ROOT/'script.js';s=p.read_text().replace('actions.append(share, home); footer.prepend(actions);',"actions.append(share, home); (footer.querySelector('.footer-about') || footer).append(actions);").replace('/features.js?v=20261013-editorial-status','/features.js?v=20261013-footer-rhythm');p.write_text(s)
p=ROOT/'features.js';s=p.read_text().replace("if(nav&&!nav.querySelector('[data-updates-link]'))","if(nav&&!footer.querySelector('[data-updates-link]'))").replace('<a href="/updates.html">查看更新日誌</a>','');p.write_text(s)
# Only extend today's verified entry; never change the number of articles.
p=ROOT/'updates.html';s=p.read_text().replace('新增 11 張分享封面與更新日誌。','新增 11 張分享封面與更新日誌，整理首頁與頁尾版面。');p.write_text(s)
print('updated footer pages',changed)
