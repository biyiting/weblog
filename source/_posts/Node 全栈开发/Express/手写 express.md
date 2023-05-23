---
title: 手写 express
categories:
  - Node 全栈开发
  - Express
tags:
  - express
abbrlink: b75d3175
date: 2022-01-25 18:43:02
---
## 项目目录
<img src="项目目录.jpg" width="300px" height="auto" class="custom-img" title="项目目录"/>

## 实现代码
1. index.js
    ```JS
    module.exports = require('./lib/express'); // 找到 express 的入口
    ```
2. /lib/express.js
    ```JS
    const Application = require('./application');
    
    function createApplication() {
      return new Application();
    }
    
    // 提供一个 Router 类，这个类可以 new 也可以当做函数来执行
    createApplication.Router = require('./router');
    
    module.exports = createApplication;
    ```
3. /lib/application.js
    ```JS
    const http = require('http');
    const Router = require('./router');
    const methods = require('methods'); // 第三方
    
    function Application() {
    }
    
    // 路由的懒加载，调用此方法开始创建路由，不是创建应用时自动装载路由
    Application.prototype.lazy_route = function () { 
      if (!this._router) {
        this._router = new Router();
      }
    }
    
    methods.forEach((method) => { // 批量生产方法
      Application.prototype[method] = function (path, ...handlers) {
        this.lazy_route();
        this._router[method](path, handlers);
      }
    })
    
    Application.prototype.use = function () {
      this.lazy_route(); // 这个方法就是中间件的方法
      this._router.use(...arguments);
    }
    
    Application.prototype.listen = function () {
      const server = http.createServer((req, res) => {
        function done() {// 不属于路由的 
          res.end(`Cannot my ${req.method} ${req.url}`);
        }
        this.lazy_route();
        this._router.handle(req, res, done);
      });
      server.listen(...arguments)
    }
    
    module.exports = Application;
    ```
4. /lib/router/index.js
    ```JS
    const url = require('url');
    const Layer = require('./layer');
    const Route = require('./route');
    const methods = require('methods');
    
    function Router() { // new 的特点，构造函数返回一个引用类型，那么这个引用类型会作为 this
      let router = (req, res, next) => {
        // 二级路由在这里 
        // 当请求到来时 会执行此方法，这个方法需要
        // 处理请求
        router.handle(req, res, next); // 让对应的路由系统 去进行匹配操作
      }
      // 老的逻辑
      router.stack = [];
      router.__proto__ = proto; // 路由的实例可以通过链 找到 原来的方法
  
      return router; // router.get?  router.post
    }
    
    let proto = {}
    proto.route = function (path) { // this指代的是router 不是proto  因为是router.route
      let route = new Route(); // 产生route
      // 产生layer 让layer和route进行关联
      // v8垃圾回收 引用计数
      let layer = new Layer(path, route.dispatch.bind(route));
      // 这里是标识而已 
      layer.route = route; // 每个路由都具备一个route属性，稍后路径匹配到后会调用route中的每一层
      this.stack.push(layer); // 类扩展性强
      return route;
    }
    
    methods.forEach(method => {
      proto[method] = function (path, handlers) {
        // 1.用户调用get时 需要保存成一个layer 放到栈中
        // 2.产生一个Route实例和 当前的layer创造关系
        // 3.要将route的dsiaptch方法存到layer上
        let route = this.route(path);
        // 用户调用get方法时 传入的handler 就不一定是一个了
        route[method](handlers); // 让route记录用户传入的handler并且标记这个handler是什么方法
      }
    })
    
    proto.use = function (path, ...handlers) {
      // 默认第一个是路径 后面是一个个的方法，路径可以不传
      // 1.如果人家就穿了一个方法 
      if (typeof path == 'function') { // 没有传路径
        handlers.unshift(path);
        path = '/';
      }
      for (let i = 0; i < handlers.length; i++) { // 如果是多个函数 循环添加层
        let layer = new Layer(path, handlers[i]);
        // 中间件 不需要route属性 
        layer.route = undefined;
        this.stack.push(layer);
      }
    }
    
    proto.handle = function (req, res, out) {
      // 1.需要取出路由系统中Router 存放的layer 依次执行 ，next
      let { pathname } = url.parse(req.url);
      let idx = 0;
      let removed = '';
      let next = (err) => {
        if (idx >= this.stack.length) return out(); // 遍历完后还是没找到，那就直接走出路由系统
        let layer = this.stack[idx++];
        if (removed) {
          req.url = removed + pathname;// 增加路径 方便出来时匹配其他的中间件
          removed = '';
        }
        if (err) {
          // 找错误处理中间件
          if (!layer.route) {
            layer.handle_error(err, req, res, next); // 如果是中间件 你就自己处理吧
          } else {
            next(err); // 路由则跳过 继续携带错误向下执行
          }
        } else {
          // 需要查看 layer上的path 和 当前请求的路径是否一致，如果一致调用dispatch方法
          if (layer.match(pathname)) { // 我们的原则是让layer
            // 路径匹配到了 需要让layer上对应的dispatch执行
            // 加速匹配  数据结构 映射表 (O(1)) 数组（遍历  O(n)） 
            // 中间件没有方法可以匹配
            if (!layer.route) { // 中间件
              if (layer.handler.length !== 4) {
                if (layer.path !== '/') {
                  removed = layer.path // 中间件的路径
                  req.url = pathname.slice(removed.length);
                }
                layer.handle_request(req, res, next);
              } else {
                next(); // 这个是错误中间件
              }
            } else {
              if (layer.route.methods[req.method.toLowerCase()]) { // 用户注册过这个类型的方法 
                layer.handle_request(req, res, next); // 将遍历路由系统中下一层的方法传入
              } else {
                next();
              }
            }
          } else {
            next();
          }
        }
      }
      next();
    }
    module.exports = Router;
    ```
5. /lib/router/route.js
    ```JS
    const Layer = require('./layer')
    const methods = require('methods');
    
    function Route() {
      this.stack = [];
      this.methods = {}; // 用来描述内部存过哪些方法
    }
    
    Route.prototype.dispatch = function (req, res, out) { // 这里相当于将router.next方法传入进来了
      // 稍后调用此方法时 会去栈中拿出对应的 handler 一次执行
      let idx = 0;
      const next = (err) => {
        err && out(err); /// 如果内部迭代的时候出现错误 直接到外层的stack中

        if (idx >= this.stack.length) return out();
        let layer = this.stack[idx++];
        console.log(layer.method)

        if (layer.method === req.method.toLowerCase()) {
          layer.handle_request(req, res, next);
        } else {
          next();
        }
      }
      next();
    }
    
    methods.forEach(method => {
      Route.prototype[method] = function (handlers) {
        if (!Array.isArray(handlers)) {
          handlers = [handlers];
        }

        handlers.forEach((handler) => {
          let layer = new Layer('', handler); // 路径没有意义
          layer.method = method; // layer上他是什么方法的
          this.methods[method] = true; // {post:true,get:true}
          this.stack.push(layer);
        })
      }
    });
    
    module.exports = Route;
    ```
6. /lib/router/layer.js
    ```JS
    function Layer(path, handler) {
      this.path = path;
      this.handler = handler;
    }
    
    Layer.prototype.handle_error = function (err, req, res, next) {
      if (this.handler.length === 4) {
        return this.handler(err, req, res, next); // 这里调用错误处理中间件
      }
      next(err); // 普通的中间件
    }
    
    Layer.prototype.match = function (pathname) {
      if (this.path === pathname) {
        return true;
      }
      if (!this.route) { // 中间件
        if (this.path == '/') {
          return true;
        }
        // /aaaa/b     /aaaa
        return pathname.startsWith(this.path + '/'); // 中间件的匹配规则
      }
      return false
    }
    
    Layer.prototype.handle_request = function (req, res, next) {
      this.handler(req, res, next)
    }
    
    module.exports = Layer;
    ```

## <a class="attachment" name="express.zip">代码附件下载</a>