/* ============================================================
   第一關：志工人格測驗
   題目與人格描述沿用社網 quiz.html，拿掉中英雙語與招生問卷題。
   ============================================================ */
(function (global) {
  "use strict";

  /* 六種人格。pos 是在四象限地圖上的落點：
     x 軸 內斂(-) ↔ 外向(+)，y 軸 對事物環境(-) ↔ 對人(+) */
  var TYPES = {
    chef: {
      emoji: "🍳",
      name: "暖心大廚",
      en: "The Warm Chef",
      tagline: "「吃飽，才有力氣愛人。」",
      desc: "你相信最實在的關心是一頓熱飯。在廚房裡你自在得像回家，切菜的節奏就是你的療癒方式；看著大家把盤子清空，比誰稱讚你都開心。",
      traits: ["照顧型", "手很巧", "餵飽全場", "行動派"],
      color: "#C97A0A",
      pos: [-0.45, -0.75]
    },
    eco: {
      emoji: "🌱",
      name: "山海守護者",
      en: "The Earth Guardian",
      tagline: "「這片風景，值得被好好留下來。」",
      desc: "你待在戶外時最有精神，也最見不得美好的地方被弄髒。你不太說大道理，只是默默彎腰把垃圾撿起來，而那個背影，往往就帶動了一整群人。",
      traits: ["行動勝於言語", "體力好", "環保魂", "耐得住"],
      color: "#5F8F12",
      pos: [0.70, -0.80]
    },
    teacher: {
      emoji: "🎓",
      name: "熱血小老師",
      en: "The Camp Teacher",
      tagline: "「我知道的，都想教給你。」",
      desc: "你享受把複雜的事情講到別人聽懂的那一刻。備課、設計關卡、想破頭要怎麼讓孩子玩得開心又學得到東西，這些對你不是負擔，是成就感的來源。",
      traits: ["有耐心", "會規劃", "喜歡分享", "抗壓性強"],
      color: "#12758F",
      pos: [0.55, 0.55]
    },
    listener: {
      emoji: "💗",
      name: "溫柔傾聽者",
      en: "The Gentle Listener",
      tagline: "「我在，你慢慢說。」",
      desc: "你是朋友圈裡那個大家都想找的人。你不急著給建議，只是安靜地陪著，而這份安靜，常常比任何話都有力量。崇德想成為學生的第二個家，靠的正是你這種人。",
      traits: ["同理心強", "很好聊", "情緒穩定", "值得信賴"],
      color: "#C93B71",
      pos: [-0.75, 0.80]
    },
    player: {
      emoji: "🎲",
      name: "歡樂揪團王",
      en: "The Party Starter",
      tagline: "「哪裡有人，哪裡就有我。」",
      desc: "你是場子的開關。冷場十秒你就受不了，總能找到話題把所有人串在一起。認識新朋友對你來說不是社交壓力，是這學期最期待的事。",
      traits: ["活力滿點", "自來熟", "氣氛製造機", "點子多"],
      color: "#D6470F",
      pos: [0.85, 0.75]
    },
    paws: {
      emoji: "🐾",
      name: "毛小孩守護者",
      en: "The Paw Protector",
      tagline: "「牠們不會說話，所以我們要在。」",
      desc: "你對弱小的生命特別沒有抵抗力。看到毛小孩會忍不住停下腳步，也願意為了牠們花時間做那些不浪漫的事：清籠子、洗毛巾、陪散步。溫柔而且很硬頸。",
      traits: ["有愛心", "細心", "不怕髒", "默默付出"],
      color: "#7C4BB0",
      pos: [-0.70, -0.55]
    }
  };

  var ORDER = ["chef", "eco", "teacher", "listener", "player", "paws"];

  /* 四個象限的名字。key 是 [x正負][y正負] */
  var QUADRANTS = [
    { at: "tr", title: "點火的人",   sub: "你一到場，氣氛就亮了", color: "#D6470F" },
    { at: "tl", title: "接住人的人", sub: "有你在，大家都很安心", color: "#0E8C8F" },
    { at: "bl", title: "撐住事的人", sub: "沒有你，這件事就散了", color: "#5F8F12" },
    { at: "br", title: "往前衝的人", sub: "你先動，大家就跟上",   color: "#7C4BB0" }
  ];

  var QUESTIONS = [
    {
      q: "你想在大學裡帶走什麼？",
      opts: [
        { t: "發現自我價值",   s: { listener: 2, teacher: 1 } },
        { t: "認識一群好朋友", s: { player: 3 } },
        { t: "專業能力養成",   s: { teacher: 3 } },
        { t: "健身與戶外活動", s: { eco: 3 } },
        { t: "學會照顧自己",   s: { chef: 3 } },
        { t: "為別人做點什麼", s: { paws: 2, listener: 1 } }
      ]
    },
    {
      q: "你的飲食習慣比較接近？",
      opts: [
        { t: "暴龍型：無肉不歡",           s: { player: 2, chef: 1 } },
        { t: "螞蟻型：超喜歡吃甜的",       s: { listener: 2, chef: 1 } },
        { t: "吃貨型：只要是吃的我都不挑", s: { chef: 3 } },
        { t: "綿羊型：素食才是我的本命",   s: { eco: 2, paws: 2 } }
      ]
    },
    {
      q: "壓力大的時候，你通常會？",
      opts: [
        { t: "去運動、往山上海邊跑", s: { eco: 3 } },
        { t: "聽音樂、看片、打遊戲", s: { player: 3 } },
        { t: "找朋友家人聊一聊",     s: { listener: 3 } },
        { t: "吃一頓好的然後睡飽",   s: { chef: 3 } },
        { t: "閱讀、冥想、寫日記",   s: { teacher: 3 } },
        { t: "抱一下毛小孩",         s: { paws: 3 } }
      ]
    },
    {
      q: "難得空下來的週末，你最想？",
      opts: [
        { t: "在廚房研究一道新菜", s: { chef: 3 } },
        { t: "上山下海走一走",     s: { eco: 3 } },
        { t: "準備一堂想分享的課", s: { teacher: 3 } },
        { t: "找朋友聊聊近況",     s: { listener: 3 } },
        { t: "揪一場桌遊或 KTV",   s: { player: 3 } },
        { t: "去陪浪浪散步",       s: { paws: 3 } },
        { t: "宅在家追劇補眠",     s: { listener: 2, chef: 1 } }
      ]
    },
    {
      q: "在一個團體裡，你通常是？",
      opts: [
        { t: "負責張羅吃的那個",     s: { chef: 3 } },
        { t: "負責帶氣氛的那個",     s: { player: 3 } },
        { t: "負責規劃流程的那個",   s: { teacher: 3 } },
        { t: "負責聽大家說話的那個", s: { listener: 3 } },
        { t: "負責收尾整理的那個",   s: { eco: 2, teacher: 1 } }
      ]
    },
    {
      q: "你接觸過志工服務嗎？",
      opts: [
        { t: "有，已經做過不少次",   s: { teacher: 2 } },
        { t: "有，參加過一兩次",     s: { eco: 1 } },
        { t: "還沒有，想從崇德開始", s: { player: 1 } }
      ]
    },
    {
      q: "參加過崇德文教基金會辦的活動嗎？",
      multi: true,
      opts: [
        { t: "讀經班",       s: { listener: 1, teacher: 1 } },
        { t: "4Q 成長營",    s: { teacher: 2 } },
        { t: "淨灘",         s: { eco: 2 } },
        { t: "義診",         s: { paws: 1, listener: 1 } },
        { t: "都沒有參加過", s: {}, none: true }
      ]
    },
    {
      q: "志工服務裡，最吸引你的是？",
      opts: [
        { t: "看見別人因為我而笑",     s: { listener: 3 } },
        { t: "練到帶團隊的真本事",     s: { teacher: 3 } },
        { t: "讓環境變得更好一點",     s: { eco: 3 } },
        { t: "認識一群志同道合的人",   s: { player: 3 } },
        { t: "照顧需要幫助的生命",     s: { paws: 3 } },
        { t: "一起煮飯一起吃飯的感覺", s: { chef: 3 } }
      ]
    },
    {
      q: "如果社團要你負責一件事，你最想接？",
      opts: [
        { t: "開伙採買掌廚", s: { chef: 3 } },
        { t: "帶新生破冰",   s: { player: 3 } },
        { t: "設計營隊教案", s: { teacher: 3 } },
        { t: "當大家的樹洞", s: { listener: 3 } },
        { t: "淨山淨灘場勘", s: { eco: 3 } },
        { t: "浪浪之家出隊", s: { paws: 3 } }
      ]
    },
    {
      q: "最後，哪句話最像你？",
      opts: [
        { t: "「吃飽才有力氣愛人。」",     s: { chef: 3 } },
        { t: "「地球是我家。」",           s: { eco: 3 } },
        { t: "「我想把知道的都教給你。」", s: { teacher: 3 } },
        { t: "「我在，你說吧。」",         s: { listener: 3 } },
        { t: "「哪裡有人，哪裡就有我。」", s: { player: 3 } },
        { t: "「毛小孩也是家人。」",       s: { paws: 3 } }
      ]
    }
  ];

  /** 作答一律轉成陣列，單選、複選、沒作答都能一起處理 */
  function asList(choice) {
    if (Array.isArray(choice)) { return choice; }
    if (choice == null || typeof choice === "string") { return []; }
    return [choice];
  }

  /** 六類分數 */
  function scores(answers) {
    var total = {};
    ORDER.forEach(function (k) { total[k] = 0; });

    Object.keys(answers || {}).forEach(function (qi) {
      var q = QUESTIONS[Number(qi)];
      if (!q) { return; }
      asList(answers[qi]).forEach(function (ci) {
        var opt = q.opts[ci];
        if (!opt || !opt.s) { return; }
        Object.keys(opt.s).forEach(function (k) { total[k] += opt.s[k]; });
      });
    });
    return total;
  }

  /** 最高分那類；同分依 ORDER 先後 */
  function typeOf(answers) {
    var t = scores(answers);
    var best = ORDER[0];
    ORDER.forEach(function (k) { if (t[k] > t[best]) { best = k; } });
    return best;
  }

  /**
   * 象限座標：六類分數對各自落點做加權重心，再往外推一點讓分佈開一些。
   * 完全沒作答的人回 null，交給呼叫端決定要不要畫。
   */
  function position(answers) {
    var t = scores(answers);
    var sum = 0, x = 0, y = 0;

    ORDER.forEach(function (k) {
      var w = t[k];
      if (w <= 0) { return; }
      sum += w;
      x += w * TYPES[k].pos[0];
      y += w * TYPES[k].pos[1];
    });

    if (!sum) { return null; }

    var clamp = function (v) { return Math.max(-1, Math.min(1, v)); };
    return { x: clamp(x / sum * 1.35), y: clamp(y / sum * 1.35) };
  }

  global.CDVC_QUIZ = {
    TYPES: TYPES,
    ORDER: ORDER,
    QUADRANTS: QUADRANTS,
    QUESTIONS: QUESTIONS,
    asList: asList,
    scores: scores,
    typeOf: typeOf,
    position: position
  };
})(window);
