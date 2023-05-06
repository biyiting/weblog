---
title: canvas基本用法
categories:
  - A.前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 13:33:24
---

## 什么是 canvas ？

- `<canvas>` 是 HTML5 新增的元素，可通过使用 JavaScript 中的脚本来绘制图形；
- 可以使用 `<canvas>` 标签来定义一个 canvas 元素；
  1. 使用 `<canvas>` 标签时，建议要成对出现，不要使用闭合的形式；
  2. `<canvas>` 元素默认具有高宽，width：300px，height：150px；

## 替换内容

- 某些较老的浏览器（尤其是 IE9 之前的 IE 浏览器）不支持 HTML 元素"canvas"，要给用户展示些替代内容，这非常简单：只需要在 `<canvas>` 标签中提供替换内容就可以；
- 支持 `<canvas>` 的浏览器将会忽略在容器中包含的内容，并且只是正常渲染 canvas；
- 不支持 `<canvas>` 的浏览器会显示代替内容；

## canvas 标签的两个属性

- `<canvas>` 标签只有两个属性 width 和 height，当没有设置宽度和高度的时候，canvas 会初始化宽度为 300 像素、高度为 150 像素；
- 注意：
  - html 属性：设置 width、height 时只影响画布本身不影响画布内容;
  - css 属性：设置 width、height 时不但会影响画布本身的高宽，还会使画布中的内容等比例缩放（缩放参照于画布默认的尺寸）；

## 渲染上下文

- `<canvas>` 元素只是创造了一个固定大小的画布，要想在它上面去绘制内容，我们需要找到它的渲染上下文；
- `<canvas>` 元素有一个叫做 getContext() 的方法，是用来获得渲染上下文和它的绘画功能，getContext() 只有一个参数，上下文的格式；

## 示例代码
  ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
            }
            html,
            body {
                height: 100%;
                overflow: hidden;
            }
            #test {
                background: gray;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
        </style>
    </head>
    <body>
        <canvas id="test" width="300" height="300">
            <span>您的浏览器不支持画布元素 请您换成谷歌</span>
        </canvas>
    </body>
    <script type="text/javascript">
        window.onload = function () {
            //拿到画布
            var canvas = document.querySelector("#test");

            // 判断兼容
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
            }
        }
    </script>
    </html>
  ```

---
