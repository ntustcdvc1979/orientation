/* ============================================================
   崇德志工社迎新尋寶 — 連線設定

   1. 到 https://console.firebase.google.com 建一個專案
   2. 左側 建構 → Realtime Database → 建立資料庫（位置選 asia-southeast1）
   3. 專案設定 → 你的應用程式 → 網頁應用程式，把 firebaseConfig 貼到下面
   4. 規則貼上 docs/SETUP.md 裡那份

   沒填也沒關係：投影幕會自動進入離線模式，鍵盤照樣跑完全部流程，
   只是手機端連不上、投影幕上不會有名字與統計。
   ============================================================ */
window.CDVC_CONFIG = {

  /* 從 Firebase 主控台複製過來的設定。留白 = 離線模式。 */
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    appId: ""
  },

  /* 房號。寫死才能事先把 QR code 印出來；要換場次改這裡，
     或用 stage.html?r=CDVC2 / play.html?r=CDVC2 臨時覆寫。 */
  room: "CDVC",

  /* 手機端網址。留白就用目前網域推算（同一個資料夾下的 play.html）。
     若投影幕是本機開檔、手機要連線上版，就把正式網址填在這裡。 */
  playUrl: "",

  /* 結束卡上的社群連結，會做成 QR */
  socialUrl: "https://www.instagram.com/ntustcdvc/"
};
