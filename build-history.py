import subprocess,datetime,collections,re,html
from pathlib import Path
from zoneinfo import ZoneInfo
ROOT=Path(__file__).parent
notes={
'09-05':('HLPB 開始上線','建立首頁、消息、球場、揪球、賽事、器材、新手與文章頁，串接內容來源並設定 hlpb.com.tw 網址。'),
'09-09':('建立文章與搜尋基礎','整理文章資料流程，加入搜尋需要的頁面資訊與網站地圖。'),
'09-11':('消息有自己的網址','建立最新消息詳頁，加入網站圖示，讓消息能獨立閱讀與分享。'),
'09-12':('補齊搜尋資訊','調整 8 個主要頁面的標題、摘要與分享資料，更新網站地圖並加入 Search Console 驗證。'),
'09-13':('介紹維護團隊','頁尾加入原點匹克球的網站管理與維護說明。'),
'09-16':('閱讀與分享再整理','調整字體和社群預覽，更新 PickleTown 連結。'),
'09-23':('加入合作場館資訊','整理匹勁場館資訊與預約入口，改善場館卡片及操作按鈕，保留已結束賽事紀錄。'),
'09-26':('花蓮找球場指南','發布花蓮球場指南，並調整 PickleTown 的使用說明。'),
'09-28':('場地照片與分類更完整','補上林芥、中山、明恥場地照片與太昌場地資訊，整理器材 02–05 區段。加入文章分類篩選、消息分類顏色與洄瀾盃海報，並改善手機卡片、圖片和頁尾。'),
'09-29':('把入口與參與方式說清楚','更新 6 處場地資料，補充 HLPB 宗旨、新手說明與揪球報名入口。把文章加入首頁索引，整理已結束的花蓮賽事，修正圖片與文字版面。'),
'09-30':('讓每篇內容有自己的入口','建立花蓮賽事獨立網址，加入 4 處學校場地及使用限制。整理揪球連結、主選單、新手索引與分級文章，統一卡片配色、陰影與手機閱讀。'),
'10-01':('封面與新手閱讀一起完善','發布 DUPR、安全與規則相關內容，加入規則互動區、每頁 10 篇分頁及上一篇／下一篇導覽。統一文章封面與器材插圖，校正球拍、更新空白封面，補上中原照片，將協會 LINE 放在臨打入口。'),
'10-02':('全站視覺重新對齊','保留 PickleTown，整理揪球卡片與頁尾導覽。修正新手與球場插圖，統一封面、卡片和圖片呈現，讓海報完整顯示，並移除頁尾委員會連結。'),
'10-03':('內容分類與查找更方便','歷史、知識與新手規則分開分類，調整重複封面及文章按鈕。補充器材規格與選購資訊、場地面數和球網提醒，加入缺照片提示、回到頂端按鈕、方塊／列表切換及消息分頁。整理花蓮新聞與推廣報導，統一學校費用及 APP 按鈕。'),
'10-05':('介紹 HLPB 與比賽玩法','新增關於 HLPB 獨立頁及頁尾入口，補充網站建立的原因。發布 KOTC、MiLP、台灣大型賽事及其他已確認文章，並調整首頁分享資訊。'),
'10-06':('留下花蓮推廣紀錄','發布太昌社區、原點匹克球及花蓮縣匹克球協會 3 篇推廣文章。補入原點 IG 開幕來源與確認日期，調整文章分享前言，替換太昌與中山場地照片。'),
'10-07':('分享封面與動畫上線','加入 HLPB 分享封面、互動與滑入動畫，修正手機列表圖片。更新已結束活動及報名截止狀態，發布 3 篇已確認文章並校正封面。'),
'10-08':('議長盃資訊與閱讀重點','加入花蓮縣議長盃報名及海報，調整三欄卡片、窄版列表與動畫。發布 3 篇文章，補強 54 篇既有文章的閱讀重點。'),
'10-09':('搜尋、收藏與文章目錄','加入分享網站、加入手机主畫面、全站搜尋、收藏、文章目錄與新手閱讀路線。把搜尋與收藏放到頁首右側，保留電腦主選單，修正換頁跳動並統一動畫。'),
'10-10':('新增教練、課程與技術內容','發布找教練、課程及匹克球技術文章，新增桌球、羽球、網球背景的選拍指南。首頁加入新文章跑馬燈，修復匹勁預約按鈕與被裁切海報，調整摘要及文章網址。'),
'10-11':('新手小測驗與程度參考','加入 5 題新手小測驗與閱讀路線，以不同顏色區分答案，統一非截擊區及發球得分制用語。將程度參考擴充為 1.0–5.0，並放進新手區。'),
'10-12':('學習內容與活動行事曆','新增 21 篇技術、規則、戰術等文章，加入影片與分級閱讀連結。新增首頁活動行事曆、行事曆檔下載、閱讀進度與場地多條件篩選。補上大陳照片，修正 2 張封面，精簡分級區及列表版面。'),
'10-13':('文章補強與分享預覽','新增 3 篇文章，完整補強 10 篇、編輯修正 20 篇。加入頁尾更新日誌、最後更新日期與瀏覽次數，補齐建立以來的歷史紀錄，為 11 個頁面製作專屬分享封面，讓分享帶出對應頁面的標題、摘要與分頁網址。')}
rows=subprocess.check_output(['git','log','--reverse','--format=%H%x09%cI%x09%s'],cwd=ROOT,text=True).splitlines();days=collections.defaultdict(list)
for row in rows:
    sha,t,msg=row.split('\t',2);d=datetime.datetime.fromisoformat(t).astimezone(ZoneInfo('Asia/Taipei')).date();days[d].append((sha,msg))
parts=[]
for d,commits in sorted(days.items(),reverse=True):
    title,text=notes[d.strftime('%m-%d')]
    detail=''.join('<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/HUA-origin-pickleball/HLPB/commit/'+sha+'">'+html.escape(msg)+'</a></li>' for sha,msg in commits)
    parts.append(f'<article class="update-entry"><time datetime="{d}">{d.month}/{d.day}</time><div><h2>{title}</h2><p>{text}</p><details><summary>查看這一天的版本來源</summary><ul>{detail}</ul></details></div></article>')
s=(ROOT/'updates.html').read_text();s=re.sub(r'<section class="content update-timeline">.*?</section>', '<section class="content update-timeline"><p class="update-history-note">從 2026/9/5 建立至今，依台灣日期整理。只列有更新的日期，新增文章與既有內容調整分開記錄。</p>'+''.join(parts)+'</section>',s,flags=re.S)
s=s.replace('加入手机主畫面','加入手機主畫面').replace('補齐','補齊')
(ROOT/'updates.html').write_text(s)
print('history dates',len(days),'from',min(days),'to',max(days),'commit sources',len(rows))
