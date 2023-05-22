---
title: Koa 中的错误处理
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: befa28f6
date: 2022-02-21 13:59:27
---
## 处理错误的中间件
1. 为了方便处理错误，最好使用 try...catch 将其捕获；但是，为每个中间件都写 try...catch 太麻烦，可以让最外层的中间件，负责所有中间件的错误处理；
2. 示例代码
    ```JS
    const Koa = require('koa')
    const fs = require('fs')
    const { promisify } = require('util')
    const readFile = promisify(fs.readFile)
    const app = new Koa()
    
    // 在最外层添加异常捕获的中间件
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = 500
        ctx.body = err.message
        ctx.app.emit('error', err, ctx)
        // ctx.body = '服务端内部错误'
      }
    })
    
    app.use(async (ctx, next) => {
      // next() // 无法捕获后面的异步中间件
    
      // return next() // 可以捕获异步错误
      await next() // 可以捕获异步错误
    })
    
    app.use(async ctx => {
      // 没有这个文件，会报错
      const data = await readFile('./dnskjandsa.html')
      ctx.type = 'html'
      ctx.body = data
    })
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```

## error 事件的监听
1. 运行过程中一旦出错，Koa 会触发一个 error 事件，监听这个事件，也可以处理错误；
2. 示例代码
    ```JS
    const Koa = require('koa')
    const fs = require('fs')
    const { promisify } = require('util')
    const readFile = promisify(fs.readFile)
    const app = new Koa()
    
    app.use(async ctx => {
      // 没有这个文件，会报错
      const data = await readFile('./dnskjandsa.html')
      ctx.type = 'html'
      ctx.body = data
    })
    
    app.on('error', err => { console.log('app error', err) })
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```

## 释放 error 事件
1. 需要注意的是，如果错误被 try...catch 捕获，就不会触发 error 事件；这时，必须调用 ctx.app.emit()，手动释放 error 事件，才能让监听函数生效；
2. 示例代码
    ```JS
    const Koa = require('koa')
    const fs = require('fs')
    const { promisify } = require('util')
    const readFile = promisify(fs.readFile)
    const app = new Koa()
    
    // 在最外层添加异常捕获的中间件
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = 500
        ctx.body = err.message
        ctx.app.emit('error', err, ctx)
      }
    })
    
    app.use(async ctx => {
      // 没有这个文件，会报错
      const data = await readFile('./dnskjandsa.html')
      ctx.type = 'html'
      ctx.body = data
    })
    
    app.on('error', err => { console.log('app error', err) })
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```