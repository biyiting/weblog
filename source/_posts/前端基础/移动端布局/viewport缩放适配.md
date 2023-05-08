---
title: viewport缩放适配
categories:
  - 前端基础
  - 移动端布局
tags:
  - 移动端布局
date: 2021-08-27 16:27:10
---

## 屏幕的尺寸(设备独立像素)：window.screen.width

## 浏览器窗口尺寸(CSS 像素): 
- window.innerWidth 、window.innerHeight 不包括滚动条的宽度高度；
- 精确计量用 document.documentElement.clientWidth 和 document.documentElement.clientHeight；

## viewport（视口）
1. 移动前端中常说的 viewport（视口）就是浏览器显示页面内容的屏幕区域；
    - width: 控制 viewport 的大小，可以指定的一个值（如 600），或者特殊的值（如 device-width 为 设备的宽度）；
    - height: 和 width 相对应，指定高度；
    - initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例；
    - maximum-scale：允许用户缩放到的最大比例；
    - minimum-scale：允许用户缩放到的最小比例；
    - user-scalable：用户是否可以手动缩放；
2. 示例代码
    ```HTML
    <meta id="viewport" name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"> 
    ```
3. <mark>注意: 只要涉及到手机端的适配，必须要加上视口的这段代码</mark>