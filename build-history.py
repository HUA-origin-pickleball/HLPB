import subprocess,datetime,collections,re,html
from pathlib import Path
from zoneinfo import ZoneInfo
ROOT=Path(__file__).parent
notes={
  "10-13": [
    "",
    "新增 3 篇文章，補強 10 篇、修正 20 篇，新增 11 張分享封面與更新日誌。"
  ],
  "10-12": [
    "",
    "新增 21 篇文章，加入教學影片、活動行事曆、閱讀進度與場地篩選。"
  ],
  "10-11": [
    "",
    "新增 5 題小測驗，整理 1.0–5.0 分級與閱讀順序。"
  ],
  "10-10": [
    "",
    "新增教練、課程及選拍文章，加入首頁跑馬燈，修復預約與海報顯示。"
  ],
  "10-09": [
    "",
    "新增全站搜尋、收藏、文章目錄與加入手機主畫面功能。"
  ],
  "10-08": [
    "",
    "新增議長盃資訊與 3 篇文章，調整既有文章的閱讀重點。"
  ],
  "10-07": [
    "",
    "新增 3 篇文章，加入分享封面與動畫，修正手機列表。"
  ],
  "10-06": [
    "",
    "新增 3 篇花蓮推廣紀錄，更新分享文字及場地照片。"
  ],
  "10-05": [
    "",
    "新增關於 HLPB 頁面與 KOTC、MiLP、台灣賽事介紹。"
  ],
  "10-03": [
    "",
    "細分文章分類，新增方塊／列表切換，補充器材與花蓮新聞。"
  ],
  "10-02": [
    "",
    "統一卡片、封面與頁尾，修正手機版面及圖片顯示。"
  ],
  "10-01": [
    "",
    "補充新手與安全文章，統一封面插圖，加入分頁及文章導覽。"
  ],
  "09-30": [
    "",
    "新增 4 處學校場地資訊，整理賽事網址、分級文章與卡片版面。"
  ],
  "09-29": [
    "",
    "更新 6 處場地資料，補充新手與揪球資訊。"
  ],
  "09-28": [
    "",
    "補上場地照片，新增文章分類與器材說明，改善手機版面。"
  ],
  "09-26": [
    "",
    "發布花蓮球場指南，整理揪球使用說明。"
  ],
  "09-23": [
    "",
    "新增合作場館資訊與預約入口。"
  ],
  "09-16": [
    "",
    "調整字體、分享預覽與 PickleTown 連結。"
  ],
  "09-13": [
    "",
    "頁尾加入原點匹克球的維護說明。"
  ],
  "09-12": [
    "",
    "調整 8 個主要頁面的搜尋資訊，加入 Search Console 驗證。"
  ],
  "09-11": [
    "",
    "新增消息詳頁與網站圖示。"
  ],
  "09-09": [
    "",
    "建立文章資料流程，補上 SEO 與網站地圖。"
  ],
  "09-05": [
    "",
    "網站上線，建立主要頁面與專屬網址。"
  ]
}
rows=subprocess.check_output(['git','log','--reverse','--format=%H%x09%cI%x09%s'],cwd=ROOT,text=True).splitlines();days=collections.defaultdict(list)
for row in rows:
    sha,t,msg=row.split('\t',2);d=datetime.datetime.fromisoformat(t).astimezone(ZoneInfo('Asia/Taipei')).date();days[d].append((sha,msg))
parts=[]
for d,commits in sorted(days.items(),reverse=True):
    title,text=notes[d.strftime('%m-%d')]
    parts.append(f'<article class="update-entry"><time datetime="{d}">{d.month}/{d.day}</time><div><p style="margin:0">{text}</p></div></article>')
s=(ROOT/'updates.html').read_text();s=re.sub(r'<section class="content update-timeline">.*?</section>', '<section class="content update-timeline"><p class="update-history-note">HLPB 每次新增與改善的簡短紀錄。</p>'+''.join(parts)+'</section>',s,flags=re.S)
s=s.replace('加入手机主畫面','加入手機主畫面').replace('補齐','補齊')
(ROOT/'updates.html').write_text(s)
print('history dates',len(days),'from',min(days),'to',max(days),'commit sources',len(rows))
