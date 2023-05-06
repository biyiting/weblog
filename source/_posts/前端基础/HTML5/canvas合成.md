---
title: canvas合成
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 14:20:24
---
## 全局透明度的设置
- globalAlpha：影响到 canvas 里所有图形的透明度，有效的值范围是 0.0 ~ 1.0，默认是 1.0；
- 示例代码：
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillStyle = "red";
              ctx.globalAlpha = 0.5;
  
              ctx.fillRect(0, 0, 100, 100);
              ctx.fillRect(100, 100, 100, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 全局透明度.jpg 全局透明度 %}
## 覆盖合成
- globalCompositeOperation
  - source：新的图像(源)
    - source-over(默认值)：源在上面,新的图像层级比较高
    - source-in：只留下源与目标的重叠部分(源的那一部分)
    - source-out：只留下源超过目标的部分
    - source-atop：砍掉源溢出的部分       
  - destination：已经绘制过的图形(目标)
    - destination-over：目标在上面,旧的图像层级比较高
    - destination-in：只留下源与目标的重叠部分(目标的那一部分)
    - destination-out：只留下目标超过源的部分
    - destination-atop：砍掉目标溢出的部分
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillStyle = "pink";
              ctx.fillRect(50, 50, 100, 100);
  
              // 砍掉目标溢出的部分
              ctx.globalCompositeOperation = "destination-atop";
  
              ctx.fillStyle = "green";
              ctx.fillRect(100, 100, 100, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 覆盖合成.jpg 覆盖合成 %}