---
title: mvc 案例
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: de83b2a2
date: 2022-02-24 15:20:27
---

## 项目目录
<img src="项目目录.jpg" width="300px" height="auto" class="custom-img" title="项目目录"/>

## 实现代码
1. koa/index.js
    ```JS
    const Koa = require('koa');
    const Router = require('koa-router')
    const app = new Koa();
    const router = require('./routes/index'); // 引入合并后的路由
    const views = require('koa-views'); // ejs 模板引擎中间件
    const cors = require('koa-cors'); // 跨域中间件
    
    app.use(cors());
    
    // 模板在 /views 下
    app.use(views(__dirname + '/views', { // 在 ctx 上新增了一个 render 方法
        map: {
            html: 'ejs' // 内部会自动引入 ejs模板
        }
    }));
    
    app.use(router());
    
    app.listen(3000, () => { console.log('locahost:3000') });
    ```
2. koa/routes/index.js
    ```JS
    // 整合
    let articleRouter = require('./articleRouter');
    let userRouter = require('./userRouter');
    let combineRoutes = require('koa-combine-routers');
    
    // 路由合并
    module.exports = combineRoutes(articleRouter, userRouter);
    ```
3. koa/routes/articleRouter.js
    ```JS
    let Router = require('koa-router');
    let ArticleController = require('../controller/articleController'); // 引入文章的控制器
    let article = new ArticleController();
    
    // 划分路由的作用域，都是以 /article 开头的路由
    const router = new Router({ prefix: '/article' });
    
    // 命中路径后 调用对应的控制器来处理
    router.get('/add', article.add);
    router.get('/remove', article.remove);
    
    module.exports = router;
    ```
4. koa/routes/userRouter.js
    ```JS
    let Router = require('koa-router');
    let UserController = require('../controller/userController'); // 引入用户的控制器
    let user = new UserController();
    
    // 划分路由的作用域，都是以 /user 开头的路由
    const router = new Router({ prefix: '/user' });
    
    // 命中路径后 调用对应的控制器来处理
    router.get('/add', user.add);
    router.get('/remove', user.remove);
    
    module.exports = router;
    ```
5. koa/controller/articleController.js
    ```JS
    class ArticleController {
        async add(ctx, next) {
            ctx.body = '文章添加'
        }
        async remove(ctx, next) {
            ctx.body = '文章删除'
        }
    }
    
    module.exports = ArticleController
    ```
6. koa/controller/userController.js
    ```JS
    class UserController {
        async add(ctx, next) {
            // 使用模板引擎中间件在 ctx 上挂载的 render 进行渲染
            await ctx.render('index.html', { name: '张三', age: 11 })
        }
        async remove(ctx, next) {
            await ctx.render('index.html', { name: '删除张三', age: 11 })
        }
    }
    
    module.exports = UserController
    ```
7. koa/views/index.html
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <%=name%> <%=age%>
    </body>
    </html>
    ```

## <a class="attachment" name="koa.zip">代码附件下载(meimei.zip)</a>
