---
title: 手写 Koa
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: 5c9bea75
date: 2022-02-26 15:20:27
---


## 项目目录
<img src="项目目录.jpg" width="600px" height="auto" class="custom-img" title="项目目录"/>

## 重点关注：
1. 上下文的实现原理；
2. 中间件实现原理；

## 实现代码
1. application.js
    ```JS
    const EventEmitter = require('events');
    const http = require('http');
    const context = require('./context');
    const request = require('./request');
    const response = require('./response');
    const Stream = require('stream')
    
    class Application extends EventEmitter {
        constructor() {
            super();
            // 为了防止 多个实例共享 response、request、context，都需要进行拷贝
            this.response = Object.create(response);
            this.request = Object.create(request);
            this.context = Object.create(context);
            this.middlewares = []; // 存储用户所有的callback
        }
    
        // 将用户传递的 callback 全部组合起来，reduce 实现 compose
        use(callback) {
            this.middlewares.push(callback)
        }
    
        createContext(req, res) {
            // 每次请求都创建全新的上下文
            let context = Object.create(this.context);
            let request = Object.create(this.request);
            let response = Object.create(this.response);
    
            // 上下文中有一个 request、response 对象 是自己封装的的对象
            context.request = request;
            context.response = response;
    
            // 上下文中还有一个 req 属性，指代的是原生的 req
            // 自己封装的 request 对象上有 req 属性
            // 自己封装的 response 对象上有 res 属性
            context.request.req = context.req = req;
            context.response.res = context.res = res;
            return context;
        }
    
        compose(ctx) {
            // 在数组中取出第一个，第一个执行后执行第二个
            const dispatch = i => { // 一个promise 返回一个promise会有等待效果
                if (i === this.middlewares.length) return Promise.resolve(); // 没有使用中间件的情况
                let middleware = this.middlewares[i];
                // 中间件如果不是 async 不能 then，则把中间件包装成 promise
                // next 方法指代的是 () => dispatch(i + 1)
                return Promise.resolve(middleware(ctx, () => dispatch(i + 1))); 
            }
            return dispatch(0); // reduce如何实现
        }
    
        handleRequest(req, res) {
            let ctx = this.createContext(req, res); // 创建一个上下文
    
            this.compose(ctx).then(() => {
                let body = ctx.body; //当组合后的promise完成后，拿到最终的结果 响应回去
                if (typeof body == 'string' || Buffer.isBuffer(body)) {
                    res.end(body);
                } else if (body instanceof Stream) {
                    // 因为不知道这个流文件是什么，则给流设置一个下载头，默认下载下来
                    res.setHeader('Content-Disposition', 
                        `attachement;filename=${encodeURIComponent('下载1111')}`)
                    body.pipe(res);
                } else if (typeof body == 'object') {
                    res.end(JSON.stringify(body));
                }
                // ....
            })
        }
    
        listen(...args) {
            let server = http.createServer(this.handleRequest.bind(this));
            server.listen(...args);
        }
    }
    
    module.exports = Application;
    ```
2. context.js
    ```JS
    const proto = {}
    
    // 代理方法（会调用 request、response 中的属性）
    function defineGetter(target, key) {
        // __defineGetter__代理已经被废弃了，可使用 Object.defineProperty 替换
        proto.__defineGetter__(key, function () {
            return this[target][key];
        });
    }
    // 代理方法（会调用 request、response 中的属性）
    function defineSetter(target, key) {
        // __defineSetter__代理已经被废弃了，可使用 Object.defineProperty 替换
        proto.__defineSetter__(key, function (value) {
            this[target][key] = value;
        });
    }
    
    defineGetter('request', 'url');  // ctx.url => ctx.request.url
    defineGetter('request', 'path');
    defineGetter('request', 'query'); // ctx.query => ctx.request.query
    defineGetter('response', 'body'); // ctx.body => ctx.response.body
    defineSetter('response', 'body'); // ctx.body => ctx.response.body
    module.exports = proto;
    ```
3. request.js
    ```JS
    const url = require('url');
    
    const request = {
        get url() {
            // 属性访问器 ctx.request.url => this 是 ctx.request
            // ctx.request.req 是原生的 req
            return this.req.url;
        },
        get path() {
            return url.parse(this.req.url).pathname;
        },
        get query() {
            return url.parse(this.req.url, true).query;
        }
        // .... 其他扩展属性
    }
    
    module.exports = request;
    ```
4. response.js
    ```JS
    const response = {
        _body: '',
        get body() {
            return this._body;
        },
        set body(val) {
            this._body = val;
        }
        // .... 其他扩展属性
    }
    
    module.exports = response;
    ```


## <a class="attachment" name="koa.zip">代码附件下载(meimei.zip)</a>