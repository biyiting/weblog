---
title: svg 绘制图形
categories:
  - 高阶技术专题
  - 前端数据可视化专题
tags:
  - 数据可视化
abbrlink: 9eb472f3
date: 2022-03-16 10:25:40
---
## 示例代码
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>svg绘制图形</title>
</head>
<body>
  <svg width="1000" height="600">
    <!-- 01 绘制矩形 -->
    <rect x="40" y="40" width="200" height="100" style="fill:orangered; stroke: pink; stroke-width: 4"></rect>

    <!-- 02 绘制圆角矩形 -->
    <rect x="40" y="200" width="200" height="100" rx="20" ry="20" style="fill:orangered; stroke: pink; stroke-width: 4">
    </rect>

    <!-- 03 绘制圆形 -->
    <circle cx="400" cy="100" r="50" style="fill: darkblue"></circle>

    <!-- 04 椭圆 -->
    <ellipse cx="400" cy="250" rx="80" ry="40" style="fill: seagreen"></ellipse>

    <!-- 05 绘制线条 -->
    <line x1="100" y1="340" x2="400" y2="400" style="stroke:#333; stroke-width: 4"></line>

    <!-- 06 绘制多边形 -->
    <polygon points="500, 0, 700, 10, 600, 50" style="fill: lightblue; stroke-width: 2; stroke: red"
      transform="translate(100, 100)"></polygon>

    <!-- 07 绘制文字 -->
    <text x="600" y="250" style="fill: orange; font-size: 40" textLength="200">你好</text>
  </svg>
</body>
</html>
```

## 效果展示
<img src="效果展示.jpg" width="600px" height="auto" class="lazy-load" title="效果展示"/>