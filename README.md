# 報價單製作工具 Simple Quote Generator

一個給自由工作者與小型工作室使用的簡易報價單製作工具。

不用登入、不需安裝、不需要後端。
打開網頁，填寫報價資訊，即可產生一份乾淨、可列印、可另存 PDF 的報價單。

這個工具的目標不是取代大型財務或專案管理系統，而是把大家原本就會做、但很煩的報價單製作流程，變成更低門檻的小工具。

## 專案特色

- 純前端工具，不需要後端、資料庫或帳號系統
- 使用填格子的方式輸入報價單內容
- 即時產生正式文件風格的報價單預覽
- 支援列印與透過瀏覽器另存 PDF
- 支援複製文字版報價內容
- 使用 localStorage 自動暫存資料
- 支援 TWD / USD / JPY / HKD / CNY
- 支援實報實銷資訊與預估總額
- UI 文案使用繁體中文

## 適合誰使用

- 自由工作者
- 小型工作室
- 接案者
- 設計師、攝影師、剪輯師
- 顧問、講師與服務型工作者
- 需要快速產生報價單的人

## 功能列表

- 報價單標題、編號、日期、有效期限與幣別設定
- 報價方資訊欄位
- 客戶資訊欄位
- 多筆報價項目新增、刪除與編輯
- 自動計算服務費小計、折扣、稅額與本次報價小計
- 稅率可設定為 0%，並顯示未稅 / 免稅
- 金額千分位與幣別格式化
- 付款方式、交付說明、備註與條款欄位
- 條款範本快速加入
- 列印時只顯示報價單內容
- 清空表單並恢復預設值

## 實報實銷功能說明

本工具支援「實報實銷」欄位，適合交通、住宿、材料、代墊費等需要依實際支出另行請款的情境。
實報實銷可選擇是否填寫預估金額。
若填寫預估金額，系統會額外顯示「預估總額」。
若不填寫，則顯示為「另計」。

實報實銷金額不會列入服務費小計，也不參與稅額計算，避免代墊費與服務報價混在一起。

## 隱私說明

本工具不需要登入，也不會將資料上傳到任何伺服器。
所有輸入內容僅儲存在你的瀏覽器 localStorage 中。
若你按下清空表單，資料會從瀏覽器暫存中移除。

## 本機開發方式

```bash
npm install
npm run dev
```

開發伺服器啟動後，依終端機顯示的網址開啟瀏覽器即可。

## 建置

```bash
npm run build
```

## GitHub Pages 部署方式

本專案已包含 GitHub Actions workflow：`.github/workflows/deploy.yml`。

使用方式：

1. 將程式推送到 GitHub repository。
2. 到 repository 的 Settings → Pages。
3. Source 選擇 GitHub Actions。
4. push 到 `main` branch 後會自動執行 build 並部署 `dist`。

部署到 GitHub Pages 時，`vite.config.ts` 使用：

```ts
base: "/simple-quote-generator/"
```

若你的 repository 名稱不同，請同步調整 base 路徑。

## Vercel 部署方式

Vercel 可直接匯入此 repository 並使用預設 Vite 設定部署。

若部署到 Vercel 根路徑，`vite.config.ts` 可視情況改為：

```ts
base: "/"
```

## 開源授權

本專案採用 MIT License。

## 支持專案

如果這個工具對你有幫助，未來可以透過以下方式支持專案：

- Give me a Boba：https://donglinphoto.bobaboba.me
- GitHub Sponsors：placeholder

### 設定 Give me a Boba / GitHub Sponsors

支持連結集中放在 `src/utils/projectLinks.ts`。

建立 Give me a Boba 或 GitHub Sponsors 後，將對應網址填入：

```ts
export const bobaSponsorUrl = "https://donglinphoto.bobaboba.me";
export const githubSponsorsUrl = "https://github.com/sponsors/your-account";
```

若兩者都留空，網站會顯示「支持連結準備中」。

### 社群分享連結

網站底部已提供「分享這個工具」與「複製分享連結」。
分享文字與正式網址同樣集中在 `src/utils/projectLinks.ts`，可依專案語氣調整。
