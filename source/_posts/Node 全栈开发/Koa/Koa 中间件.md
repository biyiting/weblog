---
title: Koa 中间件
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: dee10fb1
date: 2022-02-21 15:20:27
---

## 中间件栈
1. 洋葱模型
    <img src="洋葱模型.png" width="400px" height="auto" class="lazy-load" title="洋葱模型"/>

    - 多个中间件（中间件是一个函数）会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行；
    - 最外层的中间件首先执行；
    - 调用 next 函数，把执行权交给下一个中间件；
    - ...
    - 最内层的中间件最后执行；
    - 执行结束后，把执行权交回上一层的中间件；
    - ...
    - 最外层的中间件收回执行权之后，执行 next 函数后面的代码；
2. 注意
    - 如果中间件内部没有调用 next 函数，那么执行权就不会传递下去；
    - koa 中要求 每个 next 方法前面都必须增加 await 或者 return next（因为中间件会被 koa 包装成 promise），否则不存在等待效果；
    - koa 中所有的异步都必须是 promise，否则不会有等待效果；

## 中间件原理
<img src="中间件原理.jpg" width="600px" height="auto" class="lazy-load" title="中间件原理"/>

## 中间件执行顺序
1. 示例代码 1
    ```JS
    const Koa = require('koa');
    const app = new Koa();

    app.use(async (ctx, next) => {
        console.log(1);
        next(); // 调用 next 表示执行下一个中间件 
        console.log(2);
    })
    app.use(async (ctx, next) => {
        console.log(3);
        next();
        console.log(4)
    })
    app.use(async (ctx, next) => {
        console.log(5)
        next();
        console.log(6)
    });
    app.listen(4000);
    // 输出：
    // 1
    // 3
    // 5
    // 6
    // 4
    // 2
    ```
    <img src="示例代码1.jpg" width="600px" height="auto" class="lazy-load" title="示例代码1"/>
2. 示例代码 2
    ```JS
    const Koa = require('koa');
    const app = new Koa();

    const log = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('logger');
                resolve()
            }, 3000);
        })
    }
    app.use(async (ctx, next) => {
        console.log(1);
        next(); // 调用 next 表示执行下一个中间件 
        console.log(2);
    })
    app.use(async (ctx, next) => {
        console.log(3);
        await log(); // -- 等待
        next();
        console.log(4)
    })
    app.use(async (ctx, next) => {
        console.log(5)
        next();
        console.log(6)
    });
    app.listen(4000);
    // 输出：
    // 1
    // 3
    // 2
    // logger
    // 5
    // 6
    // 4
    ```
    <img src="示例代码2.jpg" width="600px" height="auto" class="lazy-load" title="示例代码2"/>
3. 示例代码 3
    ```JS
    const Koa = require('koa');
    const app = new Koa();

    const log = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('logger');
                resolve()
            }, 3000);
        })
    }
    app.use(async (ctx, next) => { // fn1
        console.log(1);
        await next();
        console.log(2);
        ctx.body = 'hello 1'; // 会取第一个中间件执行完的结果（执行顺序在最后）
    })
    app.use(async (ctx, next) => {
        console.log(3);
        await log(); // -- 等待
        ctx.body = 'hello 2'
        next();
        console.log(4)
    })
    app.use(async (ctx, next) => {
        console.log(5)
        ctx.body = 'hello 3';
        next();
        console.log(6)
    });
    app.listen(3000);
    // 界面响应： hello 1
    ```

## next 的作用
1. 可以把多个模块通过 next 方法来连接起来；
2. 可以决定是否向下执行(可以实现后台权限)；
3. 可以在中间件中封装一些方法，封装后向下执行；

## 常用中间件
1. koa-compose：可以将多个中间件合成为一个；
    ```JS
    const Koa = require('koa')
    const fs = require('fs')
    const util = require('util')
    const compose = require('koa-compose')
    const app = new Koa()
    
    const a1 = (ctx, next) => {
      console.log('a1')
      next()
    }
    const a2 = (ctx, next) => {
      console.log('a2')
      next()
    }
    const a3 = (ctx, next) => {
      console.log('a3')
      next()
    }
    app.use(compose([a1, a2, a3]))
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```
2. koa-static：提供静态资源托管；
    ```JS
    const Koa = require('koa')
    const static = require('koa-static')
    const path = require('path')
    const mount=require('koa-mount') // 支持请求前缀
    const app = new Koa();
    
    app.use(mount('/app',static(path.join(__dirname, '../dist/'))))
    app.use(static('./public'))
    app.use(static(path.join(__dirname, './public')))
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```
3. koa-mount：给静态资源设置虚拟路径；
    ```JS
    const Koa = require('koa')
    const static = require('koa-static')
    const path = require('path')
    const mount = require('koa-mount')
    const app = new Koa()
    
    app.use(mount('/foo', static(path.join(__dirname, './public')))
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```
4. koa-router：Express 路由风格（app.get、app.put、app.post ...）：
    ```JS
    const Koa = require('koa');
    const Router = require('@koa/router');
    
    const app = new Koa();
    const router = new Router();
    
    router.get('/', (ctx, next) => {
      // ctx.router available
    });
    
    app
      .use(router.routes())
      .use(router.allowedMethods());
    
    app.listen(3000, () => { console.log('http://localhost:3000') })
    ```