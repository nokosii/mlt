# 苗栗文學步道（MLT）推廣協會網站

協會籌備版網站，包含 39 位作家的可搜尋資料庫、步道緣起、實景照片、協會方向與逐筆資料來源。

- 「加入我們」連結：https://forms.gle/otkC9QQo6Hp31ShK6
- 作家 Excel：`public/downloads/苗栗文學作家資料庫.xlsx`
- 首頁主視覺：`public/images/trail-hero-identity.png`

## 發布到 GitHub Pages

1. 將 `website` 資料夾內容推送到 GitHub repository 的 `main` 分支。
2. 到 repository 的 **Settings → Pages**，將 **Source** 設為 **GitHub Actions**。
3. 推送後，`Deploy MLT website to GitHub Pages` workflow 會發布 `docs` 內的靜態網站。

`docs` 已包含完整靜態版本，支援 GitHub 專案子路徑，不需要另外設定 base URL。

## 更新資料

- 作家資料：`app/data/writers.json` 與 `public/data/writers.json`
- 首頁內容：`app/page.tsx`
- 網站樣式：`app/globals.css`
- 步道影像：`public/images`

重新發布靜態版時，先完成建置並啟動正式預覽，再執行：

```powershell
node scripts/snapshot-github-pages.mjs
```

正式上線前，請補上協會確認的地址、電話與電子郵件；目前頁面明確標示為「待協會確認」，未使用虛構資料。
