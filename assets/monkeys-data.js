/* ============================================================
   第三關：三隻猴子

   三個角色：
     🙈 猜題猴  閉上眼睛、背對投影幕，只能用聽的
     🙊 比劃猴  面對投影幕看題目，只能比手畫腳，一個字都不能說
     🙉 傳話猴  背對投影幕，看比劃猴的動作，用嘴巴把指令說給猜題猴聽

   題庫都是志工社會遇到的人事物，越後面越難。
   ============================================================ */
(function (global) {
  "use strict";

  var TERMS = [
    /* --- 熱身 --- */
    { t: "淨灘",         level: 1 },
    { t: "洗碗",         level: 1 },
    { t: "垃圾分類",     level: 1 },
    { t: "環保筷",       level: 1 },
    { t: "圍裙",         level: 1 },
    { t: "大聲公",       level: 1 },
    { t: "便當",         level: 1 },
    { t: "資源回收",     level: 1 },

    /* --- 伙食團 --- */
    { t: "洗米",         level: 2 },
    { t: "切菜",         level: 2 },
    { t: "蒸飯",         level: 2 },
    { t: "擺盤",         level: 2 },
    { t: "廚餘",         level: 2 },
    { t: "素食便當",     level: 2 },
    { t: "每週三開伙",   level: 2 },
    { t: "擦桌子",       level: 2 },

    /* --- 社團活動 --- */
    { t: "淨山",         level: 2 },
    { t: "桌遊之夜",     level: 2 },
    { t: "破冰遊戲",     level: 2 },
    { t: "大地遊戲",     level: 2 },
    { t: "中秋烤肉",     level: 2 },
    { t: "火鍋趴",       level: 2 },
    { t: "聖誕交換禮物", level: 2 },
    { t: "迎新茶會",     level: 2 },
    { t: "社團博覽會",   level: 2 },
    { t: "大合照",       level: 2 },

    /* --- 進階 --- */
    { t: "讀經班",       level: 3 },
    { t: "4Q 成長營",    level: 3 },
    { t: "STEAM 科學營", level: 3 },
    { t: "義診",         level: 3 },
    { t: "志工時數",     level: 3 },
    { t: "服務學習",     level: 3 },
    { t: "營隊教案",     level: 3 },
    { t: "帶動唱",       level: 3 },
    { t: "文昌祈福",     level: 3 },
    { t: "擴香石",       level: 3 },
    { t: "戳戳繡",       level: 3 },
    { t: "浪浪之家",     level: 3 },
    { t: "陪伴長輩",     level: 3 },
    { t: "送餐服務",     level: 3 },
    { t: "場勘",         level: 3 },
    { t: "隊輔",         level: 3 },
    { t: "關主",         level: 3 },
    { t: "幹部會議",     level: 3 }
  ];

  var ROLES = [
    { emoji: "🙈", name: "猜題猴", rule: "閉上眼睛、背對投影幕。你只能用聽的，把答案講出來。" },
    { emoji: "🙊", name: "比劃猴", rule: "面對投影幕看題目。只能比手畫腳，發出任何一個字就算犯規。" },
    { emoji: "🙉", name: "傳話猴", rule: "背對投影幕，只看得到比劃猴。用嘴巴把你看到的講給猜題猴聽。" }
  ];

  /** 洗牌，讓每一場的題序都不一樣 */
  function shuffled() {
    var a = TERMS.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    // 先簡單後難，同一難度內隨機
    return a.sort(function (x, y) { return x.level - y.level; });
  }

  global.CDVC_MONKEYS = { TERMS: TERMS, ROLES: ROLES, shuffled: shuffled };
})(window);
