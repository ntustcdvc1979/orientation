# 迎新尋寶啟航

台科大崇德志工社迎新活動的現場互動網站。投影幕跑主流程、新生用手機掃 QR 加入，
主持人用鍵盤控制節奏。純靜態網頁，放在 GitHub Pages 上。

**線上網址** <https://ntustcdvc1979.github.io/orientation/>

| 頁面 | 給誰 |
|---|---|
| [`stage.html`](stage.html) | 投影幕。主持人用鍵盤操作，是整個流程的控制端。 |
| [`play.html`](play.html) | 新生手機。輸入名字、跟著投影幕的節奏作答。 |
| [`index.html`](index.html) | 入口。活動說明、QR code、開場前的檢查清單。 |

## 活動流程

一場尋寶，四關各拿一把鑰匙，湊齊四把，法船啟航。

| | 關卡 | 內容 |
|---|---|---|
| 🗺️ | 序章 | 掃 QR、輸入名字，說明規則 |
| 🧭 | 第一關・羅盤 | 志工人格測驗 10 題，主持人控制節奏，最後投影幕秀出四象限地圖，名字一個一個飛到自己的位置 |
| 🍲 | 第二關・補給倉庫 | 六個情境任務，用手上的實體食材卡解決問題 |
| 📣 | 第三關・迷霧傳聲 | 三隻猴子：一個閉眼、一個只能比、一個只能說 |
| 📸 | 第四關・船員名冊 | 全體大合照，投影幕跑 3・2・1 |
| ⛵ | 終章 | 法船啟航影片 |

## 開始之前

**必看** [`docs/SETUP.md`](docs/SETUP.md)：Firebase 設定、GitHub Pages 開啟、
食材卡列印、現場鍵盤操作表、以及網路出事時的備援作法。

最短路徑：

1. 建 Firebase 專案，開 Realtime Database，把設定填進 [`assets/config.js`](assets/config.js)。
2. repo Settings → Pages → 從 `main` / root 部署。
3. 印 [`docs/食材卡.pdf`](docs/食材卡.pdf)（7 頁卡片，一格一張，共 56 張）。

沒設定 Firebase 也不會壞：投影幕會自動退到本機模式，鍵盤照樣跑完全部 56 個畫面，
只是手機端不會同步。

## 鍵盤

<kbd>→</kbd> 下一步　<kbd>←</kbd> 上一步　<kbd>Esc</kbd> 跳關選單　<kbd>F</kbd> 全螢幕
　<kbd>T</kbd> 計時器／合照倒數　<kbd>R</kbd> 重設本頁

## 檔案

```
stage.html            投影幕，流程的唯一真相來源
play.html             新生手機端
index.html            入口與檢查清單
assets/
  config.js           Firebase 設定與房號（要自己填）
  net.js              連線層：firebase → 本機模式自動降級
  theme.css           共用色票（沿用社網 quiz.html）與元件
  quiz-data.js        10 題人格測驗、6 種人格、四象限座標
  cards-data.js       28 種食材卡與 6 個情境任務的參考解答
  monkeys-data.js     三隻猴子題庫
  qrcode.js           自製 QR 產生器，不依賴任何外部服務
media/ship_moving.mp4 結尾影片
docs/                 設定手冊與食材卡 PDF
```

要改題目、改情境、改猴子題庫，動 `assets/*-data.js` 就好，兩個頁面都會跟著變。

## 資料與隱私

新生只留一個名字（暱稱即可）和選項，不收系級、電話或任何聯絡方式。
資料存在社團自己的 Firebase 專案，活動結束後請照 SETUP.md 最後一節把它刪掉。
