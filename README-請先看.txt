HLPB GitHub Pages 上傳方式

一、先測試
直接點兩下 index.html，網站就能在瀏覽器打開。

二、上傳 GitHub
1. GitHub 建立名稱為 HLPB 的 Public repository。
2. 進入 repository，按 Add file → Upload files。
3. 把本資料夾裡的 6 個檔案全部拖進去（不要上傳外層資料夾或 ZIP）。
4. 按 Commit changes。
5. 進入 Settings → Pages。
6. Build and deployment 的 Source 選 Deploy from a branch。
7. Branch 選 main，資料夾選 / (root)，按 Save。
8. 等一至三分鐘，回到 Pages 就能看到網站網址。

三、串接 Google 試算表
1. 打開 HLPB 網站資料庫。
2. 按 擴充功能 → Apps Script。
3. 刪除原本內容，貼上 google-apps-script.gs 的全部內容並儲存。
4. 按右上角 部署 → 新增部署作業。
5. 類型選 網頁應用程式；執行身分選「我」；誰可以存取選「任何人」。
6. 完成授權後，複製結尾為 /exec 的網址。
7. 回 GitHub 打開 config.js，按鉛筆編輯，把網址貼進引號：
   window.HLPB_DATA_URL = "你的 /exec 網址";
8. 按 Commit changes。網站稍後會自動更新。

安全提醒
- 這份試算表只放公開網站資料。
- 報名者姓名、電話、Email、付款狀態不可放進這份表。
- GitHub 不要上傳帳號、密碼、金鑰或任何私人資料。
