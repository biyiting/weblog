---
title: less代码实践
categories:
  - A.前端基础
  - CSS预处理器
tags:
  - css
  - less
date: 2021-09-03 14:30:50
---

## less 简介

- Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。
- Less 可以运行在 Node 或浏览器端;

## less 安装

`npm install -g less`

## less 编译

- 编译方法一: 在 nodejs 环境中使用 less
  - 在命令行中运行 less: lessc styles.less styles.css
  - 编译成生成环境下的 css 文件： lessc -x styles.less styles.css
- 编译方法二: 在浏览器环境中使用 less
  ```HTML
  <link rel="stylesheet/less" type="text/css" href="styles.less" />
  <script src="http://cdnjs.cloudflare.com/ajax/libs/less.js/2.5.3/less.min.js"></script>
  ```
- 编译方法三: 工具编译, [考拉](http://koala-app.com/index-zh.html)
- 编译方法四：vscode 插件 easy less

## less 常用功能

### 变量: 符号@
- less
  ```css
  @selector: #header; /* 选择器 作为变量 */
  @m: margin;         /* 样式名 作为变量 */ 
  @width: 10px;       /* 样式值 作为变量 */ 

  @{selector} {
      @{m}: 20px;
      width: @width;
      background-color: red;
  }
  ```
- css
  ```css
  #header {
    margin: 20px;
    width: 10px;
    background-color: red;
  }
  ```
### 嵌套
- less
  ```css
  #header {
    color: black;

    /* 父子关系 */
    .logo {
        width: 300px;
    }
  }
  
  .clearfix {
    display: block;
    zoom: 1;

    /* & 同级 */
    &:after {
        content: " ";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }
  }

  .component {
    width: 300px;

    @media (min-width: 768px) {
        width: 600px;

        @media (min-resolution: 192dpi) {
            background-image: url(/img/retina2x.png);
        }
    }

    @media (min-width: 1280px) {
        width: 800px;
    }
  }
  ```
- css
  ```css
  #header {
    color: black;
  }
  /* 父子关系 */
  #header .logo {
    width: 300px;
  }

  .clearfix {
    display: block;
    zoom: 1;
  }
  /* & 同级 */
  .clearfix:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .component {
    width: 300px;
  }
  @media (min-width: 768px) {
    .component {
      width: 600px;
    }
  }
  @media (min-width: 768px) and (min-resolution: 192dpi) {
    .component {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    .component {
      width: 800px;
    }
  }
  ```
### 混合
- less
  ```css
  .bordered {
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
  }
  #menu {
    color: antiquewhite;
    .bordered();
  }
  .post  {
    color: red;
    .bordered();
  }
  ```
- css
  ```css
  .bordered {
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
  }
  #menu {
    color: antiquewhite;
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
  }
  .post {
    color: red;
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
  }
  ```

### 扩展：会把重复的代码抽离出去
- less
  ```css
  @w: 200px;
  @h: 200px;

  .block {
      width: @w;
      height: @h;
      border: 10px solid #ccc;
  }

  .box1:extend(.block) {
      background: red;
  }

  .box2:extend(.block) {
      background: green;
  }
  ```
- css
  ```css
  .block,
  .box1,
  .box2 {
    width: 200px;
    height: 200px;
    border: 10px solid #ccc;
  }

  .box1 {
    background: red;
  }

  .box2 {
    background: green;
  }
  ```

### 命名空间：类似 js 对象.方法
- less
  ```css
  #bundle() {
    .button {
        display: block;
        border: 1px solid black;
        background-color: grey;
        &:hover {
            background-color: white;
        }
    }
    .tab {
        color: red;
    }
    .citation {
        color: green;
    }
  }

  #header a {
      color: orange;
      /* 还可以书写为 #bundle > .button 形式 */
      #bundle.button(); 
  }
  ```
- css
  ```css
  #header a {
    color: orange;
    display: block;
    border: 1px solid black;
    background-color: grey;
  }
  #header a:hover {
    background-color: white;
  }
  ```

### 映射
- less
  ```css
  #colors() {
    primary: blue;
    secondary: green;
  }
  .button {
    color: #colors[primary];
    border: 1px solid #colors[secondary];
  }
  ```
- css
  ```css
  .button {
    color: blue;
    border: 1px solid green;
  }
  ```

### 作用域，先在本级作用域查找，找不到向上查找
- less
  ```css
  @var: red;

  #page {
    #header {
      color: @var;
    }
    @var: white;
  }
  ```
- css
  ```css
  #page #header {
    color: white;
  }
  ```

### 循环
- less
  ```css
  .gen-col(@n) when (@n > 0) {
    /* 递归调用自身 */
    .gen-col(@n - 1);
    .col-@{n} {
        width: 1000px/12*@n;
    }
  }

  .gen-col(3);
  ```
- css
  ```css
  .col-1 {
    width: 1000px/12*1;
  }
  .col-2 {
    width: 1000px/12*2;
  }
  .col-3 {
    width: 1000px/12*3;
  }
  ```

### 导入 import
- less
  ```css
  /* importing-variable.less */
  @themeColor: blue;
  @fontSize: 14px;

  /* importing-module1.less */
  .module1 {
      .box {
          font-size: @fontSize + 2px;
          color: @themeColor;
      }
  }

  /* importing-module2.less */
  .module2 {
      .box {
          font-size: @fontSize + 4px;
          color: @themeColor;
      }
  }

  /* importing.less */
  @import "./importing-variable.less";
  @import "./importing-module1.less";
  @import "./importing-module2.less";
  ```
- css
  ```css
  .module1 .box {
    font-size: 16px;
    color: blue;
  }

  .module2 .box {
    font-size: 18px;
    color: blue;
  }
  ```