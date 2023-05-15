---
title: canvas导出和事件
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
abbrlink: 10e45b10
date: 2022-04-27 14:30:24
---
## 将画布导出为图像
- toDataURL（canvas 元素接口上的方法）
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillRect(0, 0, 199, 199);
              var result = canvas.toDataURL();
  
              // 生成 base64 格式的文件
              console.log(result);
          }
      }
  </script>
  ```
## 事件操作
- ctx.isPointInPath(x, y)：判断在当前路径中是否包含检测点；
- 注意：此方法只作用于最新画出的 canvas 图像；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
              ctx.beginPath();
              ctx.arc(100, 100, 50, 0, 360 * Math.PI / 180);
              ctx.fill();
  
              ctx.beginPath();
              ctx.arc(200, 200, 50, 0, 360 * Math.PI / 180);
              ctx.fill();
  
              canvas.onclick = function (ev) {
                  ev = ev || event;
                  var x = ev.clientX - canvas.offsetLeft;
                  var y = ev.clientY - canvas.offsetTop;
                  if (ctx.isPointInPath(x, y)) {
                      alert('当前路径包含检测点...');
                  }
              }
          }
      }
  </script>
  ```