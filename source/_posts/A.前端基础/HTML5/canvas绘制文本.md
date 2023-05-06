---
title: canvas绘制文本
categories:
  - A.前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 14:10:24
---
## 在canvas中绘制文本：
- canvas 提供了两种方法来渲染文本：
  - fillText(text, x, y)：在指定的(x,y)位置填充指定的文本；
  - strokeText(text, x, y)：在指定的(x,y)位置绘制文本边框；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillStyle = "green"
              ctx.font = "40px sans-serif"
  
              ctx.fillText("你好", 100, 100);
              ctx.strokeText("你好", 200, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 绘制文本.jpg 绘制文本 %}
## 文本样式
- 字体大小和字体：font 属性在指定时，必须要有大小和字体缺一不可，默认的字体是 font="10px sans-serif"；
- 文本对齐方式：textAlign
  - left：文本左对齐；
  - right：文本右对齐；
  - center：文本居中对齐，居中是基于在 fillText 的时候所给的 x 值，也就是说文本一半在 x 左边，一半在x 右边；
- 文本基线：textBaseline
  - top：文本基线在文本块的顶部；
  - middle：文本基线在文本块的中间；
  - bottom：文本基线在文本块的底部；
## measureText 方法
- 返回一个 TextMetrics 对象，包含关于文本尺寸的信息（例如文本的宽度）；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillStyle = "green";
              ctx.font = "60px sans-serif";
              ctx.fillText("你好", 50, 50);
  
              var obj = ctx.measureText("你好");
              console.log(obj);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img measureText.jpg measureText %}
## 阴影（文本阴影 & 盒模型阴影）
- shadowOffsetX：阴影在 X 轴的延伸距离，默认为 0；
- shadowOffsetY：阴影在 Y 轴的延伸距离，默认为 0；
- shadowBlur：设定阴影的模糊程度，其数值并不跟像素数量挂钩，默认为 0；
- shadowColor：设定阴影颜色效果，默认是全透明的黑色；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              // 文本阴影 & 盒阴影
              ctx.fillStyle = 'green';
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;
              ctx.shadowColor = '#333';
              ctx.shadowBlur = 10;
              ctx.fillRect(200, 300, 400, 200);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 阴影.jpg 阴影 %}