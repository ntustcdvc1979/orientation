/* ============================================================
   連線層

   三種模式，會自動往下退，投影幕永遠跑得動：

     firebase  assets/config.js 有填設定 → 跨裝置即時同步
     local     沒填或連不上 → 同一台瀏覽器的分頁之間同步（BroadcastChannel）
               開發測試、以及現場臨時只用一台電腦時用得到

   誰寫什麼：
     stage  只寫 state，只讀 players
     play   只寫自己那筆 player，只讀 state
   ============================================================ */
(function (global) {
  "use strict";

  var CFG = global.CDVC_CONFIG || {};

  /** 網址上的 ?r= 可以臨時換房號，方便同一天跑兩場不互相干擾 */
  function roomCode() {
    var q = new URLSearchParams(location.search).get("r");
    return (q || CFG.room || "CDVC").toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  }

  var ROOM = roomCode();
  var PID_KEY = "cdvc:pid:" + ROOM;

  function newId() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  /** 同一支手機重整不要變成新的人 */
  function myId() {
    var id = "";
    try { id = localStorage.getItem(PID_KEY) || ""; } catch (e) { /* 無痕模式 */ }
    if (!id) {
      id = newId();
      try { localStorage.setItem(PID_KEY, id); } catch (e) { /* 存不了就每次都是新的，可接受 */ }
    }
    return id;
  }

  var NET = {
    room: ROOM,
    mode: "local",          // "firebase" | "local"
    connected: false,       // firebase 模式下，線路是不是真的通的
    onStatus: null,         // 連線狀態變化時的回呼
    pid: myId(),
    ready: false
  };

  var stateCbs = [];
  var playerCbs = [];
  var lastState = null;
  var lastPlayers = {};

  function fireState(s) {
    lastState = s;
    stateCbs.forEach(function (cb) { try { cb(s); } catch (e) { console.error(e); } });
  }

  function firePlayers(p) {
    lastPlayers = p || {};
    playerCbs.forEach(function (cb) { try { cb(lastPlayers); } catch (e) { console.error(e); } });
  }

  /* ---------- local：同瀏覽器分頁同步 ---------- */
  var LS_STATE = "cdvc:" + ROOM + ":state";
  var LS_PLAYERS = "cdvc:" + ROOM + ":players";
  var chan = null;

  function lsGet(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }

  function lsSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 滿了就算了 */ }
  }

  function localInit() {
    NET.mode = "local";
    try { chan = new BroadcastChannel("cdvc:" + ROOM); } catch (e) { chan = null; }

    if (chan) {
      chan.onmessage = function (ev) {
        var m = ev.data || {};
        if (m.t === "state") { fireState(m.v); }
        if (m.t === "players") { firePlayers(m.v); }
      };
    }

    // 不同分頁若沒有 BroadcastChannel，還有 storage 事件可以撐著
    global.addEventListener("storage", function (ev) {
      if (ev.key === LS_STATE) { fireState(lsGet(LS_STATE, null)); }
      if (ev.key === LS_PLAYERS) { firePlayers(lsGet(LS_PLAYERS, {})); }
    });

    fireState(lsGet(LS_STATE, null));
    firePlayers(lsGet(LS_PLAYERS, {}));
  }

  function localBroadcast(type, value) {
    if (chan) { chan.postMessage({ t: type, v: value }); }
  }

  /* ---------- firebase ---------- */
  var fb = null;   // { db, ref, set, update, remove, onValue }

  function hasFirebaseConfig() {
    var f = CFG.firebase || {};
    return !!(f.apiKey && f.databaseURL);
  }

  function firebaseInit() {
    var V = "https://www.gstatic.com/firebasejs/10.12.2/";

    return Promise.all([
      import(V + "firebase-app.js"),
      import(V + "firebase-database.js")
    ]).then(function (mods) {
      var app = mods[0].initializeApp(CFG.firebase);
      var d = mods[1];
      fb = {
        db: d.getDatabase(app),
        ref: d.ref,
        set: d.set,
        update: d.update,
        remove: d.remove,
        onValue: d.onValue,
        get: d.get,
        onDisconnect: d.onDisconnect
      };
      NET.mode = "firebase";
    });
  }

  function path(sub) { return "rooms/" + ROOM + (sub ? "/" + sub : ""); }

  /* ---------- 對外 ---------- */

  /**
   * @param {"stage"|"play"} role
   * @returns {Promise<{mode:string}>} 一定 resolve；連不上就退到 local
   */
  NET.init = function (role) {
    NET.role = role;

    var start = hasFirebaseConfig()
      ? firebaseInit()["catch"](function (err) {
          console.warn("[cdvc] Firebase 連不上，改用本機模式：", err && err.message);
          fb = null;
        })
      : Promise.resolve();

    return start.then(function () {
      if (fb) {
        // 連線真的通了沒有。設定填錯的話 initializeApp 不會報錯，
        // 要靠這裡才看得出來，主持人才不會以為一切正常。
        fb.onValue(fb.ref(fb.db, ".info/connected"), function (snap) {
          NET.connected = !!snap.val();
          if (NET.onStatus) { NET.onStatus(NET.connected); }
        });

        // state：兩個角色都要聽
        fb.onValue(fb.ref(fb.db, path("state")), function (snap) {
          fireState(snap.val());
        });
        if (role === "stage") {
          fb.onValue(fb.ref(fb.db, path("players")), function (snap) {
            firePlayers(snap.val() || {});
          });
        }
      } else {
        localInit();
      }
      NET.ready = true;
      return { mode: NET.mode };
    });
  };

  NET.onState = function (cb) {
    stateCbs.push(cb);
    if (lastState) { cb(lastState); }
  };

  NET.onPlayers = function (cb) {
    playerCbs.push(cb);
    if (lastPlayers) { cb(lastPlayers); }
  };

  /** 只有 stage 該呼叫 */
  NET.setState = function (s) {
    var payload = Object.assign({}, s, { updatedAt: Date.now() });
    if (fb) {
      fb.set(fb.ref(fb.db, path("state")), payload)["catch"](function (e) {
        console.warn("[cdvc] setState 失敗", e);
      });
    } else {
      lsSet(LS_STATE, payload);
      localBroadcast("state", payload);
      fireState(payload);
    }
  };

  /** 只有 play 該呼叫。回傳 Promise，讓手機端知道有沒有送出去。 */
  NET.savePlayer = function (patch) {
    if (fb) {
      return fb.update(fb.ref(fb.db, path("players/" + NET.pid)), patch);
    }
    var all = lsGet(LS_PLAYERS, {});
    all[NET.pid] = Object.assign({}, all[NET.pid], patch);
    lsSet(LS_PLAYERS, all);
    localBroadcast("players", all);
    firePlayers(all);
    return Promise.resolve();
  };

  /** 作答。分開一支是因為 answers 底下要用 key 更新，不能整包覆蓋。 */
  NET.saveAnswer = function (qi, value) {
    var patch = {};
    patch["answers/" + qi] = value;
    if (fb) {
      return fb.update(fb.ref(fb.db, path("players/" + NET.pid)), patch);
    }
    var all = lsGet(LS_PLAYERS, {});
    var me = all[NET.pid] || {};
    me.answers = me.answers || {};
    me.answers[qi] = value;
    all[NET.pid] = me;
    lsSet(LS_PLAYERS, all);
    localBroadcast("players", all);
    firePlayers(all);
    return Promise.resolve();
  };

  /**
   * 讀回自己這一筆。手機重整、或中途換頁回來時要用，
   * 不然本機記憶體是空的，結果頁會用不完整的答案去算人格。
   */
  NET.loadMe = function () {
    if (fb) {
      return fb.get(fb.ref(fb.db, path("players/" + NET.pid)))
        .then(function (snap) { return snap.val(); })
        ["catch"](function () { return null; });
    }
    return Promise.resolve(lsGet(LS_PLAYERS, {})[NET.pid] || null);
  };

  /** 活動結束或重跑一場：清掉這個房間的所有人 */
  NET.clearPlayers = function () {
    if (fb) { return fb.remove(fb.ref(fb.db, path("players"))); }
    lsSet(LS_PLAYERS, {});
    localBroadcast("players", {});
    firePlayers({});
    return Promise.resolve();
  };

  /** 手機端要掃的網址 */
  NET.playUrl = function () {
    if (CFG.playUrl) {
      return CFG.playUrl + (CFG.playUrl.indexOf("?") >= 0 ? "&" : "?") + "r=" + ROOM;
    }
    var base = location.href.replace(/[^/]*$/, "");
    return base + "play.html?r=" + ROOM;
  };

  global.CDVC_NET = NET;
})(window);
