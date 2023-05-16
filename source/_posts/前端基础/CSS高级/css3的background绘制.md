---
title: css3的background绘制
categories:
  - 前端基础
  - CSS高级
tags:
  - CSS高级
abbrlink: dbab1388
date: 2022-05-06 16:34:14
---
## background-size
1. 指定背景图片大小
2. 语法：`background-size: length | percentage | cover | contain`
    |值	|描述|
    |---|---|
	  |length	|设置背景图片高度和宽度：第一个值设置宽度，第二个值设置的高度，如果只给出一个值，第二个是设置为 auto(自动)；|
	  |percentage	|将计算相对于背景定位区域的百分比：第一个值设置宽度，第二个值设置的高度，如果只给出一个值，第二个是设置为 auto(自动)；|
	  |cover	|此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小；|
	  |contain	|此时会保持图像的纵横比并将图像缩放成将适合背景定位区域的最大大小；|
3. 示例代码
    ```HTML
    <style>
    .custom {
      display: flex;
    }
    .box {
      width          : 50px;
      height         : 50px;
      background     : #000 url(微信.png) no-repeat;
      margin-right   : 20px;
    }
    .custom-box1 {
        background-size: contain;
    }
    .custom-box2 {
        background-size: cover;
    }
    .custom-box3 {
        background-size: 40%;
    }
    .custom-box4 {
        background-size: 20px 20px;
    }
    /* 
      背景属性：宽度  高度  cover  contain  px %   
        background-size:
        cover：   宽高+ 高度同时等比例  会出现超出裁剪的情况
        contain:  宽高 或者 高度等比例  会出现留白的情况
    */
    </style>
    <div class="custom">
      <div class="box custom-box1"></div>
      <div class="box custom-box2"></div>
      <div class="box custom-box3"></div>
      <div class="box custom-box4"></div>
    </div>
    ```
4. 效果展示
    <style>
    .custom {
      display: flex;
    }
    .box {
      width          : 50px;
      height         : 50px;
      background     : #000 url(微信.png) no-repeat;
      margin-right   : 20px;
    }
    .custom-box1 {
        background-size: contain;
    }
    .custom-box2 {
        background-size: cover;
    }
    .custom-box3 {
        background-size: 40%;
    }
    .custom-box4 {
        background-size: 20px 20px;
    }
    /* 
      背景属性：宽度  高度  cover  contain  px %   
        background-size:
        cover：   宽高+ 高度同时等比例  会出现超出裁剪的情况
        contain:  宽高 或者 高度等比例  会出现留白的情况
    */
    </style>
    <div class="custom">
      <div class="box custom-box1"></div>
      <div class="box custom-box2"></div>
      <div class="box custom-box3"></div>
      <div class="box custom-box4"></div>
    </div>
## background-origin
1. 指定 background-position 属性应该是相对位置
2. 示例代码
    ```HTML
    <style>
      .origin-box {
        display: flex;
      }
      .common {
          width          : 200px;
          height         : 300px;
          border         : 20px dashed red;
          padding        : 30px;
          background     : url(./meimei.jpeg) no-repeat;
          background-size: cover;
          margin-right   : 20px
      }
      .b1 {
          /* 背景图像相对于边框盒来定位 */
          background-origin: border-box;
      }
      .b2 {
          /* 背景图像相对于内容框来定位 */
          background-origin: content-box;
      }
      .b3 {
          /* 背景图像相对于内边距框来定位 */
          background-origin: padding-box;
      }
    </style>
    <div class="origin-box">
      <div class="b1 common"></div>
      <div class="b2 common"></div>
      <div class="b3 common"></div>
    </div>
    ```
3. 效果展示
    <style>
      .origin-box {
        display: flex;
      }
      .common {
          width          : 200px;
          height         : 300px;
          border         : 20px dashed red;
          padding        : 30px;
          background     : url(./meimei.webp) no-repeat;
          background-size: cover;
          margin-right   : 20px
      }
      .b1 {
          /* 背景图像相对于边框盒来定位 */
          background-origin: border-box;
      }
      .b2 {
          /* 背景图像相对于内容框来定位 */
          background-origin: content-box;
      }
      .b3 {
          /* 背景图像相对于内边距框来定位 */
          background-origin: padding-box;
      }
    </style>
    <div class="origin-box">
      <div class="b1 common"></div>
      <div class="b2 common"></div>
      <div class="b3 common"></div>
    </div>
## background-clip
1. 设置元素的背景（背景图片或颜色）是否延伸到边框、内边距盒子、内容盒子下面
2. 示例代码
    ```HTML
    <style>
      .custom-clip{
          display: flex;
      }
      .clip-common {
          width: 150px;
          margin-right: 20px;
          border: 10px dashed red;
          padding: 10px;
          background: url(./meimei.webp) no-repeat;
          background-size: cover;
      }
      .clip-box1 {
          /* 背景绘制在边框方框内 */
          background-clip: border-box;
      }
      .clip-box2 {
          /* 背景绘制在内容方框内 */
          background-clip: content-box;
      }
      .clip-box3 {
          /* 背景绘制在衬距方框内 */
          background-clip: padding-box;
      }
      .clip-box4 {
          font-size              : 40px;
          font-weight            : bold;
          /* 裁剪 -  以文字进行裁剪  - 透出后面的背景   -   文字之外的背景 */
          -webkit-background-clip: text;
          background-clip        : text;
          color                  : transparent
      }
    </style>
    <div class="custom-clip">
      <div class="clip-box1 clip-common"></div>
      <div class="clip-box2 clip-common"></div>
      <div class="clip-box3 clip-common"></div>
      <div class="clip-box4 clip-common">hello world</div>
    </div>
    ```
3. 效果展示
    <style>
      .custom-clip{
          display: flex;
      }
      .clip-common {
          width: 150px;
          margin-right: 20px;
          border: 10px dashed red;
          padding: 10px;
          background: url(./meimei.webp) no-repeat;
          background-size: cover;
      }
      .clip-box1 {
          background-clip: border-box;
      }
      .clip-box2 {
          background-clip: content-box;
      }
      .clip-box3 {
          background-clip: padding-box;
      }
      .clip-box4 {
          font-size              : 40px;
          font-weight            : bold;
          -webkit-background-clip: text;
          background-clip        : text;
          color                  : transparent
      }
    </style>
    <div class="custom-clip">
      <div class="clip-box1 clip-common"></div>
      <div class="clip-box2 clip-common"></div>
      <div class="clip-box3 clip-common"></div>
      <div class="clip-box4 clip-common">hello world</div>
    </div>

## Filter：滤镜
1. 示例代码
    ```HTML
    <style>
      .filter-box {
          display : flex;
          width: 100%;
          flex-wrap: wrap;
      }
      .filter-box img {
          width: 130px !important;
      }
      .blur {
          /* 高斯模糊 */
          -webkit-filter: blur(4px);
          filter        : blur(4px);
      }
      .brightness {
          -webkit-filter: brightness(0.30);
          filter        : brightness(0.30);
      }
      .contrast {
          -webkit-filter: contrast(180%);
          filter        : contrast(180%);
      }
      .grayscale {
          -webkit-filter: grayscale(100%);
          filter        : grayscale(100%);
      }
      .huerotate {
          -webkit-filter: hue-rotate(180deg);
          filter        : hue-rotate(180deg);
      }
      .invert {
          -webkit-filter: invert(100%);
          filter        : invert(100%);
      }
      .opacity {
          /* 透明度 */
          -webkit-filter: opacity(50%);
          filter        : opacity(50%);
      }
      .saturate {
          -webkit-filter: saturate(7);
          filter        : saturate(7);
      }
      .sepia {
          -webkit-filter: sepia(100%);
          filter        : sepia(100%);
      }
      .shadow {
          /* 阴影  */
          -webkit-filter: drop-shadow(8px 8px 10px green);
          filter        : drop-shadow(8px 8px 10px green);
      }
    </style>
	  <div class="filter-box">
      <div class="blur"><img src="./meimei.webp" alt=""></div>
      <div class="brightness"><img src="./meimei.webp" alt=""></div>
      <div class="contrast"><img src="./meimei.webp" alt=""></div>
      <div class="grayscale"><img src="./meimei.webp" alt=""></div>
      <div class="huerotate"><img src="./meimei.webp" alt=""></div>
      <div class="invert"><img src="./meimei.webp" alt=""></div>
      <div class="opacity"><img src="./meimei.webp" alt=""></div>
      <div class="saturate"><img src="./meimei.webp" alt=""></div>
      <div class="sepia"><img src="./meimei.webp" alt=""></div>
      <div class="shadow"><img src="./meimei.webp" alt=""></div>
	  </div>
    ```
2. 效果展示
    <style>
      .filter-box {
          display : flex;
          width: 100%;
          flex-wrap: wrap;
      }
      .filter-box img {
          width: 130px !important;
      }
      .blur {
          /* 高斯模糊 */
          -webkit-filter: blur(4px);
          filter        : blur(4px);
      }
      .brightness {
          -webkit-filter: brightness(0.30);
          filter        : brightness(0.30);
      }
      .contrast {
          -webkit-filter: contrast(180%);
          filter        : contrast(180%);
      }
      .grayscale {
          -webkit-filter: grayscale(100%);
          filter        : grayscale(100%);
      }
      .huerotate {
          -webkit-filter: hue-rotate(180deg);
          filter        : hue-rotate(180deg);
      }
      .invert {
          -webkit-filter: invert(100%);
          filter        : invert(100%);
      }
      .opacity {
          /* 透明度 */
          -webkit-filter: opacity(50%);
          filter        : opacity(50%);
      }
      .saturate {
          -webkit-filter: saturate(7);
          filter        : saturate(7);
      }
      .sepia {
          -webkit-filter: sepia(100%);
          filter        : sepia(100%);
      }
      .shadow {
          /* 阴影  */
          -webkit-filter: drop-shadow(8px 8px 10px green);
          filter        : drop-shadow(8px 8px 10px green);
      }
    </style>
	  <div class="filter-box">
      <div class="blur"><img src="./meimei.webp" alt=""></div>
      <div class="brightness"><img src="./meimei.webp" alt=""></div>
      <div class="contrast"><img src="./meimei.webp" alt=""></div>
      <div class="grayscale"><img src="./meimei.webp" alt=""></div>
      <div class="huerotate"><img src="./meimei.webp" alt=""></div>
      <div class="invert"><img src="./meimei.webp" alt=""></div>
      <div class="opacity"><img src="./meimei.webp" alt=""></div>
      <div class="saturate"><img src="./meimei.webp" alt=""></div>
      <div class="sepia"><img src="./meimei.webp" alt=""></div>
      <div class="shadow"><img src="./meimei.webp" alt=""></div>
	  </div>

## clip-path
1. 使用裁剪方式创建元素的可显示区域，区域内的部分显示，区域外的隐藏
2. 示例代码
    ```HTML
    	<style>
        .clip-box {
            display: flex;
        }
        .clip-box div{
            margin-right: 20px;
        }
        /* 圆形circle（半径 at 圆心坐标） */
        .circle {
            width            : 100px;
            height           : 100px;
            background       : #0cc;
            clip-path        : circle(50% at 50% 50%);
            -webkit-clip-path: circle(50% at 50% 50%);
                
        }
        /* 椭圆形ellipse（长、短轴半径 at 圆心坐标） */
        .ellipse {
            width            : 100px;
            height           : 100px;
            background       : #aaa;
            clip-path        : ellipse(25% 50% at 50% 50%);
            -webkit-clip-path: ellipse(25% 50% at 50% 50%);
        }
        /* 内置矩形inset (上右下左的边距 round 上右下左圆角) */
        .inset {
            width            : 100px;
            height           : 100px;
            background       : #99f;
            clip-path        : inset(10px 20px 30px 10px round 20px 5px 50px 0);
            -webkit-clip-path: inset(10px 20px 30px 10px round 20px 5px 50px 0);
        }
        /* 正三角形 */
        .triangle {
            width            : 100px;
            height           : 87px;
            background       : #c00;
            clip-path        : polygon(0% 100%, 50% 0%, 100% 100%);
            -webkit-clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
        }
        /* 正方形 */
        .square {
            width            : 100px;
            height           : 100px;
            background       : #069;
            clip-path        : polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
            -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
        }
    </style>
    <div class="clip-box">
      <div class="circle"></div>
      <div class="ellipse"></div>
      <div class="inset"></div>
      <div class="triangle"></div>
      <div class="square"></div>
    </div>
    ```
3. 效果展示
    <style>
      .clip-box {
          display: flex;
      }
      .clip-box div{
          margin-right: 20px;
      }
      /* 圆形circle（半径 at 圆心坐标） */
      .circle {
          width            : 100px;
          height           : 100px;
          background       : #0cc;
          clip-path        : circle(50% at 50% 50%);
          -webkit-clip-path: circle(50% at 50% 50%);
              
      }
      /* 椭圆形ellipse（长、短轴半径 at 圆心坐标） */
      .ellipse {
          width            : 100px;
          height           : 100px;
          background       : #aaa;
          clip-path        : ellipse(25% 50% at 50% 50%);
          -webkit-clip-path: ellipse(25% 50% at 50% 50%);
      }
      /* 内置矩形inset (上右下左的边距 round 上右下左圆角) */
      .inset {
          width            : 100px;
          height           : 100px;
          background       : #99f;
          clip-path        : inset(10px 20px 30px 10px round 20px 5px 50px 0);
          -webkit-clip-path: inset(10px 20px 30px 10px round 20px 5px 50px 0);
      }
      /* 正三角形 */
      .triangle {
          width            : 100px;
          height           : 87px;
          background       : #c00;
          clip-path        : polygon(0% 100%, 50% 0%, 100% 100%);
          -webkit-clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
      }
      /* 正方形 */
      .square {
          width            : 100px;
          height           : 100px;
          background       : #069;
          clip-path        : polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
          -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
      }
    </style>
    <div class="clip-box">
      <div class="circle"></div>
      <div class="ellipse"></div>
      <div class="inset"></div>
      <div class="triangle"></div>
      <div class="square"></div>
    </div>
