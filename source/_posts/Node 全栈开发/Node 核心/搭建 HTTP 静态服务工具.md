---
title: 搭建 HTTP 静态服务工具
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 5f84c471
date: 2022-09-20 12:50:30
---
>该工具可以通过命令行指令启动服务向 web 提供的浏览文件的静态页面，简单的说就是启动一个 HTTP 服务，通过这个服务可以在浏览器上浏览服务指定的相关文件；

## 项目目录
<img src="项目目录.jpg" width="300px" height="auto" class="custom-img" title="项目目录"/>

## 实现代码
1. config.js
    ```JS
    const config = {
      // 设置端口号的配置
      port: {
        option: '-p,--port <val>',
        description: 'set your server port',
        usage: 'zhu-http-server --port 3000', // 案例
        default: 3000
      },
      // 可以配置目录
      directory: {
        option: '-d,--directory <val>',
        description: 'set your start directory',
        usage: 'zhu-http-server --directory D:',
        default: process.cwd(),
      },
      // 可以配置主机名
      host: {
        option: '-h,--host <val>',
        description: "set your hostname",
        usage: 'zhu-http-server --host 127.0.0.1',
        default: 'localhost'
      }
    }
    module.exports = config;
    ```
2. www .js
    ```JS
    #! /usr/bin/env node
    const program = require('commander'); // 命令行工具模块
    const { version } = require('../package.json');
    const config = require('./config');
    const Server = require('../src/server');
    
    program.usage('[args]')
    program.version(version);
    
    Object.values(config).forEach(val => {
        if (val.option) {
            program.option(val.option, val.description);
        }
    });
    
    program.on('--help', () => {
        console.log('\r\nExamples:');
        Object.values(config).forEach(val => {
            if (val.usage) {
                console.log('  ' + val.usage)
            }
        });
    })
    
    // 解析用户的参数
    let parserObj = program.parse(process.argv);
    let keys = Object.keys(config);
    
    // 最终用户拿到的数据
    let resultConfig = {}
    keys.forEach(key=>{ resultConfig[key] = parserObj[key] || config[key].default });
    
    let server = new Server(resultConfig);
    server.start(); // 开启一个 server
    ```
3. server.js
    ```JS
    // ------------- core ------------------
    const http = require('http');
    const fs = require('fs').promises;
    const { createReadStream, createWriteStream, readFileSync } = require('fs');
    const url = require('url');
    const path = require('path'); // babel-node  (webpack)
    const crypto = require('crypto');
    // ------------------------------------
    const ejs = require('ejs'); // 服务端读取目录进行渲染，模板工具模块
    const debug = require('debug')('server');
    const mime = require('mime'); // 识别文件的类型，自动设置 content-type
    const chalk = require('chalk'); // 提供颜色
    const template = readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8');
    
    // 根据环境变量来进行打印 process.env.DEBUG
    class Server {
        constructor(config) {
            this.port = config.port;
            this.directory = config.directory;
            this.host = config.host;
            this.template = template;
            // this.handleRequest = this.handleRequest.bind(this); // 绑定死 this
        }
    
        async handleRequest(req, res) {
            // 指的就是当前自己 Server 的实例 
            let { pathname } = url.parse(req.url); // 不考虑传递参数问题
            pathname = decodeURIComponent(pathname); // 将中文进行一次转义
            // 通过路径找到这个文件返回
            let filePath = path.join(this.directory, pathname);
    
            try {
                let statObj = await fs.stat(filePath);
                if (statObj.isFile()) {
                    this.sendFile(req, res, filePath, statObj)
                } else {
                    // 文件夹先尝试找 index.html
                    let concatfilePath = path.join(filePath, 'index.html');
                    // 如果存在 html
                    try {
                        let statObj = await fs.stat(concatfilePath);
                        this.sendFile(req, res, concatfilePath, statObj);
                    } catch (e) {
                        // 列出目录结构
                        this.showList(req, res, filePath, statObj, pathname);
                    }
                }
            } catch (e) {
                this.sendError(req, res, e);
            }
        }
    
        async showList(req, res, filePath, statObj, pathname) {
            // 读取目录包含的信息
            let dirs = await fs.readdir(filePath);
            // 渲染列表
            try {
                // 异步渲染
                let parseObj = dirs.map(item => ({
                    dir: item,
                    href: path.join(pathname, item) // 拼接当前 url 的路径
                }));
                let r = await ejs.render(this.template, { dirs: parseObj }, { async: true });
                res.setHeader('Content-Type', 'text/html;charset=utf-8');
                res.end(r);
            } catch (e) {
                this.sendError(req, res);
            }
        }
    
        gzip(req, res, filePath, statObj) {
            if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip')
                return require('zlib').createGzip(); // 创建转化流
            } else {
                return false;
            }
        }
    
        async cache(req, res, filePath, statObj) {
            // 设置「强制缓存」，新老版本浏览器全部支持，缓存 10s
            res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
            res.setHeader('Cache-Control', 'max-age=10');
    
            // 设置「协商缓存-资源指纹对比」，准确，资源很大会消耗一定时间读取文件生成 etag
            let fileContent = await fs.readFile(filePath);
            let ifNoneMatch = req.headers['if-none-match'];
            let etag = crypto.createHash('md5').update(fileContent).digest('base64');
            res.setHeader('Etag', etag);
    
            // 设置「协商缓存-缓存时间对比」，不够准确
            let ifModifiedScince = req.headers['if-modified-since'];
            let ctime = statObj.ctime.toGMTString()
            res.setHeader('Last-Modified', ctime);
    
            // 资源内容修改了，指纹匹配失效，需要重新发起请求
            if (ifNoneMatch !== etag) return false;
    
            // 资源内容修改了，客户端与服务端的文件修改时间不一致，需要重新发起请求
            if (ctime !== ifModifiedScince) return false;
    
            return true;
        }
    
        async sendFile(req, res, filePath, statObj) {
            // 缓存
            try {
                let cache = await this.cache(req, res, filePath, statObj);
                if (cache) { //  有缓存直接让用户查找缓存即可
                    res.statusCode = 304;
                    return res.end()
                }
            } catch (e) {
                console.log(e)
            }
    
            // 这里需要掌握 header，来看一下浏览器是否支持 gzip 压缩
            // 客户端和服务端定义的一个相互能识别的规则
            let gzip = this.gzip(req, res, filePath, statObj);
            if (gzip) {
                res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
                createReadStream(filePath).pipe(gzip).pipe(res);
            } else {
                createReadStream(filePath).pipe(res);
            }
        }
    
        // 专门用来处理错误信息
        sendError(req, res, e) {
            debug(e);
            res.statusCode = 404;
            res.end('Not Found');
        }
    
        start() {
            // 等价 const server = http.createServer((req,res)=>this.handleRequest(req,res));
            const server = http.createServer(this.handleRequest.bind(this));
            server.listen(this.port, this.host, () => {
                console.log(chalk.yellow(`Starting up http-server, serving ./${this.directory.split('\\').pop()}\r\n`));
                console.log(chalk.green(`http://${this.host}:${this.port}`));
            })
        }
    }
    module.exports = Server;
    // gzip 压缩（前端可以通过 webpack 插件进行压缩），如果前端压缩了后端直接返回即可；
    // 若前端没有进行压缩，后端在返回的时候进行 .gz 压缩 
    ```
4. template.ejs
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <% dirs.forEach(item=>{ %>
            <li><a href="<%=item.href%>">
                    <%=item.dir%>
                </a></li>
            <%})%>
    </body>
    </html>
    ```
5. package.json
    ```JSON
    {
      "name": "ws-http-server",
      "version": "1.0.1",
      "description": "",
      "main": "index.js",
      "keywords": [
        "http-server"
      ],
      "author": "",
      "license": "MIT",
      "bin": {
        "ws-http-server": "./bin/www.js",
        "whs": "./bin/www.js"
      },
      "dependencies": {
        "chalk": "^4.1.0",
        "commander": "^5.1.0",
        "debug": "^4.1.1",
        "ejs": "^3.1.3",
        "mime": "^2.4.6"
      }
    }
    ```
6. 在工作区间根目录下执行 npm link，将 package.json bin 下的 ws-http-server、whs 命令映射到全局；
7. 如果不指定服务的端口号默认为 3000，服务提供 浏览项目目录下 的所有文件；
8. 效果展示：
    <img src="效果展示.jpg" width="300px" height="auto" class="custom-img" title="效果展示"/>

## <a class="attachment" name="http-server.zip">附件下载(meimei.zip)</a>
