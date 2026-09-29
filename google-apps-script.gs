// HLPB 公開資料 API。這份程式綁定「HLPB 網站資料庫」試算表。
function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('hlpb-public-data-v3');
  if (cached) return jsonOutput(cached);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return [];
    const values = sheet.getDataRange().getDisplayValues();
    if (!values.length) return [];
    const heads = values.shift();
    return values
      .filter(row => row.some(value => String(value).trim() !== ''))
      .map(row => Object.fromEntries(heads.map((head, index) => [head, row[index]])));
  };
  const yes = value => [true, 'TRUE', 'true', '是', '1'].includes(value);
  const enabled = name => rows(name).filter(item => yes(item['啟用']));
  const output = {
    // Public endpoint: expose only fields that the website actually renders.
    slides: enabled('首頁輪播').sort((a, b) => Number(a['排序']) - Number(b['排序'])).map(x => ({id:x.id,title:x['主標題'],subtitle:x['副標題'],buttonText:x['按鈕文字'],buttonUrl:x['按鈕連結'],imageUrl:x['圖片網址'],alt:x['圖片替代文字'] || '花蓮匹克球首頁圖片'})),
    news: enabled('最新消息').sort((a, b) => Number(yes(b['置頂'])) - Number(yes(a['置頂'])) || String(b['發布日期']).localeCompare(String(a['發布日期']))).map(x => ({id:x.id,pinned:yes(x['置頂']),date:x['發布日期'],updatedDate:x['更新日期'],category:x['分類'],title:x['標題'],summary:x['摘要'],linkText:x['連結文字'],url:x['連結網址'],imageUrl:x['圖片網址'],slug:x['網址代稱'],content:x['內文'],seoTitle:x['SEO標題'],seoDescription:x['SEO描述'],coverImageAlt:x['封面圖片替代文字'],sources:x['資料來源'],lastVerifiedDate:x['最後查證日期'],ctaText:x['行動文字'],ctaUrl:x['行動連結']})),
    courts: enabled('球場資料').sort((a, b) => Number(a['排序']) - Number(b['排序'])).map(x => ({id:x.id,area:x['地區'],name:x['場地名稱'],address:x['地址'],indoor:x['室內外'],courts:x['場地數'],net:x['球網'],lighting:x['照明'],fee:x['費用'],hours:x['開放時間'],note:x['使用提醒'],mapUrl:x['地圖連結'],imageUrl:x['圖片網址'],updatedDate:x['最後更新']})),
    // 球局社群表只匯出已核對且啟用的公開入口；不要填寫投稿者私人資料。
    groups: enabled('球局社群').sort((a, b) => Number(a['排序']) - Number(b['排序'])).map(x => ({id:x.id,name:x['名稱'],type:x['類型'],area:x['地區'],level:x['程度'],schedule:x['時間'],summary:x['簡介'],groupUrl:x['群組連結'],registrationUrl:x['報名表單連結'],lastVerifiedDate:x['最後查證日期']})),
    events: enabled('賽事活動').map(x => ({id:x.id,status:x['狀態'],date:x['比賽日期'],name:x['名稱'],location:x['地點'],address:x['地址'],summary:x['簡介'],deadline:x['報名截止'],url:x['公告連結'],imageUrl:x['圖片網址']})),
    gear: enabled('器材建議').sort((a, b) => Number(a['排序']) - Number(b['排序'])).map(x => ({id:x.id,type:x['類型'],title:x['建議標題'],audience:x['適合對象'],points:x['客觀判斷重點'],note:x['注意事項'],linkText:x['延伸連結文字'],storeUrl:x['商店連結'],imageUrl:x['圖片網址']})),
    articles: enabled('文章資料').sort((a, b) => Number(yes(b['置頂'])) - Number(yes(a['置頂'])) || String(b['發布日期']).localeCompare(String(a['發布日期']))).map(x => ({
      id:x.id,pinned:yes(x['置頂']),date:x['發布日期'],updatedDate:x['更新日期'],category:x['分類'],title:x['標題'],slug:x['網址代稱'],summary:x['摘要'],coverImageUrl:x['封面圖片網址'],coverImageAlt:x['封面圖片替代文字'],content:x['內文'],author:x['作者'],seoTitle:x['SEO標題'],seoDescription:x['SEO描述'],primaryKeyword:x['主要關鍵字'],secondaryKeywords:x['次要關鍵字'],sources:x['資料來源'],lastVerifiedDate:x['最後查證日期'],ctaText:x['行動文字'],ctaUrl:x['行動連結'],internalLinks:x['內部連結建議'],editorialStatus:x['編輯狀態']
    }))
  };

  const json = JSON.stringify(output);
  cache.put('hlpb-public-data-v3', json, 300);
  return jsonOutput(json);
}

function jsonOutput(json) {
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
