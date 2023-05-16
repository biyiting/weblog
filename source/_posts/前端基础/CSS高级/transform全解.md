---
title: transform全解
categories:
  - 前端基础
  - CSS高级
tags:
  - CSS高级
  - transform
abbrlink: c03b1f28
date: 2021-08-25 11:28:36
---

## transform `transform: none|transform-functions`
## transform-origin 元素变换基点属性值
1. transform-origin 属性表示在对元素进行变换的时候，设置围绕哪个点进行变化的，默认情况，变换的原点在元素的中心点；
2. 语法：`transform-origin: x-axis y-axis z-axis`
    | 值   | 描述   | 
    | ------ | ------ | 
    | x-axis | 定义视图被置于 X 轴的何处，可能的值 <br/> 1. left<br/>2. center<br/>3. right<br/>4. length<br/>5. % | 
    | y-axis | 定义视图被置于 Y 轴的何处，可能的值 <br/> 1. top<br/>2. center<br/>3. bottom<br/>4. length<br/>5. %| 
    | z-axis | 定义视图被置于 Z 轴的何处，可能的值 <br/> 1. length | 

## translate 位移属性值
1. translate()：指定对象的 2D translation（2D平移），第一个参数对应 X 轴，第二个参数对应 Y 轴，如果第二个参数未提供，则默认值为 0；
2. translateX()：定对象X轴（水平方向）的平移；
3. translateY()：指定对象Y轴（垂直方向）的平移；
4. 示例代码
    ```HTML
    <style>
      .item1 {
        width           : 314px;
        height          : 300px;
        background-color: #333;
        /* transition-property:all;
        transition-duration: 1s;
        transition-timing-function:ease;
        transition-delay:.2s; */
        /* 小技巧: 鼠标移入移出同时都有动画  transition 加在元素本身身上 */
        transition: all 1s ease-in-out .2s;
      }
      .item1:hover {
        width           : 500px;
        background-color: red;
        /* transform    : translateY(-20px); */
        transform       : translate(0, -20px);
      }
    </style>
    <!-- transform 位移 translate-->
    <div class="item1"></div>
    ```
5. 效果展示
    <style>
      .item1 {
        width           : 314px;
        height          : 300px;
        background-color: #333;
        /* transition-property:all;
        transition-duration: 1s;
        transition-timing-function:ease;
        transition-delay:.2s; */
        /* 小技巧: 鼠标移入移出同时都有动画  transition 加在元素本身身上 */
        transition: all 1s ease-in-out .2s;
      }
      .item1:hover {
        width           : 500px;
        background-color: red;
        /* transform    : translateY(-20px); */
        transform       : translate(0, -20px);
      }
    </style>
    <!-- transform 位移 translate-->
    <div class="item1"></div>

## rotate 旋转属性值
1. rotate(angle)：定义 2D 旋转，在参数中规定角度；
2. 示例代码
    ```HTML
    <style>
      .item3 {
          position: relative;
          overflow: hidden;
      }
      .icon {
          width     : 50px;
          height    : 50px;
          background: pink;
      }
      .layer {
          width           : 50px;
          height          : 50px;
          background      : rgba(0, 0, 0, .5);
          position        : absolute;
          top             : 0;
          left            : 0;
          /* display      :none 隐藏  => rotate(90deg) */
          transform       : rotate(90deg);
          transform-origin: left bottom;
          transition      : all .3s ease-out;
      }
      .item3:hover .layer {
          /* top:0; display:block  显示*/
          transform: rotate(0deg);
      }
    </style>
    <div class="item3">
      <div class="icon"></div>
      <div class="layer"></div>
    </div>
    ```
3. 效果展示
    <style>
      .item3 {
          position: relative;
          overflow: hidden;
      }
      .icon {
          width     : 100px;
          height    : 100px;
          background: pink;
      }
      .layer {
          width           : 100px;
          height          : 100px;
          background      : rgba(0, 0, 0, .5);
          position        : absolute;
          top             : 0;
          left            : 0;
          /* display      :none 隐藏  => rotate(90deg) */
          transform       : rotate(90deg);
          transform-origin: left bottom;
          transition      : all .3s ease-out;
      }
      .item3:hover .layer {
          /* top:0; display:block  显示*/
          transform: rotate(0deg);
      }
    </style>
    <div class="item3">
      <div class="icon"></div>
      <div class="layer"></div>
    </div>
## scale 缩放属性值
1. scale()：第一个参数对应 X 轴，第二个参数对应 Y 轴,如果第二个参数未提供，则默认取第一个参数的值； 
2. scaleX()：指定对象X轴的（水平方向）缩放； 
3. scaleY()：指定对象Y轴的（垂直方向）缩放；
4. 示例代码
    ```HTML
    <style>
    .item4 {
        width   : 400px;
        height  : 200px;
        overflow: hidden;
    }
    .item4 img {
        width     : 400px;
        height    : 200px;
        transition: all 1s linear;
    }
    .item4:hover img {
        transform: scale(1.5);
    }
    </style>
    <div class="item4">
      <img src="./meimei.png" alt="">
    </div>
    ```
5. 效果展示
    <style>
    .item4 {
        width   : 400px;
        height  : 200px;
        overflow: hidden;
    }
    .item4 img {
        width     : 400px;
        height    : 200px;
        transition: all 1s linear;
    }
    .item4:hover img {
        transform: scale(1.5);
    }
    </style>
    <div class="item4">
      <img src="./meimei.png" alt="">
    </div>
## 让元素隐藏的方式有多少方法
1. display: none - display: block
2. opactiy: 0 - opactiy: 1
3. transform: scale(0) - transform: scale(1)
4. transform: rotate(90deg) - transform: rotate(0deg)
5. transform: translate(-9999px)
6. position + left: -9999px
