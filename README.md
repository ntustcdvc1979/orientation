# 迎新尋寶啟航

台科大崇德志工社迎新活動的現場互動網站。投影幕跑主流程、新生用手機掃 QR 加入，
主持人用鍵盤控制節奏。純靜態網頁，由 GitHub Actions 部署到 GitHub Pages。

**線上網址** <https://ntustcdvc1979.github.io/orientation/>

| 頁面 | 給誰 |
|---|---|
| [`stage.html`](stage.html) | 投影幕。主持人用鍵盤操作，是整個流程的控制端。 |
| [`play.html`](play.html) | 新生手機。輸入名字、跟著投影幕的節奏作答。 |
| [`index.html`](index.html) | 入口。活動說明、QR code、開場前的檢查清單。 |

## 劇情線

一場尋寶，四段旅程，最後發現寶藏一直在自己身上。

| | 旅程 | 現場在做什麼 |
|---|---|---|
| 🗺️ | 序章 | 掃 QR、輸入名字，攤開藏寶圖 |
| 🧭 | **認識自己** | 志工人格測驗 10 題，主持人控制節奏，最後投影幕秀出四象限地圖，名字一個一個飛到自己的位置 |
| 🍲 | **找到同伴** | 食材卡六個情境任務。伙食團不只是煮飯，是用一道料理去感動另一個人——而願意一起煮的人，就是同伴 |
| 🤝 | **實踐服務** | 三隻猴子：一個閉眼、一個只能比、一個只能說。服務現場的溝通就長這樣 |
| 💎 | **開箱** | 全體大合照，然後打開箱子——裡面沒有金幣，只有剛剛那張照片 |
| ⛵ | 終章 | 「寶藏就在你身上」，法船啟航影片 |

## 開始之前

**必看** [`docs/SETUP.md`](docs/SETUP.md)：Firebase 設定、部署、食材卡列印、
現場鍵盤操作與主持重點、以及網路出事時的備援作法。

最短路徑：

1. 建 Firebase 專案，開 Realtime Database。
2. 把設定存成 repo secret **`FIREBASE_CONFIG`**（JSON 格式），
   Settings → Pages → Source 選 **GitHub Actions**。push 之後會自動部署。
3. 印 [`docs/食材卡.pdf`](docs/食材卡.pdf)（7 頁卡片，一格一張，共 56 張）。

沒設定 Firebase 也不會壞：投影幕會自動退到本機模式，鍵盤照樣跑完全部 57 個畫面，
只是手機端不會同步。

## 鍵盤

<kbd>→</kbd> 下一步　<kbd>←</kbd> 上一步　<kbd>Esc</kbd> 跳關選單　<kbd>F</kbd> 全螢幕
　<kbd>T</kbd> 計時器／合照倒數　<kbd>R</kbd> 重設本頁

## 檔案

```
stage.html                     投影幕，流程的唯一真相來源
play.html                      新生手機端
index.html                     入口與檢查清單
assets/
  settings.js                  房號、社群連結等不敏感設定（進 git）
  firebase-config.sample.js    Firebase 設定範本
  firebase-config.js           實際設定，.gitignore 掉，由 CI 從 secret 產生
  net.js                       連線層：firebase → 本機模式自動降級
  theme.css                    藏寶圖色票與共用元件
  quiz-data.js                 10 題人格測驗、6 種人格、四象限座標
  cards-data.js                28 種食材卡與 6 個情境任務的參考解答
  monkeys-data.js              三隻猴子題庫
  qrcode.js                    自製 QR 產生器，不依賴任何外部服務
media/ship_moving.mp4          結尾影片
docs/                          設定手冊與食材卡 PDF
.github/workflows/deploy.yml   部署，順便把 secret 寫成 firebase-config.js
```

要改題目、改情境、改猴子題庫，動 `assets/*-data.js` 就好，兩個頁面都會跟著變。

## 關於那把 Firebase API key

Firebase 的 web API key 本來就不是密碼——它只識別專案，不授權存取，部署後在瀏覽器裡
本來就看得到。真正的防線是資料庫規則和活動後刪資料。這個 repo 仍然不把它寫進版本庫，
是為了不讓爬蟲從公開原始碼掃走亂打流量。詳見 SETUP.md 第二節。

## 資料與隱私

新生只留一個名字（暱稱即可）和選項，不收系級、電話或任何聯絡方式。
資料存在社團自己的 Firebase 專案，活動結束後請照 SETUP.md 最後一節把它刪掉。
