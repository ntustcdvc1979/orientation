/* ============================================================
   投影幕上的三面照片牆

   檔案放在 media/photos/，網頁一律用 webp（原始 jpg 留在
   media/photos/original/，不進版本庫）。要換照片就改這份清單。

   版面是「等高justified」排法：同一列的照片高度一樣、寬度依原始比例，
   所以每一張都完整呈現，不會被裁掉，也不會出現letterbox黑邊。
   照片張數多少都排得出來，載不到的那張會自己消失。
   ============================================================ */
window.CDVC_PHOTOS = {

  /* 第二段收尾：伙食團平常的樣子 */
  kitchen: {
    eyebrow: "第二段・找到同伴",
    title: "這就是我們平常開伙的樣子",
    lede: "每週三 18:30，蔬食開伙，歡迎下課後來用餐。<br>如果早一點來，學長姐手把手教你煮飯喔。",
    items: [
      { src: "media/photos/a0.webp", alt: "伙食團開伙" },
      { src: "media/photos/a1.webp", alt: "一起備料" },
      { src: "media/photos/a2.webp", alt: "廚房裡的日常" },
      { src: "media/photos/a3.webp", alt: "一起煮飯" },
      { src: "media/photos/a4.webp", alt: "上菜前" },
      { src: "media/photos/a5.webp", alt: "圍在一起吃飯" }
    ]
  },

  /* 第三段收尾：真的做過的服務 */
  service: {
    eyebrow: "這些，都是我們真的做過的事",
    title: "為眾生服務的樣子",
    items: [
      { src: "media/photos/01.webp", alt: "淨灘結束，全隊面向大海" },
      { src: "media/photos/02.webp", alt: "浪浪之家，抱著黑狗的志工" },
      { src: "media/photos/03.webp", alt: "狗場志工大合照" },
      { src: "media/photos/04.webp", alt: "這是今日成果" },
      { src: "media/photos/05.webp", alt: "海邊淨灘，撿拾漂流垃圾" },
      { src: "media/photos/06.webp", alt: "騎單車沿河濱環境志工" },
      { src: "media/photos/07.webp", alt: "兒童營隊大合照" }
    ]
  },

  /* 第三段收尾之後：災難現場 */
  relief: {
    eyebrow: "服務不挑地點",
    title: "賑災在哪，我們就在哪",
    lede: "醫療關懷隊帶著血壓計、血氧機和物資出隊。<br>不是等一切都好了才去，是<b>需要的時候就在</b>。",
    items: [
      { src: "media/photos/10.webp", alt: "醫療關懷隊在災區服務" }
    ]
  },

  /* 第三段收尾之後：服務不只在台灣 */
  global: {
    eyebrow: "而且不只在台灣",
    title: "我們也去海外義診交流",
    lede: "跟著團隊出國做義診、做交流，<br>你會發現<b>需要幫忙的人到處都有</b>，<br>而你的手可以伸得比想像中更遠。",
    items: [
      { src: "media/photos/08.webp", alt: "海外義診服務現場" },
      { src: "media/photos/09.webp", alt: "海外交流合影" }
    ]
  }
};
