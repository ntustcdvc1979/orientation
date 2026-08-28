# 活動前設定與現場操作手冊

分成三塊：**活動前一週要做的**、**現場當天怎麼開**、**當天鍵盤怎麼按**。
最後附上出事時的備援作法。

---

## 一、活動前一週

### 1. 建 Firebase（讓手機和投影幕連在一起）

沒有這一步，投影幕還是能用鍵盤跑完全部流程，但手機端不會同步、投影幕上不會有名字。

1. 到 <https://console.firebase.google.com>，用社團的 Google 帳號登入，**新增專案**
   （名字隨便取，例如 `cdvc-orientation`；Google Analytics 可以關掉）。
2. 左側選 **建構 → Realtime Database → 建立資料庫**。
   - 位置選 **`asia-southeast1`（新加坡）**，離台灣最近。
   - 安全性規則先選「以測試模式啟動」，等一下會換掉。
3. 左上角齒輪 **專案設定 → 一般 → 您的應用程式**，點 **`</>`（網頁）**，
   隨便取個暱稱、**不要**勾 Firebase Hosting，按註冊。
4. 畫面會出現一段 `const firebaseConfig = { ... }`，把裡面的值抄進
   [`assets/config.js`](../assets/config.js)：

   ```js
   firebase: {
     apiKey: "AIza....",
     authDomain: "cdvc-orientation.firebaseapp.com",
     databaseURL: "https://cdvc-orientation-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "cdvc-orientation",
     appId: "1:123456789:web:abc123"
   }
   ```

   > `databaseURL` 一定要有。它在 Realtime Database 頁面上方，
   > 長得像 `https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app`。
   > 少了這一行，網頁會安靜地退回本機模式。

5. 回到 **Realtime Database → 規則**，整段換成：

   ```json
   {
     "rules": {
       "rooms": {
         "$room": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

   按發布。

**關於這份規則**：它是開放讀寫的，只是限制在 `rooms/` 底下。
這樣新生掃了 QR 就能直接玩，不用登入、不用註冊。代價是活動期間任何知道網址的人
都能寫入這個房間。裡面只有名字和選項，沒有其他個資，所以可以接受，但是：

- **活動結束後**請回 Firebase 主控台，把 `rooms` 節點整個刪掉，
  再把規則改回 `".read": false, ".write": false`。
- 免費方案同時上線人數上限是 100 人，迎新的規模綽綽有餘。

### 2. 開 GitHub Pages

repo 設定裡：**Settings → Pages → Build and deployment → Source 選 `Deploy from a branch`**，
branch 選 **`main` / `(root)`**，按 Save。等一兩分鐘，網站會出現在：

```
https://ntustcdvc1979.github.io/orientation/
```

投影幕開 `.../orientation/stage.html`，新生掃到的是 `.../orientation/play.html?r=CDVC`。

### 3. 印食材卡

[`docs/食材卡.pdf`](食材卡.pdf) 共 8 頁：

- 第 1–7 頁是卡片，一頁 8 格，**每一格剪下來就是一張卡**，總共 56 張
  （28 種食材各 2 張）。建議印在厚一點的紙上，或印完護貝。
- 第 8 頁是六大類對照表，印一張貼在牆上就好。

顏色就是分類：黃＝全穀雜糧、綠＝蔬菜、紫＝豆蛋、橘＝水果、藍＝乳品、紅＝油脂與堅果種子。

### 4. 印 QR code

開 [`index.html`](../index.html)，上面那張 QR 就是新生入口，
螢幕截圖印出來貼在門口，新生一進場就可以先加入。

> QR 裡面的房號是寫死的 `CDVC`（在 `assets/config.js` 改），
> 所以可以提前印，不會因為重開網頁就失效。

---

## 二、現場當天

開場前 10 分鐘：

1. 筆電接投影機，**設成「延伸」而不是「同步」**會更好用
   （投影幕放 stage.html 全螢幕，筆電自己那一面可以看流程表）。
   只有一個畫面也沒問題，控制列會自動隱藏。
2. 瀏覽器開 `https://ntustcdvc1979.github.io/orientation/stage.html`。
3. 看右下角：顯示 **● 已連線** 才算成功。
   如果寫「本機模式」或「連線中斷」，先處理網路（見下面的備援）。
4. 按 <kbd>F</kbd> 全螢幕。
5. 自己拿手機掃一次 QR，確認名字有跳到投影幕上，再把手機那筆從 Firebase 刪掉
   （或直接留著也行）。

---

## 三、鍵盤操作

| 按鍵 | 作用 |
|---|---|
| <kbd>→</kbd> / <kbd>空白</kbd> / <kbd>Enter</kbd> | 下一步 |
| <kbd>←</kbd> | 上一步 |
| <kbd>Esc</kbd> | 跳關選單（全部 56 個畫面，點一下直接跳） |
| <kbd>F</kbd> | 全螢幕 |
| <kbd>T</kbd> | 食材卡任務：計時開始／暫停　·　大合照：開始 3・2・1 |
| <kbd>R</kbd> | 重設這一頁（計時器歸零、猴子題庫重洗） |

**第三關「三隻猴子」比較特別**：停在出題畫面時，
<kbd>→</kbd> 是**換下一題**，要離開這一關請按 <kbd>Shift</kbd>+<kbd>→</kbd>（或用 <kbd>Esc</kbd> 跳關）。

---

## 四、流程與主持重點

| 畫面 | 你要做什麼 |
|---|---|
| 封面 | 等大家掃 QR、輸入名字。人數會即時跳動，等到差不多再開始。 |
| 序章 | 講四把鑰匙的故事。 |
| 第一關 標題 | 「先搞清楚自己是哪一種人。」 |
| Q1–Q10（作答） | 念題目，等「已作答 N / M」追上再按 <kbd>→</kbd>。 |
| Q1–Q10（統計） | 看長條圖，挑一兩個有趣的選項聊兩句。趕時間就直接跳過。 |
| 四象限地圖 | **高潮**。名字會一個一個飛到自己的位置，讓大家找自己。 |
| 六種人格 | 每一頁最下面會列出這一區有誰，可以請他們站起來揮手。趕時間可以只講兩三種。 |
| 第二關 六大類 | 卡片先發下去（每人 1–2 張），請大家依卡片顏色分成六區。 |
| 任務一～六 | 出情境 → <kbd>T</kbd> 開始計時 → 手上有解的人站起來舉卡 → 隨機請 2–3 位念出卡片上寫的功效 → <kbd>→</kbd> 公布解答。 |
| 終極任務 | 全場合力配一餐，六大類至少四類。收尾講白米／豆腐／豆漿那段。 |
| 第三關 規則 | 三個人一組排成一直線，說明三種猴子。 |
| 三隻猴子 出題 | <kbd>→</kbd> 換題。比劃猴面對投影幕，另外兩位背對。 |
| 大合照 | 按 <kbd>T</kbd> 跑 3・2・1，攝影同學抓最後那張 📸。 |
| 終章 | 四把鑰匙合體，按 <kbd>→</kbd> 播影片。 |
| 影片 | 播完停在最後一格，按 <kbd>→</kbd> 到結束卡。 |

食材卡任務的參考解答都寫在 [`assets/cards-data.js`](../assets/cards-data.js)，
要改情境或增減食材，改那一個檔就好，投影幕會跟著變。

---

## 五、出事的時候

**手機連不上／投影幕顯示「本機模式」**

投影幕的鍵盤流程完全不受影響，可以照跑。差別只有：
沒有名字牆、沒有作答統計、四象限地圖會是空的。

臨時補救：第一關改成主持人念題目、新生舉手投票，投影幕當純簡報用。
其餘三關本來就不需要手機。

**現場沒有 Wi-Fi**

用手機開熱點給筆電，新生用自己的行動網路連 GitHub Pages，一樣會通
（資料是走 Firebase，不需要在同一個區網）。

**筆電當掉要重開**

重新整理 stage.html 之後，名單和作答都還在 Firebase 上，
用 <kbd>Esc</kbd> 跳回原本那一關就好，不會從頭來過。

**想重跑一場（例如下午還有一梯）**

- 換房號：網址改成 `stage.html?r=CDVC2`，QR 也會跟著變成 `play.html?r=CDVC2`。
- 或是到 Firebase 主控台把 `rooms/CDVC/players` 刪掉，重新開始。

---

## 六、活動之後

1. Firebase 主控台 → Realtime Database → 把 `rooms` 節點刪掉。
2. 規則改回 `".read": false, ".write": false`。
3. 想留紀錄的話，刪之前先用主控台的「匯出 JSON」存一份。
