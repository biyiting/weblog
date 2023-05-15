---
title: canvas像素操作
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
abbrlink: 985663f1
date: 2022-04-27 14:18:24
---
## ImageData 对象
- 存储着 canvas 对象真实的像素数据
- width：图片宽度，单位是像素；
- height：图片高度，单位是像素；
- data：Uint8ClampedArray 类型的一维数组，包含着 RGBA 格式 的整型数据，范围在 [0，255] 之间；
  - R：0 --> 255（黑色到白色）；
  - G：0 --> 255（黑色到白色）；
  - B：0 --> 255（黑色到白色）；
  - A：0 --> 255（透明到不透明）；
- ImageData 对象示例：
  {% asset_img ImageData.jpg ImageData %}

## 写入 ImageData 对象
- ctx.putImageData(myImageData, dx, dy)：在场景中写入像素数据
- dx：表示绘制的像素数据的设备左上角 x 坐标；
- dy：表示绘制的像素数据的设备左上角 y 坐标；
## 获取 ImageData 对象
- ctx.getImageData(sx, sy, sw, sh)
- 获得一个包含画布场景像素数据的 ImageData 对像,代表了画布区域的对象数据：
  - sx：将要被提取的图像数据矩形区域的左上角 x 坐标；
  - sy：将要被提取的图像数据矩形区域的左上角 y 坐标；
  - sw：将要被提取的图像数据矩形区域的宽度；
  - sh：将要被提取的图像数据矩形区域的高度；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              ctx.fillStyle = "rgba(241, 223, 12,1)";
              ctx.fillRect(0, 0, 100, 100);
  
  
              /*imageData
                  width:横向上像素点的个数
                  height:纵向上像素点的个数
                  data:数组：每一个像素点的rgba信息占 4 个长度
              */
              //100*100，10000个像素点
              var imageData = ctx.getImageData(0, 0, 100, 100);
              console.log(imageData);
  
              for (var i = 0; i < imageData.data.length; i++) {
                  // 改变每个像素的 透明度
                  imageData.data[4 * i + 3] = 100;
              }
              // 将处理过的 像素 对象 放回到 （0，0）
              ctx.putImageData(imageData, 0, 0)
          }
      }
  </script>
  ```
- 输出展示
  {% asset_img getImageData.jpg getImageData %}
## 创建一个 ImageData 对象
- ctx.createImageData(width, height)：默认创建出来的是透明的 rgba(0，0，0，0)；
  - width : ImageData 新对象的宽度；
  - height: ImageData 新对象的高度；
- 示例代码
  ```HTML
  <script type="text/javascript">
      window.onload = function () {
          var canvas = document.querySelector("#test");
          if (canvas.getContext) {
              var ctx = canvas.getContext("2d");
  
              /*imageData
                  width:横向上像素点的个数
                  height:纵向上像素点的个数
                  data:数组：每一个像素点的rgba信息占 4 个长度
              */
              //100*100，10000个像素点
              var imageData = ctx.createImageData(100, 100);
  
              for (var i = 0; i < imageData.data.length; i++) {
                  // 设置成黑色
                  imageData.data[4 * i + 3] = 255;
              }
              // 将处理过的 像素 对象 放回到 （100，100）
              ctx.putImageData(imageData, 100, 100)
          }
      }
  </script>
  ```
- 输出展示
  {% asset_img createImageData.jpg createImageData %}