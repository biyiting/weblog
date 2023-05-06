---
title: canvas绘制曲线
categories:
  - A.前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 13:50:24
---
## 角度与弧度的 js 表达式 <b><small>radius = （Math.PI/180）* degrees</small></b>

## canvas 绘制圆形
- arc(x, y, radius, startAngle, endAngle, anticlockwise)：
  -  x、y 为圆心坐标；
  -  radius 为半径；
  -  startAngle、endAngle 参数用弧度定义了开始以及结束的弧度，这些都是以 x 轴为基准；
  - 参数 anticlockwise 为一个布尔值，为 true 时，是逆时针方向，否则顺时针方向；
    {% asset_img 坐标系.jpg 坐标系 %}
- 示例代码：
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.beginPath();
              ctx.moveTo(100, 100);// 设置起点
  
              // 以（100，100）为圆心，50为半径，0弧度开始，90弧度结束，逆向开始画圆
              ctx.arc(100, 100, 50, 0, 90 * Math.PI / 180, true);
  
              ctx.closePath();
              ctx.stroke();
          }
      }
  </script>
  ```
- 效果展示：
  {% asset_img 绘制圆形.jpg 绘制圆形 %}
## canvas 绘制一段圆弧
- arcTo(x1, y1, x2, y2, radius)：根据给定的控制点和半径radius画一段圆弧，肯定会从(x1 y1) ，但不一定经过(x2 y2)，(x2 y2)只是控制一个方向；
- 示例代码：
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              ctx.beginPath();
              ctx.moveTo(50, 50);
              ctx.lineTo(300, 0);
              ctx.lineTo(200, 200);
              ctx.stroke();
  
              ctx.beginPath();
              ctx.moveTo(50, 50)
              //以（300，0）、（200，200）为控制点，绘制一个半径是50的一段圆弧
              ctx.arcTo(300, 0, 200, 200, 50);
              ctx.stroke();
          }
      }
  </script>
  ```
- 效果展示：
  {% asset_img 一次贝塞尔曲线.jpg 一次贝塞尔曲线 %}
## 二次贝塞尔
- quadraticCurveTo(cp1x, cp1y, x, y)：绘制二次贝塞尔曲线，cp1x、cp1y 为一个控制点，x、y 为结束点，起始点为 moveto 时指定的点；
- 示例代码：
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              ctx.beginPath();
              ctx.moveTo(50, 50);
              ctx.lineTo(300, 0);
              ctx.lineTo(200, 200);
              ctx.stroke();
  
              ctx.beginPath();
              ctx.moveTo(50, 50)
              //以（300，0）、（200，200）绘制二次贝塞尔曲线
              ctx.quadraticCurveTo(300, 0, 200, 200);
              ctx.stroke();
          }
      }
  </script>
  ```
- 效果展示：
  {% asset_img 二次贝塞尔曲线.jpg 二次贝塞尔曲线 %}
## 三次贝塞尔
- bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)：cp1x、cp1y 为控制点一，cp2x、cp2y 为控制点二，x、y 为结束点，起始点为moveto时指定的点；
- 示例代码：
  ```HTML
  <script type="text/javascript">
    window.onload = function () {
        var canvas = document.querySelector("#test");
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(300, 0);
            ctx.lineTo(0, 300);
            ctx.lineTo(300, 300);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(50, 50)
            //以（300，0）、（0，300）、（300，300）绘制三次贝塞尔曲线
            ctx.bezierCurveTo(300, 0, 0, 300, 300, 300);
            ctx.stroke();
        }
    }
  </script>
  ```
- 效果展示：
  {% asset_img 三次贝塞尔曲线.jpg 三次贝塞尔曲线 %}