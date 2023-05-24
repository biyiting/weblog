---
title: css 隔离方案
categories:
  - 高阶技术专题
  - 微前端解决方案
tags:
  - 微前端
abbrlink: ff91bf40
date: 2022-04-16 11:12:58
---


## 子应用之间样式隔离：
> Dynamic Stylesheet 动态样式表，当应用切换时移除老应用样式，添加新应用样式；
	
## 主应用和子应用之间的样式隔离：
1. BEM(Block Element Modifier) 约定项目前缀；
2. CSS-Modules 打包时生成不冲突的选择器名；
3. Shadow DOM 真正意义上的隔离；
4. css-in-js；
	
## Shadow DOM
1. 图解
    <img src="图解.jpg" width="600px" height="auto" class="lazy-load" title="图解"/>
2. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            p {
                color: green;
            }
        </style>
    </head>
    <body>
        <p>hello world</p>
        <div id="shadow"></div>
        <script>
            // open：可以使用 document.querySelector('#shadow').shadowRoot 获取根节点
            // closed：document.querySelector('#shadow').shadowRoot 为 null
            let shadowDom = shadow.attachShadow({ mode: 'open' });
            // 外面的样式并不能影响 Shadow DOM 内的样式
            let pElement = document.createElement('p');
            pElement.innerHTML = 'hello world';
    
            let styleElement = document.createElement('style');
            styleElement.textContent = `p{color:red}`;
    
            shadowDom.appendChild(pElement);
            shadowDom.appendChild(styleElement)
        </script>
    </body>
    </html>
    ```
3. 效果展示
    <img src="效果展示.jpg" width="600px" height="auto" class="lazy-load" title="效果展示"/>