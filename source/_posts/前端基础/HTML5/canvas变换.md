---
title: canvas变换
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 14:00:24
---
## 移动
- translate(x, y)：用来移动 canvas 的原点到一个不同的位置；
  - x 是左右偏移量，y 是上下偏移量；
  - 在 canvas 中 translate 是累加的；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              
              // 在canvas中translate是累加的：向右偏移100、向下偏移100
              ctx.translate(50, 50);
              ctx.translate(50, 50);
  
              // 与上面的代码的等价
              // ctx.translate(100,100)
  
              ctx.beginPath();
              ctx.fillRect(0, 0, 100, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 移动.jpg 移动 %}

## 旋转
- rotate(angle)：
  - 这个方法只接受一个参数：旋转的角度(angle)，它是顺时针方向的，以弧度为单位的值；
  - 旋转的中心点始终是 canvas 的原点，如果要改变它，需要用到 translate 方法；
  - 在 canvas 中 rotate 是累加的；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              // 改变原点位置，原点位置现在是（50，50）
              // ctx.translate(50, 50);
  
              // 在canvas中rotate是累加的，以（0，0）为原点旋转 45 度
              ctx.rotate(22.1 * Math.PI / 180)
              ctx.rotate(22.9 * Math.PI / 180)
              
              // 与上面的代码的等价
              // ctx.rotate(45 * Math.PI / 180)
  
              ctx.beginPath();
              ctx.fillRect(0, 0, 200, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 旋转.jpg 旋转 %}
## 缩放
- scale(x, y)：
  - x、y 分别是横轴和纵轴的缩放因子，它们都必须是正值；
  - 值比 1.0 小表示缩小，比 1.0 大则表示放大，值为 1.0 时什么效果都没有；
  - 缩放一般用它来增减图形在 canvas 中的像素数目，对形状、位图进行缩小或者放大；
  - 在 canvas 中 scale 是累乘的；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              // 在canvas中scale是累乘的：放大了 3 倍
              ctx.scale(1.5, 1.5)
              ctx.scale(2, 2)
          
              // css像素是一个抽象单位
              //  放大：使画布内css像素的个数变少，单个css像素所占据的实际物理尺寸变大
              //  缩小：使画布内css像素的个数变多，单个css像素所占据的实际物理尺寸变小
              
              ctx.beginPath();
              ctx.fillRect(0, 0, 50, 50);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 缩放.jpg 缩放 %}