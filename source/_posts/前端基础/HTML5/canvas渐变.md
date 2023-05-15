---
title: canvas渐变
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
abbrlink: '88190237'
date: 2022-04-27 14:15:24
---
## canvas 线性渐变
- createLinearGradient(x1, y1, x2, y2)：表示渐变的起点 (x1,y1) 与终点 (x2,y2)；
- gradient.addColorStop(position, color)
  - position 参数必须是一个 0.0 与 1.0 之间的数值，表示渐变中颜色所在的相对位置，例如，0.5 表示颜色会出现在正中间；
  - color 参数必须是一个有效的 CSS 颜色值（如 #FFF， rgba(0,0,0,1)，等等）；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              var gradient = ctx.createLinearGradient(0, 0, 200, 200);
              gradient.addColorStop(0, "red");
              gradient.addColorStop(0.5, "yellow");
              gradient.addColorStop(0.7, "pink");
              gradient.addColorStop(1, "green");
  
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 300, 300);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 线性渐变.jpg 线性渐变 %}
## canvas 径向渐变
- createRadialGradient(x1, y1, r1, x2, y2, r2)
  - 前三个参数则定义另一个以(x1,y1) 为原点，半径为 r1 的圆；
  - 后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆；
- 示例代码
  ```HTML
  <script type="text/javascript">
    window.onload = function () {
        var canvas = document.querySelector("#test");
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");

            var gradient = ctx.createRadialGradient(150, 150, 50, 150, 150, 100)
            gradient.addColorStop(0, "red");
            gradient.addColorStop(0.5, "yellow");
            gradient.addColorStop(0.7, "pink");
            gradient.addColorStop(1, "green");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 300, 300);
        }
    }
  </script>
  ```
- 效果展示
  {% asset_img 径向渐变.jpg 径向渐变 %}
