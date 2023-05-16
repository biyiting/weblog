---
title: sass代码实践
categories:
  - 前端基础
  - CSS预处理器
tags:
  - css
  - sass
abbrlink: bcb20d3e
date: 2021-09-03 15:30:50
---

## sass 简介

- Sass 是一门高于 CSS 的元语言，它能用来清晰地、结构化地描述文件样式，有着比普通 CSS 更加强大的功能；
- Sass 能够提供更简洁、更优雅的语法，同时提供多种功能来创建可维护和管理的样式表；
- Sass 是采用 Ruby 语言编写的⼀款 CSS 预处理语言，它诞生于 2007 年，是最大的成熟的 CSS 预处理语言。最初它是为了配合 HAML（⼀种缩进式 HTML 预编译器）而设计的，因此有着和 HTML 一样的缩进式风格；

## sass 编译
- 编译方法一: 命令编译
  - 单文件编译: sass styles.scss styles.css 
  - 实时监视 scss文件: sass --watch styles.scss:styles.css 
- 编译方法二: GUI界面工具编译 
  - [Koala](http://koala-app.com/) - 推荐 
  - [Compass.app](http://compass.kkbox.com/)
  - [Scout](http://mhs.github.io/scout-app/)
  - [CodeKit](https://incident57.com/codekit/index.html) - 推荐 
  - [Prepros](https://prepros.io/)
- 编译方法三: 自动化编译(利用 Grunt 和 Gulp)

## sass 功能
### sass 变量: 符号$
- sass
  ```css
  $nav-color: #F90;
  nav {
    $width: 100px;
    width: $width;
    color: $nav-color;
  }

  /* 将局部变量转换为全局变量可以添加 !global 声明 */ 
  #main {
    $width: 5em !global;
    width: $width;
  }
  #sidebar {
    width: $width;
  }
  ```
- css
  ```css
  nav {
    width: 100px;
    color: #F90;
  }

  #main {
    width: 5em;
  }
  #sidebar {
    width: 5em;
  }
  ```
### sass 嵌套
- sass
  ```css
  #content {
    article {
      h1 {
        color: #333
      }
      p {
        margin-bottom: 1.4em
      }
    }
    aside {
      background-color: #EEE
    }
  }
  ```
- css
  ```css
  #content article h1 {
    color: #333;
  }

  #content article p {
    margin-bottom: 1.4em;
  }

  #content aside {
    background-color: #EEE;
  }
  ```
### sass 混入: @mixin声明/@include调用
- sass
  ```css
  /* 公用代码 */ 
  @mixin rounded-corners {
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      border-radius: 5px;
  }
  .notice {
      background-color: green;
      border: 2px solid #00aa00;
      @include rounded-corners;
  }

  /* 给混合器传参 */
  @mixin link-colors($normal, $hover, $visited) {
      color: $normal;
      &:hover { color: $hover; }
      &:visited { color: $visited; }
  }
  a {
      @include link-colors(blue, red, green);
  }
  ```
- css
  ```css
  /* 公用代码 */
  .notice {
    background-color: green;
    border: 2px solid #00aa00;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  
  /* 给混合器传参 */
  a {color: blue;}
  a:hover {color: red;}
  a:visited {color: green;}
  ```
### sass 扩展: @extend
- sass
  ```css
  .error {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    @extend .error;
    border-width: 3px;
  }
  ```
- css
  ```css
  .error, .seriousError {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    border-width: 3px;
  }
  ```
### sass 循环
- `@for $i from <start> through/to <end>`
  - $i 表示变量
  - start 表示起始值
  - end 表示结束值
  - through 表示包括 end 这个数
  - to 则不包括 end 这个数
- sass
  ```css
  @for $i from 1 through 2 {    
    .col-#{$i} {
        width: 1000px/12*$i;
    }
  }
  ```
- css
  ```css
  .col-1 {
    width: 83.33333px;
  }
  .col-2 {
    width: 166.66667px;
  }
  ```
### sass 导入
- sass
  ```css
  /* importing-variable.scss */
  $themeColor: blue;
  $fontSize: 14px;

  /* importing-module1.scss */
  .module1 {
      .box {
          font-size: $fontSize + 2px;
          color: $themeColor;
      }
      .tips {
          font-size: $fontSize;
          color: lighten($themeColor, 40%);
      }
  }

  /* importing-module2.scss */
  .module2 {
      .box {
          font-size: $fontSize + 4px;
          color: $themeColor;
      }
      .tips {
          font-size: $fontSize + 2px;
          color: lighten($themeColor, 20%);
      }
  }

  /* importing.less */
  @import "./importing-variable.scss";
  @import "./importing-module1.scss";
  @import "./importing-module2.scss";
  ```
- css
  ```css
  .module1 .box {
    font-size: 16px;
    color: blue;
  }

  .module1 .tips {
    font-size: 14px;
    color: #ccccff;
  }

  .module2 .box {
    font-size: 18px;
    color: blue;
  }

  .module2 .tips {
    font-size: 16px;
    color: #6666ff;
  }
  ```
