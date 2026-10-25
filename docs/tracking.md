# HLPB 廣告追蹤

- GTM 容器：GTM-575FXVC9
- GA4：G-V8MF7X50MV，網站直接安裝。不要在 GTM 重複設定同一個評估 ID。
- Meta Pixel：1649133696716796，網站直接安裝，送出 PageView。
- 廣告帳號 1842766720194848 是廣告管理用途，不放入網頁追蹤碼。

追蹤碼由 tools/install-tracking.mjs 管理，安裝在主要頁面、文章、消息與賽事詳頁。Google 驗證檔與草稿不安裝。產生內容工具 tools/generate-content.mjs 會在結束後補上追蹤碼。手動建立其他 HTML 頁面後執行 `node tools/install-tracking.mjs`；驗證使用 `node tools/check-tracking.mjs`。

## 交接

本次未建立新的管理後台或變更帳號權限。GTM 的標籤、觸發條件、預覽、發布仍在原 Google 帳號的 Tag Manager 管理。按鈕事件與轉換須另行設定、測試，網站點擊不直接當作購買或報名成功。

同一 Meta Pixel 不可同時透過 GTM 再送 PageView。若要轉由 GTM 管理，請在同次遷移移除本工具內的 Meta 程式及 noscript 圖片，重新套用全站並驗證。GTM 的公開程式檢查只能看到已發布版本，不代表草稿或後續版本沒有重複標籤。

正式數據是否收到，請用 GTM Tag Assistant 與 Meta 事件管理工具測試。本次不變更隱私或 Cookie 同意介面。

GA4 改由 GTM 管理時，同步移除 install-tracking.mjs 的 Google tag 區塊，再重新套用全站。GA4 即時報表是否收到資料須另行驗證。
