投影幕上的照片，一律用 webp。

  01 ~ 07   第三段收尾的志工服務照片牆
  08 ~ 09   海外義診交流
  a0 ~ a5   第二段收尾，伙食團平常開伙的樣子

清單在 assets/photos-data.js，要換照片就改那一份。
原始 jpg 放在 original/，那個資料夾不會進版本庫。

加新照片：
  cwebp -q 80 -metadata none 新照片.jpg -o 新照片.webp
長邊超過 1600px 再加 -resize 1600 0（直式是 -resize 0 1600）。
