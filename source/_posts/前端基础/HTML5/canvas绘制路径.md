---
title: canvas绘制路径
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
abbrlink: e6df2445
date: 2022-04-27 13:48:24
---

## 图形的基本元素是路径：

路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合；

## 绘制步骤：

- 首先需要创建路径起始点；
- 然后使用画图命令去画出路径；
- 之后把路径封闭；
- 一旦路径生成，就能通过描边或填充路径区域来渲染图形；

## 绘制路径的 API

- beginPath()：开始一条路径，或重置当前的路径；
- moveTo(x, y)：把路径移动到画布中的指定点，不创建线条；
- lineTo(x, y)：添加一个新点，然后创建从该点到画布中最后指定点的线条；
- closePath()：不是必需的，这个方法会通过绘制一条从当前点到开始点的直线来闭合图形；
- stroke()：通过线条来绘制图形轮廓，不会自动调用 closePath()；
- fill()：通过填充路径的内容区域生成实心的图形，自动调用 closePath()；
- rect(x, y, width, height)：绘制一个坐标为（x,y），宽高为 width、height 的矩形；
- lineCap：指定绘制每一条线段末端的属性；
  1. butt :线段末端以矩形结束（默认值）；
  2. round :线段末端以圆形结束；
  3. square:线段末端以矩形结束，线段两端长度增加为线段厚度一半的矩形区域；
- save：将当前状态放入栈中，保存到栈中的绘制状态：
  1. 当前的变换矩阵；
  2. 当前的剪切区域（基本用不到）；
  3. 当前的虚线列表（基本用不到）；
  4. 以下属性当前的值：
     - strokeStyle；
     - fillStyle；
     - lineWidth；
     - lineCap；
     - lineJoin...
- restore：在绘图状态栈中弹出顶端的状态，将 canvas 恢复到最近的保存状态的方法；

## 路径的其他概念

- 路径容器：每次调用路径 api 时，都会向路径容器里做登记，调用 beginPath 时，清空整个路径容器；
- 样式容器：每次调用样式 api 时，都会往样式容器里做登记，调用 save 时候，将样式容器里的状态压入样式栈，调用 restore 时候,将样式栈的栈顶状态弹出到样式样式容器里，进行覆盖；
- 样式栈：调用 save 时候，将样式容器里的状态压入样式栈，调用 restore 时候，将样式栈的栈顶状态弹出到样式样式容器里，进行覆盖；

## 样式容器、样式栈
- 示例代码
  ```javascript
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");

              ctx.save();

              ctx.fillStyle = "pink";
              ctx.save();

              ctx.fillStyle = "deeppink";
              ctx.fillStyle = "blue";
              ctx.save();

              ctx.fillStyle = "red";
              ctx.save();

              ctx.fillStyle = "green";
              ctx.save();

              ctx.beginPath();

              // 出栈两次 为红色
              ctx.restore();
              ctx.restore();
              ctx.fillRect(50, 50, 100, 100);
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 样式容器-样式栈.jpg 样式容器-样式栈 %}

## 案例
### 绘制三角形一
- 示例代码
  ```HTML
  <script type="text/javascript">
    window.onload = function () {
        var canvas = document.querySelector("#test");

        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = "deeppink";
            ctx.fillStyle = "green";
            ctx.lineWidth = 10;

            ctx.moveTo(100, 100);
            ctx.lineTo(100, 200);
            ctx.lineTo(200, 200);
            ctx.lineTo(100, 100);
            ctx.closePath();
            ctx.stroke();

            ctx.moveTo(200, 200);
            ctx.lineTo(200, 300);
            ctx.lineTo(300, 300);
            // fill方法会自动合并路径
            ctx.fill();
        }
    }
  </script>
  ```
- 效果展示
  {% asset_img 绘制三角形一.jpg 绘制三角形一 %}
### 绘制三角形二
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
  
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              ctx.strokeStyle = "deeppink";
              ctx.fillStyle = "green";
              ctx.lineWidth = 10;
  
              ctx.moveTo(100, 100);
              ctx.lineTo(100, 200);
              ctx.lineTo(200, 200);
              ctx.lineTo(100, 100);
              ctx.closePath();
              ctx.stroke();
  
              // 重置当前的路径
              ctx.beginPath();
              ctx.moveTo(200, 200);
              ctx.lineTo(200, 300);
              ctx.lineTo(300, 300);
              // fill方法会自动合并路径
              ctx.fill();
          }
      }
  </script>
  ```
- 效果展示
  {% asset_img 绘制三角形二.jpg 绘制三角形二 %}
### 绘制矩形
- 示例代码
  ```HTML
  <script type="text/javascript">
    window.onload = function () {
        var canvas = document.querySelector("#test");

        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.rect(50, 50, 100, 100);

            // 填充为黑色的矩形
            // ctx.fill();

            // 通过线条来绘制图形轮廓
            ctx.stroke();
        }
    }
  </script>
  ```
- 效果展示
  {% asset_img 绘制矩形.jpg 绘制矩形 %}
### 绘制线段
- 示例代码
  ```HTML
  <script type="text/javascript">
    window.onload = function () {
        //拿到画布
        var canvas = document.querySelector("#test");
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = "pink";
            ctx.lineWidth = 10;

            ctx.lineCap = "round";
            ctx.moveTo(100, 100);
            ctx.lineTo(100, 200);
            ctx.stroke();
        }
    }
  </script>
  ```
- 效果展示
  {% asset_img 绘制线段.jpg 绘制线段 %}
