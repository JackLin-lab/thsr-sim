手機上傳步驟（GitHub 網站，用 Chrome）
1. 註冊/登入 github.com → 右上 + → New repository → 名稱 thsr-sim → Create。
2. 在 repo 頁面點 "uploading an existing file"，一次選取：
   index.html、native-bridge.js、package.json、capacitor.config.json、.gitignore（若選不到就略過）
   → Commit changes。
3. Add file → Create new file，檔名欄輸入：  .github/workflows/build.yml
   貼上 build.yml 全文 → Commit changes。
4. 上方 Actions 分頁 → Build Android APK → Run workflow（約 5~8 分鐘）。
5. 完成後點進該次執行，頁面底部 Artifacts 下載 thsr-simulator-apk（zip），
   解壓縮得到 app-debug.apk，點開安裝（需允許「安裝未知應用程式」）。
