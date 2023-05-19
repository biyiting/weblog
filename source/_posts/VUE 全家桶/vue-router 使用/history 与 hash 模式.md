---
title: history 与 hash 模式
categories:
  - VUE 全家桶
  - vue-router 使用
tags:
  - vue-router
abbrlink: 5c0ac6f0
date: 2022-10-02 20:11:22
---

## history 与 hash 路由的区别
1. hash：前端路由，无刷新, hash 虽然出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面；
2. history：正常情况下不会向后端发起请求, history 利用了 html5 history api 中新增的 pushState() 和 replaceState() 方法，浏览器刷新时会向后端发起请求，需要后端配合返回 index.html（IE10 及以上支持）；

## vue-router 提供两种模式的原因
1. vue 是渐进式前端开发框架，为了实现 SPA(单页面应用) ，需要引入前端路由系统（vue-router），前端路由的核心是：改变视图的同时不会向后端发出请求，为了达到这一目的，浏览器提供了 hash 和 history 两种模式；
2. 这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能；
3. 因此可以说，hash 模式和 history 模式都属于浏览器自身的属性，vue-router 只是利用了这两个特性（通过调用浏览器提供的接口）来实现路由；

## 实现的原理
1. hash 模式的原理是 onhashchange 事件，可以在 window 对象上监听这个事件，改变 # 后面的代码片段；
    ```JS
    window.location.hash = 'qq' // 设置 url 的 hash，会在当前 url 后加上 '#qq'
    
    console.log(window.location.hash) // '#qq'  
    
    window.addEventListener('hashchange', function () {
      // 监听浏览器路径后的 hash 变化
    })
    ```
2. history ：history api （pushState、replaceState、go、back、forward） 则给了前端完全的自由，通过在window 对象上监听 popState() 事件；
    ```JS
    // state：需要保存的数据，这个数据在触发 popstate 事件时，可以在 event.state 里获取
    // title：标题，基本没用，一般传 null
    // url：设定新的 url，新的与当前 url 的 origin 必须是一样的，否则会抛出错误，url 可以是绝对路径，也可以是相对路径
    window.history.pushState({}, null, url) // 创建新的历史记录
    window.history.replaceState({}, null, url) // 修改当前历史记录
    
    window.addEventListener("popstate", function () {
      // 监听浏览器路径变化，pushState 与 replaceState 方法不会触发              
    });
    
    window.history.back() // 后退
    window.history.forward() // 前进
    window.history.go(1) // 前进一步，-2为后退两步，window.history.length 可查看历史堆栈中页面的数量
    ```

## history 案例
>需要后端支持，刷新的时候需要后端返回 index.html，否则会 404，以 node 为例
1. 服务端代码
    ```JS
    const path = require('path')
    // 导入处理 history 模式的模块
    const history = require('connect-history-api-fallback')
    // 导入 express
    const express = require('express')
    const app = express()
    
    // 注册处理 history 模式的中间件（后端支持，不使用前端刷新浏览器会显示 404）
    app.use(history())
    // 处理静态资源的中间件（静态资源服务器），网站根目录 ../web（前端打包后的代码放在此处）
    app.use(express.static(path.join(__dirname, '../web')))
    
    // 开启服务器，端口是 3000
    app.listen(3000, () => { console.log('服务器开启，端口：3000') })
    ```
2. <a class="attachment" name="history-demo.zip">代码附件下载</a>