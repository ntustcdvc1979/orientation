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
4. 畫面會出現一段 `const firebaseConfig = { ... }`。**先放著，下一節會用到。**
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

### 2. 把 Firebase 設定存成 repo secret（不進 git）

先說清楚一件事：**Firebase 的 web API key 本來就不是密碼**。
它只用來識別是哪一個專案，不授權任何存取；網站部署出去之後，任何人打開開發者工具
都看得到它。真正的防線是上面那份資料庫規則，以及活動後把資料刪掉。

即使如此，把它留在公開 repo 裡還是會被爬蟲掃到、被拿去亂打流量。所以這個專案的作法是：
**設定值存在 GitHub secret，部署時才寫進網站。**

1. repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Name 填 **`FIREBASE_CONFIG`**
3. Secret 填一段 **JSON**（注意是 JSON，key 要加雙引號，跟 Firebase 給你的 JS 物件寫法略有不同）：

   ```json
   {
     "apiKey": "AIza....",
     "authDomain": "cdvc-orientation.firebaseapp.com",
     "databaseURL": "https://cdvc-orientation-default-rtdb.asia-southeast1.firebasedatabase.app",
     "projectId": "cdvc-orientation",
     "appId": "1:123456789:web:abc123"
   }
   ```

   > `databaseURL` 一定要有。它在 Realtime Database 頁面上方，
   > 長得像 `https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app`。
   > 少了這一行，網頁會安靜地退回本機模式。

4. **Settings → Pages → Build and deployment → Source** 選 **`GitHub Actions`**
   （不是「Deploy from a branch」）。

之後每次 push 到 `main`，[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
會把 secret 寫成 `assets/firebase-config.js` 再部署。網站會在：

```
https://ntustcdvc1979.github.io/orientation/
```

投影幕開 `.../orientation/stage.html`，新生掃到的是 `.../orientation/play.html?r=CDVC`。

> 改了 secret 之後要重新跑一次部署才會生效：
> repo → Actions → Deploy to GitHub Pages → Run workflow。

### 3. 想在自己電腦上測

複製一份設定檔，把值填進去：

```bash
cp assets/firebase-config.sample.js assets/firebase-config.js
```

`assets/firebase-config.js` 在 `.gitignore` 裡，不會被 commit 上去。
不想連 Firebase 的話，內容寫 `window.CDVC_CONFIG.firebase = null;` 就好，
會走本機模式（同一台電腦的分頁之間還是會同步，方便一個人測）。

房號、社群連結這些不敏感的設定放在 [`assets/settings.js`](../assets/settings.js)，那支是進 git 的。

### 4. 印食材卡

[`docs/食材卡.pdf`](食材卡.pdf) 共 8 頁：

- 第 1–7 頁是卡片，一頁 8 格，**每一格剪下來就是一張卡**，總共 56 張
  （28 種食材各 2 張）。建議印在厚一點的紙上，或印完護貝。
- 第 8 頁是六大類對照表，印一張貼在牆上就好。

顏色就是分類：黃＝全穀雜糧、綠＝蔬菜、紫＝豆蛋、橘＝水果、藍＝乳品、紅＝油脂與堅果種子。

### 5. 印 QR code

開 [`index.html`](../index.html)，上面那張 QR 就是新生入口，
螢幕截圖印出來貼在門口，新生一進場就可以先加入。

> QR 裡面的房號是寫死的 `CDVC`（在 `assets/settings.js` 改），
> 所以可以提前印，不會因為重開網頁就失效。

---

## 二、現場當天

開場前 10 分鐘：

1. 筆電接投影機，**設成「延伸」而不是「同步」**會更好用
   （投影幕放 stage.html 全螢幕，筆電自己那一面可以看流程表）。
   只有一個畫面也沒問題，控制列會自動隱藏。
2. 瀏覽器開 `https://ntustcdvc1979.github.io/orientation/stage.html`。
3. 看右下角：顯示 **● 已連線** 才算成功。
   如果寫「本機模式」或「連線中斷」，先處理（見下面的備援）。
4. 按 <kbd>F</kbd> 全螢幕。
5. 自己拿手機掃一次 QR，確認名字有跳到投影幕上。

---

## 三、鍵盤操作

| 按鍵 | 作用 |
|---|---|
| <kbd>→</kbd> / <kbd>空白</kbd> / <kbd>Enter</kbd> | 下一步 |
| <kbd>←</kbd> | 上一步 |
| <kbd>Esc</kbd> | 跳關選單（全部 57 個畫面，點一下直接跳） |
| <kbd>F</kbd> | 全螢幕 |
| <kbd>T</kbd> | 食材卡任務：計時開始／暫停　·　大合照：開始 3・2・1 |
| <kbd>R</kbd> | 重設這一頁（計時器歸零、猴子題庫重洗） |

**第三關「三隻猴子」比較特別**：停在出題畫面時，
<kbd>→</kbd> 是**換下一題**，要離開這一關請按 <kbd>Shift</kbd>+<kbd>→</kbd>（或用 <kbd>Esc</kbd> 跳關）。

---

## 四、劇情線與主持重點

整場是一條線：**認識自己 → 找到同伴 → 實踐服務 → 發現寶藏就在自己身上**。
每一關結束都有一頁把那一段收掉，主持人照著念就有起承轉合。

| 畫面 | 你要做什麼 |
|---|---|
| 封面 | 等大家掃 QR、輸入名字。人數會即時跳動，等到差不多再開始。 |
| 序章・四段旅程 | 攤開藏寶圖。**先埋伏筆**：「箱子裡的東西可能不是你想的那樣。」 |
| 🧭 第一段 標題 | 「藏寶圖的第一條線索，是你自己。」 |
| Q1–Q10（作答） | 念題目，等「已作答 N / M」追上再按 <kbd>→</kbd>。 |
| Q1–Q10（統計） | 看長條圖，挑一兩個有趣的選項聊兩句。趕時間就直接跳過。 |
| 四象限地圖 | **第一個高潮**。名字會一個一個飛到自己的位置，讓大家找自己。 |
| 六種人格 | 每一頁最下面會列出這一區有誰，可以請他們站起來揮手。趕時間可以只講兩三種。 |
| 🧭 第一段完成 | 收尾：「一個人拿著羅盤，還走不到寶藏。接下來要找的是同伴。」 |
| 🍲 第二段 標題 | **這一關的主旨**：伙食團不只是煮飯，是用一道料理去感動另一個人。 |
| 六大類 | 卡片先發下去（每人 1–2 張），請大家依卡片顏色分成六區。 |
| 任務一～六 | 出情境 → <kbd>T</kbd> 開始計時 → 手上有解的人站起來舉卡 → 隨機請 2–3 位念出卡片上寫的功效 → <kbd>→</kbd> 公布解答。 |
| 終極任務 | 為一個人做一餐，六大類至少四類。每個上場的人要說「我這張卡是為他哪一件事準備的」。收尾講白米／豆腐／豆漿那段。 |
| 🍲 第二段完成 | 收尾：「會為別人多想這一步的人，你剛剛都認識了。」 |
| 🤝 第三段 標題 | 「知道自己是誰、身邊有誰之後，剩下的就是真的去做。」 |
| 三隻猴子 規則 | 三個人一組排成一直線，說明三種猴子。 |
| 三隻猴子 出題 | <kbd>→</kbd> 換題。比劃猴面對投影幕，另外兩位背對。 |
| 🤝 第三段完成 | 收尾：「服務不是誰特別厲害，是三個人一起才成立。」 |
| 💎 開箱 標題 | 「把箱子打開之前，先站在一起。」 |
| 大合照 | 按 <kbd>T</kbd> 跑 3・2・1，攝影同學抓最後那張 📸。 |
| 💎 箱子打開了 | **收線**：「裡面沒有金幣，只有剛剛那張照片。」 |
| 終章 | 「寶藏就在你身上。」講完按 <kbd>→</kbd> 播影片。 |
| 影片 | 播完停在最後一格，按 <kbd>→</kbd> 到結束卡。 |

食材卡任務的參考解答都寫在 [`assets/cards-data.js`](../assets/cards-data.js)，
要改情境或增減食材，改那一個檔就好，投影幕會跟著變。

---

## 五、出事的時候

**手機連不上／投影幕顯示「本機模式」**

先確認 Actions 有跑成功、`FIREBASE_CONFIG` secret 有設。
投影幕的鍵盤流程完全不受影響，可以照跑，差別只有：
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
4. 用不到了的話，把 repo secret `FIREBASE_CONFIG` 一併刪掉。
