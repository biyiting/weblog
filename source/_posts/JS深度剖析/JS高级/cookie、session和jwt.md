---
title: cookie、session和jwt
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 3d35da55
date: 2022-09-18 18:41:13
---

## Cookie：服务端和客户端都可以操作
### 为什么会出现 cookie?
1. http 是无状态的协议，导致请求不知道是哪个用户操作的，cookie 的出现就是为了解决 http 请求无状态和服务端要知道请求来源之间的矛盾；
2. cookie 会根据服务端发送的响应报文中的 set-cookie 字段信息，通知客户端保存 cookie，下次客户端发送请求时就会携带 cookie，服务端收到请求，根据 cookie 和服务器的记录进行比对，找到之前的状态；

### 特点：
1. Cookie 类型为小型文本文件，一般不超过 4kb；
2. Cookie 在每次请求中都会被自动携带发送；

### Cookie 的常用属性：
| 属性名|作用|
|------|---|
|name	|cookie 的名称；|
|value |	cookie 的值；|
|expires |	指定浏览器可发送 Cookie 的有效期（绝对时间，和 http 缓存使用方式相同）|
|max-age |	指定浏览器可发送 Cookie 的有效期（相对时间，和 http 缓存使用方式相同）|
|size |	Cookie 的大小，各个浏览器 Cookie 的大小和条数限制不一样，但是最大值都不会超过 4KB；|
|path |	可用于限制指定 Cookie 的发送范围的文件目录；不过另有办法可避开这项限制；|
|domain |	指定的域名（默认是当前域名）；|
|Secure |	Secure 为 Cookie 的安全属性，若设置为 true，则浏览器只会在 https 和 ssl 等安全协议中传输此 Cookie，不会在不安全的 http 协议中传输此 Cookie；|
|HttpOnly |	Cookie 的 HttpOnly 属性是 Cookie 的扩展功能，它使 JavaScript 脚本无法获得 Cookie，其主要目的为防止跨站脚本攻击（Cross-sitescripting，XSS）对 Cookie 的信息窃取；

### Cookie 存在的问题有哪些
1. cookie 会作为 http 的请求报文进行传递，所以要注意 cookie 字段的大小，一般小于 4kb，如果 cookie 存储的字段过大，浪费流量，服务端也会耗费性能解析 cookie（解决方案：静态资源的请求，无必要可以不携带 cookie，合理设置 cookie，不必要字段不放 cookie 里面）；
2. cookie 保存在客户端，存在篡改或劫持的风险，故 cookie 不能存储重要信息，一般只保存凭证，服务端会根据 cookie 从数据库或 session 中查找具体信息（当给浏览器设置 cookie 时，可以增加签名，根据数据内容创建一个唯一的签名，读取 cookie 的时候验证签名，判断 cookie 是否被篡改）；
    ```JS
    const http = require('http');
    const querystring = require('querystring');
    const crypto = require('crypto');
    const secret = 'adsadbAvhnrgreu657i76lu;oi3r';  // 自定义的秘钥

    // 签名
    const toSign = (value) => {
        // 当给浏览器设置 cookie 时，可利用 加盐算法 增加签名，根据数据内容创建一个唯一的签名  
        // 相同的秘钥签名的结果是相同，并且不能反解
        let str = crypto.createHmac('sha256', secret).update(value).digest('base64');
        // /、=、+ 浏览器不能识别，直接去掉，只是做签名没必要改成其他字符（和后端统一规则即可）
        return str.replace(/\/|\=|\+/, '');
    }

    http.createServer((req, res) => {
        req.getCookie = function (key, options = {}) {
            let cookieObj = querystring.parse(req.headers.cookie, '; ', '=');
            if (options.signed) { // 是否验证签名
                let [value, signCode] = (cookieObj[key] || '').split('.');
                let newSign = toSign(value);
                if (newSign === signCode) {
                    return value; // 签名一致,说明这次的内容是没有被改过的
                } else {
                    return undefined; // 签名被篡改了,不能使用了
                }
            }
            return cookieObj[key];
        }

        res.setCookie = function (key, value, options = {}) {
            let opts = [];
            if (options.domain) opts.push(`domain=${options.domain}`);
            if (options.path) opts.push(`path=${options.path}`);
            if (options.maxAge) opts.push(`max-age=${options.maxAge}`);
            if (options.httpOnly) opts.push(`httpOnly=${options.httpOnly}`);
            if (options.signed) value = value + '.' + toSign(value);
            res.setHeader('Set-Cookie', [`${key}=${value}; ${opts.join('; ')}`]);
        }

        if (req.url == '/read') {
            // 读取 cookie
            res.end(req.getCookie('name', { signed: true }) || 'empty');
        } else if (req.url == '/write') {
            // 设置 cookie
            res.setCookie('name', 'zhangsan', { httpOnly: true, maxAge: 200, signed: true });
            res.setCookie('age', '20');
            res.end('write Ok');
        } else {
            res.end('Not Found');
        }
    }).listen(3000);
    ```
    {% asset_img 签名.jpg 签名 %}


## Session：只能服务端操作
### session 是什么？
1. session 本质是一段保存在服务端内存中的代码片段，session 的实现一般是基于 cookie 的；
2. cookie 记录凭证，session 记录具体数据；
3. 和 cookie 相比，比较安全，session 是存储在服务端的；

### session 存在问题
1. session 会占用内存，开销大，传统的 session 保存在内存里，每当用户登录时，在 session 做一次记录，随着认证用户的增多，服务端的开销会明显增大；
2. session 横向扩展差，页面的请求不一定是同一台服务器，如果请求打到不同服务器，那么服务器之间需要共享 session，此时需要做 session 的持久化，如果持久化失败就出现认证失败；

### session 实现
1. 在服务器端生成全局唯一标识符 session_id；
2. 在服务器内存里开辟此 session_id 对应的数据存储空间；
3. 将 session_id 作为全局唯一标示符通过 cookie 发送给客户端；
4. 以后客户端再次访问服务器时会把 session_id 通过请求头中的 cookie 发送给服务器；
5. 服务器再通过 session_id 把此标识符在服务器端的数据取出；

### 示例代码
```JS
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

//存放会话数据 key卡号 value就是卡号对应的数据对象
var sessions = {};
//与客户端约定的会话ID
var SESSION_KEY = 'connect.sid'

//当用户访问根目录的时候 执行对应的回调函数
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');

    // 1. 先取出cookie中的sessionId 卡号
    var sessionId = req.cookies[SESSION_KEY];
    // 如果有卡号的，也就是有ID的话 老顾客
    if (sessionId) {
        //取出此卡号对应的信息，余额
        var sessionObj = sessions[sessionId];
        if (sessionObj) {
            //扣掉10块钱
            sessionObj.balance = sessionObj.balance - 10;
            res.send('欢迎你老顾客，你卡上还剩' + sessionObj.balance);
        } else {
            genId(res);
        }
        //如果没有的话就是新顾客
    } else {
        genId(res);
    }

    function genId(res) {
        //由店家生成一个唯一的卡号
        var id = Date.now() + '' + Math.random();
        //要在店家的小本上记录一下此卡号对应的余额
        sessions[id] = { balance: 100 };
        //把这个卡发给顾客带回家
        res.cookie(SESSION_KEY, id);
        //告诉 用户送他一张卡
        res.send('欢迎你新顾客，送你一张价值100元的剪发卡');
    }
});
app.listen(9090);
```


## jwt
> 全称 json web token，是目前最流行的跨域身份验证解决方案
### 解决的问题：
1. 传统的 session 不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享，如果持久层失败会出现认证失败，问题的本质是因为服务端需要记录客户端对应的信息，来鉴别客户端状态；
2. 使用 jwt，服务端不需要记录客户端对应的信息，服务端通过对 token 上携带的信息进行处理能够确认这个token 是否是有效，服务器变为无状态，使其更容易扩展；

### token 的组成：头、内容、签名，通过符号.连接
1. Header 头部
    ```JS
    {
      'typ': 'JWT', // 声明类型
      'alg': 'HS256' // 声明加密的算法
    }
    ```
2. Payload 内容：存放有效信息，例如过期时间，面向用户等
    ```JS
    {
      "exp": "1234567890",
      "name": "John Doe",
       ...
    }
    ```
3. Signature 签名
    - 将 base64 编码后的 Header 和 Payload 使用.连接组成字符串；
    - 将字符串进行 Header 中声明的加密方式进行加盐 secret 组合加密；
4. 鉴权原理
    - 客户端发送 /login 请求到服务端 A，服务端 A 校验登录通过后生成 token；
    - 服务端 A 将 token 返回给客户端；
    - 客户端发送 /list 请求到服务端 B，同时在请求头里携带了 token，服务端将 token 拆解成header+payload+signature 三部分，再次将 header.payload 进行加密，得到新的 signature，如果新的signature 和旧的 signature 相等则表示当前客户端是登录过的状态；
    - 服务端 B 校验通过，返回数据给客户端；
{% asset_img jwt.jpg 鉴权原理 %}
5. 示例代码
    ```JS
    const Koa = require('koa');
    const Router = require('@koa/router');
    const app = new Koa();
    const crypto = require('crypto');
    const bodyparser = require('koa-bodyparser'); // 正文解析中间件
    const router = new Router();
    app.use(bodyparser());
    
    let jwt = {
        secret: 'suijishengchengdemiyao',
        toBase64Url(base64) {
            // 将 + / = 敏感字符 => - _ ''
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        },
        toBase64(content) {
            return this.toBase64Url(Buffer.from(JSON.stringify(content)).toString('base64'))
        },
        sign(content, secret) {
            let r = require('crypto').createHmac('sha256', secret).update(content).digest('base64');
            return this.toBase64Url(r)
        },
        encode(payload, secret) {
            // 对 head 和内容进行签名
            let header = this.toBase64({ typ: 'JWT', alg: 'HS256' });
            let content = this.toBase64(payload);
            let sign = this.sign([header, content].join('.'), secret)
            return [header, content, sign].join('.');
        },
        base64urlUnescape(str) {
            str += new Array(5 - str.length % 4).join('=');
            return str.replace(/\-/g, '+').replace(/_/g, '/');
        },
        decode(token, secret) {
            let [header, content, sign] = token.split('.');
            let newSign = this.sign([header, content].join('.'), secret);
            if (sign === newSign) { // 校验了签名
                // 将 base64 转化成 字符串
                return Buffer.from(this.base64urlUnescape(content), 'base64').toString();
            } else {
                throw new Error('被篡改')
            }
        }
    }
    
    router.post('/login', async (ctx) => {
        let { username, password } = ctx.request.body;
        if (username === 'admin' && password == 'admin') {
            let token = jwt.encode({
                username,
                expires: new Date(Date.now() + 10 * 1000).toGMTString()
            }, jwt.secret);
            ctx.cookies.set('tokenm', 'token');
            ctx.body = { err: 0, username, token };
        }
    })
    
    router.get('/validate', async (ctx) => {
        let authoraztion = ctx.headers['authorization'];
        try {
            let payload = jwt.decode(authoraztion, jwt.secret); // 解析上次传入的 payload
            if (payload.expires < Date.now()) ctx.body = '过期了';
            ctx.body = { err: 0, username: payload };
        } catch (e) {
            console.log(e);
            ctx.body = { err: 1, message: '错误' };
        }
    })
    app.use(router.routes());
    app.listen(3000);
    ```
## 面试题

### 第 1 题：cookie 放哪里，cookie 能做的事情和存在的价值

### 第 2 题：cookie 和 token 都存放在 header 里面，为什么只劫持前者

### 第 3 题：cookie 和 session 有哪些方面的区别

### 第 4 题：Cookie 如何防范 XSS 攻击
1. XSS（跨站脚本攻击）是指攻击者在返回的 HTML 中嵌入 javascript 脚本，为了减轻这 些攻击，需要在 HTTP 头部配上，set-cookie： 
    - httponly-这个属性可以防止 XSS,它会禁止 javascript 脚本来访问 cookie；
    - secure - 这个属性告诉浏览器仅在请求为 https 的时候发送 cookie；

### 第 5 题：一句话概括 restful
- 就是用 URL 定位资源，用 HTTP 描述操作；