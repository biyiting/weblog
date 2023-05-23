---
title: Koa 介绍
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: 3df95c8d
date: 2022-02-18 11:31:27
---

## Koa 介绍
1. Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造，致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石：
    - [官网](https://koajs.com/)
    - [GitHub 仓库](https://github.com/koajs/koa)
    - [一个翻译的中文网](https://koa.bootcss.com/)
2. Koa 的原理和内部结构很像 Express，但是语法和内部结构进行了升级：
    - Koa 内部使用 ES6 编写，号称是下一代 Node.js Web 框架；
    - 它的主要特点是通过利用 async 函数，丢弃回调函数；
      - Koa 1 是基于 ES2015 中的 Generator 生成器函数结合 CO 模块；
      - Koa 2 完全抛弃了 Generator 和 CO，升级为了 ES2017 中的 async/await 函数；
    - 正是 Koa 内部基于最新的异步处理方式，所以使用 Koa 处理异常更加简单；
    - Koa 中提供了 CTX 上下文对象；Express 是扩展了 req 和 res；
    - Koa 并没有捆绑任何中间件，而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序；
3. 特点：
    - koa 中间件实现使用了洋葱模型；
    - koa 每次请求都会创建一个新的请求上下文，保证了 context 的请求隔离和应用隔离；
    - koa 将 context 上的属性代理给 response.js 和 request.js 处理，扩展了 context 功能；


## Koa 基本用法
1. Koa 依赖 node v7.6.0 或 ES2015 及更高版本和 async 方法支持；
    - Koa 应用程序是一个包含一组中间件函数的对象；
    - 它是按照类似堆栈的方式组织和执行的；
    - Koa 内部没有捆绑任何中间件，甚至是路由功能；
2. Koa 的执行流程：
    <img src="执行流程.jpg" width="600px" height="auto" class="lazy-load" title="执行流程"/>
3. 示例代码
    ```JS
    const Koa = require('koa')
    const app = new Koa()
    
    // Koa 没有路由系统，只有中间件功能，ctx: context 上下文对象
    // 通过 ctx.request.path 可以获取用户请求的路径，由此实现简单的路由
    app.use(ctx => {
      const path = ctx.path
    
      if (path === '/') {
        ctx.body = 'home page'
      } else if (path === '/foo') {
        ctx.body = 'foo page'
      } else {
        ctx.body = '404 Not Found.'
      }
    })
    
    // 错误处理
    app.on('error', (err) => { console.log(err) });
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```