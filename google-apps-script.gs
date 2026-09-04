// 在 HLPB Google 試算表：擴充功能 → Apps Script，貼上整份程式後部署為網頁應用程式。
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = name => {
    const values = ss.getSheetByName(name).getDataRange().getDisplayValues();
    const heads = values.shift();
    return values.map(row => Object.fromEntries(heads.map((h, i) => [h, row[i]])));
  };
  const yes = v => [true, 'TRUE', 'true', '是', '1'].includes(v);
  const enabled = name => rows(name).filter(x => yes(x['啟用']));
  const output = {
    slides: enabled('首頁輪播').sort((a,b)=>Number(a['排序'])-Number(b['排序'])).map(x=>({id:x.id,title:x['主標題'],subtitle:x['副標題'],buttonText:x['按鈕文字'],buttonUrl:x['按鈕連結'],imageUrl:x['圖片網址']})),
    news: enabled('最新消息').sort((a,b)=>String(b['發布日期']).localeCompare(String(a['發布日期']))).map(x=>({id:x.id,date:x['發布日期'],category:x['分類'],title:x['標題'],summary:x['摘要'],url:x['連結網址'],imageUrl:x['圖片網址']})),
    courts: enabled('球場資料').sort((a,b)=>Number(a['排序'])-Number(b['排序'])).map(x=>({id:x.id,area:x['地區'],name:x['場地名稱'],indoor:x['室內外'],courts:x['場地數'],net:x['球網'],lighting:x['照明'],fee:x['費用'],hours:x['開放時間'],note:x['使用提醒'],mapUrl:x['地圖連結'],imageUrl:x['圖片網址']})),
    groups: enabled('球局活動').map(x=>({id:x.id,status:x['狀態'],date:x['日期'],startTime:x['開始時間'],endTime:x['結束時間'],name:x['活動名稱'],location:x['場地'],level:x['程度'],capacity:x['名額'],registered:x['已報名'],remaining:x['剩餘名額'],fee:x['費用說明'],organizer:x['主辦名稱'],externalId:x['外部活動ID'],signupUrl:x['報名網址'],imageUrl:x['圖片網址']})),
    events: enabled('賽事活動').map(x=>({id:x.id,status:x['狀態'],date:x['比賽日期'],name:x['名稱'],location:x['地點'],address:x['地址'],summary:x['簡介'],deadline:x['報名截止'],url:x['公告連結'],imageUrl:x['圖片網址']})),
    gear: enabled('器材建議').sort((a,b)=>Number(a['排序'])-Number(b['排序'])).map(x=>({id:x.id,type:x['類型'],title:x['建議標題'],audience:x['適合對象'],points:x['客觀判斷重點'],note:x['注意事項'],linkText:x['延伸連結文字'],storeUrl:x['商店連結'],imageUrl:x['圖片網址']}))
  };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
