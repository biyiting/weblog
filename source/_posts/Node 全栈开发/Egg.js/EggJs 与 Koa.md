---
title: EggJs 与 Koa
categories:
  - Node 全栈开发
  - Egg.js
tags:
  - Egg.js
abbrlink: 38be9e7f
date: 2022-03-02 08:20:57
---
## Koa 
>Koa 和 Express 的设计风格非常类似，底层也都是共用的[同一套 HTTP 基础库](https://github.com/jshttp)，但是有几个显著的区别，除了上面提到的默认异步解决方案之外，主要的特点还有下面几个；
### Middleware
1. Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型；
    <img src="洋葱圈模型.jpg" width="400px" height="auto" class="lazy-load" title="洋葱圈模型"/>
2. 所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势；
### Context
1. 和 Express 只有 Request 和 Response 两个对象不同，Koa 增加了一个 Context 的对象，作为这次请求的上下文对象（在 Koa 1 中为中间件的 this，在 Koa 2 中作为中间件的第一个参数传入）；
    - 我们可以将一次请求相关的上下文都挂载到这个对象上；
    - 类似 traceId 这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去；
    - 相较于 request 和 response 而言更加符合语义；
2. 同时 Context 上也挂载了 Request 和 Response 两个对象。和 Express 类似，这两个对象都提供了大量的便捷方法辅助开发，例如：
    - get request.query
    - get request.hostname
    - set response.body
    - set response.status
    - ......

### 异常处理
1. 通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然，使用 try catch 就可以将按照规范编写的代码中的所有错误都捕获到，这样我们可以很便捷的编写一个自定义的错误处理中间件；
    ```JS
    async function onerror(ctx, next) {
      try {
        await next();
      } catch (err) {
        ctx.app.emit('error', err);
        ctx.body = 'server error';
        ctx.status = err.status || 500;
      }
    }
    ```
2. 只需要将这个中间件放在其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常了；

## Egg 继承于 Koa
>Egg 选择了 Koa 作为其基础框架，在它的模型基础上，进一步对它进行了一些增强；
### 扩展
1. 在基于 Egg 的框架或者应用中，可以通过定义 app/extend/{application,context,request,response}.js 来扩展 Koa 中对应的四个对象的原型，通过这个功能，可以快速的增加更多的辅助方法，例如在 app/extend/context.js 中写入下列代码：
    ```JS
    // app/extend/context.js
    module.exports = {
      get isIOS() {
        const iosReg = /iphone|ipad|ipod/i;
        return iosReg.test(this.get('user-agent'));
      },
    };
    ```
2. 在 Controller 中，我们就可以使用到刚才定义的这个便捷属性了：
    ```JS
    // app/controller/home.js
    exports.handler = (ctx) => {
      ctx.body = ctx.isIOS  ? 'Your operating system is iOS.'  : 'Your operating system is not iOS.';
    };
    ```

### 插件
1. 众所周知，在 Express 和 Koa 中，经常会引入许多的中间件来提供各种功能，例如引入 koa-session 提供 Session 的支持，引入 koa-bodyparser 来解析请求 body；而 Egg 提供了一个更加强大的插件机制，让这些独立领域的功能模块可以更加容易编写；
2. 一个插件可以包含：
    - extend：扩展基础对象的上下文，提供各种工具类、属性；
    - middleware：增加一个或多个中间件，提供请求的前置、后置处理逻辑；
    - config：配置各个环境下插件自身的默认配置项；
3. 一个独立领域下的插件实现，可以在代码维护性非常高的情况下实现非常完善的功能，而插件也支持配置各个环境下的默认（最佳）配置，让我们使用插件的时候几乎可以不需要修改配置项；


### Egg 与 Koa 的版本关系
1. Egg 1.x： Egg 1.x 发布时，Node.js 的 LTS 版本尚不支持 async function，所以 Egg 1.x 仍然基于 Koa 1.x 开发，但是在此基础上，Egg 全面增加了 async function 的支持，再加上 Egg 对 Koa 2.x 的中间件也完全兼容，应用层代码可以完全基于 async function 来开发。
    - 底层基于 Koa 1.x，异步解决方案基于 co 封装的 generator function。
    - 官方插件以及 Egg 核心使用 generator function 编写，保持对 Node.js LTS 版本的支持，在必要处通过 co 包装以兼容在 async function 中的使用。
    - 应用开发者可以选择 async function（Node.js 8.x+） 或者 generator function（Node.js 6.x+）进行编写。
2. Egg 2.x： Node.js 8 正式进入 LTS 后，async function 可以在 Node.js 中使用并且没有任何性能问题了，Egg 2.x 基于 Koa 2.x，框架底层以及所有内置插件都使用 async function 编写，并保持了对 Egg 1.x 以及 generator function 的完全兼容，应用层只需要升级到 Node.js 8 即可从 Egg 1.x 迁移到 Egg 2.x。
    - 底层基于 Koa 2.x，异步解决方案基于 async function。
    - 官方插件以及 Egg 核心使用 async function 编写。
    - 建议业务层迁移到 async function 方案。
    - 只支持 Node.js 8 及以上的版本。
