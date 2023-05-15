---
title: outline属性的妙用技巧
categories:
  - 前端基础
  - CSS实战技巧
tags:
  - css
  - CSS实战技巧
abbrlink: b3e6ddce
date: 2023-03-29 16:03:26
---
## 示例代码
```HTML
<style>
  * {
    padding: 0;
    margin: 0;
  }
  ul {
    list-style: none;
    width: 600px;
    margin: auto;
  }
  li {
    padding: 10px;
    border: 10px solid pink;
    outline-offset: -10px;
  }
  li+li {
    margin-top: -10px;
  }
  li:hover {
    /* border:10px solid gold; */
    outline: 10px solid gold;
  }
</style>
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
  </ul>
</body>
```
## 效果展示
1. hover 设置 border
    {% asset_img border.jpg border %}
2. hover 设置 outline
    <style>
      #custom-ul1 {
        list-style: none;
        width: 600px;
        margin: auto;
        padding: 0 !important;
      }
      #custom-ul1 li {
        padding: 10px;
        border: 10px solid pink;
        outline-offset: -10px;
      }
      #custom-ul1 li+li {
        margin-top: -10px;
      }
      #custom-ul1 li:hover {
        outline: 10px solid gold;
      }
      #custom-ul1>li::before{
        display: none !important;
      }
    </style>
    <ul id="custom-ul1">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>