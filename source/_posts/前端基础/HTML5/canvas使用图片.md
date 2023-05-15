---
title: canvas使用图片
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
abbrlink: bcf60bef
date: 2022-04-27 14:08:24
---
## 在canvas中插入图片(需要image对象)
- canvas操作图片时，必须要等图片加载完才能操作；
- drawImage(image, x, y, width, height)
  - 其中 image 是 image 或者 canvas 对象，x 和 y 是 canvas 里的起始坐标；
  - width 和 height 这两个参数用来控制向 canvas 画入时应该缩放的大小；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              var img = new Image();
              img.src = "tg.png";
  
              img.onload = function () {
                  ctx.drawImage(img, 0, 0, img.width, img.height)
              }
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 插入图片.jpg 插入图片 %}
## 在 canvas 中设置背景(需要image对象)
- createPattern(image, repetition)
  - image:图像源
  - epetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" 
  - 一般情况下，都会将 createPattern 返回的对象作为 fillstyle 的值；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              var img = new Image();
              img.src = "tg.png";
  
              img.onload = function () {
                  ctx.fillStyle = ctx.createPattern(img, "no-repeat");
                  ctx.fillRect(0, 0, 00, 600);
              }
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 设置背景.jpg 设置背景 %}