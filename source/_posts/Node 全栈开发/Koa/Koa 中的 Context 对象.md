---
title: Koa 中的 Context 对象
categories:
  - Node 全栈开发
  - Koa
tags:
  - koa
abbrlink: b8c80395
date: 2022-02-21 14:20:27
---

## 上下文(Context)
1. Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法；
2. 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能；

## context 实现了不同应用以及不同请求之间的环境隔离
<img src="环境隔离.jpg" width="500px" height="auto" class="custom-img" title="环境隔离"/>

## ctx 实现代理
<img src="实现代理.jpg" width="500px" height="auto" class="custom-img" title="实现代理"/>

## Context API
1. ctx.req：Node 的 request 对象.
2. ctx.res：Node 的 response 对象，绕过 Koa 的 response 处理是 不被支持的. 应避免使用以下 node 属性：
    > - res.statusCode
		> - res.writeHead()
		> - res.write()
		> - res.end()
3. ctx.request：koa 的 Request 对象.
4. ctx.response：koa 的 Response 对象.
5. ctx.state：推荐的命名空间，用于通过中间件传递信息和前端视图
6. ctx.app：应用程序实例引用
7. ctx.app.emit：Koa 应用扩展了内部 EventEmitter。
    > - ctx.app.emit 发出一个类型由第一个参数定义的事件。
    > - 对于每个事件，您可以连接 "listeners"，这是在发出事件时调用的函数
8. ctx.cookies.get(name, [options])：通过 options 获取 cookie name，signed 所请求的cookie应该被签名
9. ctx.cookies.set(name, value, [options])：通过 options 设置 cookie name 的 value :
    > - maxAge 一个数字表示从 Date.now() 得到的毫秒数
    > - signed cookie 签名值
    > - expires cookie 过期的 Date
    > - path cookie 路径, 默认是'/'
    > - domain cookie 域名
    > - secure 安全 cookie
    > - httpOnly 服务器可访问 cookie, 默认是 true
    > - overwrite 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。
10. ctx.throw([status], [msg], [properties])：Helper 方法抛出一个 .status 属性默认为 500 的错误，这将允许 Koa 做出适当地响应；
11. ctx.respond
    > - 为了绕过 Koa 的内置 response 处理，可以显式设置 ctx.respond = false; 如果想要写入原始的 res 对象而不是让 Koa 处理你的 response，请使用此参数；
    > - 请注意，Koa 不支持使用此功能。这可能会破坏 Koa 中间件和 Koa 本身的预期功能。使用这个属性被认为是一个 hack，只是便于那些希望在 Koa 中使用传统的 fn(req, res) 功能和中间件的人；

## Request 别名（和 Request 别名等效）
1. ctx.header
2. ctx.headers
3. ctx.method
4. ctx.method=
5. ctx.url
6. ctx.url=
7. ctx.originalUrl
8. ctx.origin
9. ctx.href
10. ctx.path
11. ctx.path=
12. ctx.query
13. ctx.query=
14. ctx.querystring
15. ctx.querystring=
16. ctx.host
17. ctx.hostname
18. ctx.fresh
19. ctx.stale
20. ctx.socket
21. ctx.protocol
22. ctx.secure
23. ctx.ip
24. ctx.ips
25. ctx.subdomains
26. ctx.is()
27. ctx.accepts()
28. ctx.acceptsEncodings()
29. ctx.acceptsCharsets()
30. ctx.acceptsLanguages()
31. ctx.get()

## Response 别名（和 Response 别名等效）
1. ctx.body
2. ctx.body=
3. ctx.status
4. ctx.status=
5. ctx.message
6. ctx.message=
7. ctx.length=
8. ctx.length
9. ctx.type=
10. ctx.type
11. ctx.headerSent
12. ctx.redirect()
13. ctx.attachment()
14. ctx.set()
15. ctx.append()
16. ctx.remove()
17. ctx.lastModified=
18. ctx.etag=
