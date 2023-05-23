---
title: HTTP 模块
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: "72e60707"
date: 2022-09-20 09:35:30
---

## 基于 NodeJS 中的 http 模块
>掌握 HTTP 协议中一些必要的内容组成以及一些常见功能实现的原理，如缓存、编码、断点续传、防盗链等；

## 快速使用
1. net 模块主要用于创建 TCP 服务器或客户端，对应传输层；
2. http 模块依赖 net 模块，用于实现 HTTP 服务器或客户端，对应应用层；
3. net 模块创建服务：
    ```JS
    const net = require('net')
    
    // 创建服务端
    const server = net.createServer()
    
    server.listen(1234, () => console.log('服务端启动，访问 localhost:1234'))
    
    // 监听客户端请求
    server.on('connection', socket => {
      socket.on('data', data => console.log(data.toString()))
      socket.end('test http request')
    })
    ```
4. http 模块创建服务：
    ```JS
    const http = require('http')

    // 创建客户端，针对于请求和响应完成各自的操作
    const server = http.createServer((req, res) => console.log('接收到请求'))

    server.listen(1234, () => console.log('服务端启动，访问 localhost:1234'))
    ```

## 获取 http 请求信息
1. 示例代码：
    ```JS
    const http = require('http')
    const url = require('url')

    const server = http.createServer((req, res) => {
      // ----- 01 请求行 -----
      // url 模块可以解析路径
      const { pathname, query } = url.parse(req.url, true)
      console.log(pathname, '----', query) // /user ---- { name: '"张三"' }
      // 请求方式
      console.log(req.method)
      // 协议版本号
      console.log(req.httpVersion)

      // ----- 02 请求头 -----
      // console.log(req.headers)

      // ----- 03 请求体 -----
      const arr = []
      req.on('data', chunk => arr.push(chunk))
      req.on('end', () => console.log(Buffer.concat(arr).toString()))
    })

    server.listen(1234, () => console.log('server is running...'))

    // 发送 get 请求

    // 发送 post 请求：curl -v -X POST -d "'name':'张三'" http://localhost:1234/
    ```
2. 效果展示：
    <img src="获取http请求信息.png" width="300px" height="auto" class="lazy-load" title="获取http请求信息"/>

## 设置 http 响应
1. 示例代码：
    ```JS
    const http = require('http')

    const server = http.createServer((req, res) => {
      // request 相当于一个可读流
      // response 相当于一个可写流

      // 写数据，end  后才会完成写入
      // res.write('ok')
      // res.end()
      // 或者
      // res.end('ok')

      // 设置状态码
      res.statusCode = 302
      // 设置响应头
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end('你好张三')
    })
    server.listen(1234, () => console.log('server is running...'))

    // 发送 get 请求
    ```
2. 效果展示：
    <img src="设置http响应.jpg" width="300px" height="auto" class="lazy-load" title="设置http响应"/>

## 面试题
### 图片防盗链
1. 服务端
    ```JS
    const http = require('http');
    const fs = require('fs');
    const url = require('url');
    const path = require('path');
    const mime = require('mime');

    const server = http.createServer((req, res) => {
        const { pathname } = url.parse(req.url, true);
        const absPath = path.join(__dirname, pathname);

        fs.stat(absPath, (err, statObj) => {
            if (err) return res.end('Not Found')

            if (statObj.isFile()) {
                // 对 jpg 图片进行防盗链处理
                if (/\.jpg/.test(absPath)) {
                    // referer 来源 iframe img，表示这个资源被谁引用过
                    let referer = req.headers['referer'] || req.headers['referrer'];
                    if (referer) {
                        let host = req.headers.host;
                        referer = url.parse(referer).host;

                        console.log(host); // localhost:3000
                        console.log(referer); // 127.0.0.1:5500
                        if (host !== referer) { // 判断客户端请求的 host 和图片 referer 是否一样
                            // 不一样返回 404 错误图片
                            fs.createReadStream(path.resolve(__dirname, '404.jpg')).pipe(res);
                            return;
                        }
                    }
                }

                res.setHeader('Content-Type', mime.getType(absPath))
                fs.createReadStream(absPath).pipe(res);
            } else {
                return res.end('Not Found')
            }
        })
    }).listen(3000);
    ```
2. 客户端
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <!-- 如果网站没有 referer，会导致发送任何资源都不会带 referer -->
        <!-- <meta name="referrer" content="never"> -->
    </head>
    <body>
        <!-- 如果图片直接打开是不会增加 referer 的 -->
        <!-- 应该进行校验 如果引用我的人 和我的域不是同一个 应该返回错误图片 -->
        <img src="http://localhost:3000/1.jpg" />
    </body>
    </html>
    ```
