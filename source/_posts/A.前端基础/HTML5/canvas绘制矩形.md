---
title: canvas绘制矩形
categories:
  - A.前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 13:45:24
---

## HTML 中的元素 canvas 只支持一种原生的图形绘制：
- 原生只支持矩形绘制；
- 所有其他的图形的绘制都至少需要生成一条路径；

## 绘制矩形
- canvas 提供了三种方法绘制矩形：
    1. 绘制一个填充的矩形（填充色默认为黑色）：fillRect(x, y, width, height)
    2. 绘制一个矩形的边框（边框为一像素黑色）：strokeRect(x, y, width, height)
    3. 清除指定矩形区域（实际上是画了一个矩形在最上面）：clearRect(x, y, width, height)
- x、y 指定了绘制的矩形的左上角的坐标；
- width、height 设置矩形的尺寸（存在边框的话，边框会在 width、height 上占据一个边框的宽度）；

## strokeRect 边框像素渲染问题
- 按理渲染出的边框应该是 1px的，canvas 在渲染矩形边框时，边框宽度是平均分在偏移位置的两侧；
- context.strokeRect(100,100,100,100)：边框会渲染在 99.5 和 100.5 之间，浏览器是不会让一个像素只用自己的一半的，相当于边框会渲染在 99 到 101 之间（2像素边框）；
  ```JavaScript
  window.onload = function() {
    // 拿到画布
    var canvas = document.querySelector('#test');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      // 注意不加单位
      // 填充的矩形
      ctx.fillRect(0, 0, 100, 100);

      // 带边框的矩形
      ctx.strokeRect(100, 100, 100, 100);
    }
  };
  ```
  {% asset_img 1px边框.jpg 1px边框 %}
- context.strokeRect(100.5,100.5,100,100)：边框会渲染在 100 到 101 之间（1像素边框）；
  ```JavaScript
  window.onload = function() {
    // 拿到画布
    var canvas = document.querySelector('#test');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      // 注意不加单位
      // 填充的矩形
      ctx.fillRect(0, 0, 100, 100);

      // 带边框的矩形
      ctx.strokeRect(100.5, 100.5, 100, 100);
    }
  };
  ```
  {% asset_img 2px边框.jpg 2px边框 %}

## 添加样式和颜色（样式写在绘制图形之前）
- fillStyle：设置图形的填充颜色（默认黑色）；
- strokeStyle：设置图形轮廓的颜色（默认黑色）；
- lineWidth：设置当前绘线的粗细，属性值必须为正数（默认值是1.0，0、负数、Infinity 和 NaN 会被忽略）；
- lineJoin：设定线条与线条间接合处的样式（默认是 miter）
  - round : 圆角；
  - bevel : 斜角；
  - miter : 直角；
- 示例代码
  ```HTML
  <body>
      <canvas id="test" width="300" height="300">
          <span>您的浏览器不支持画布元素 请您换成谷歌</span>
      </canvas>
  </body>
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              // 设置图形的填充颜色
              ctx.fillStyle = "deeppink";
              // 设置图形轮廓的颜色
              ctx.strokeStyle = "pink";
              // 设置当前绘线的粗细
              ctx.lineWidth = 25;
              // 设定线条与线条间接合处的样式：圆角、斜角、直角
              ctx.lineJoin = "round";
              ctx.fillRect(0, 0, 100, 100)
              ctx.strokeRect(100, 100, 100, 100)
              // ctx.clearRect(100,100,100,100)
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 绘制矩形.jpg 绘制矩形 %}