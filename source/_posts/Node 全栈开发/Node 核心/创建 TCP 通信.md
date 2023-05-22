---
title: 创建 TCP 通信
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 2f090cce
date: 2022-09-19 24:35:30
---

## 创建 TCP 通信：
1. 使用 NodeJS 提供的内置模块创建 TCP 的服务端与客户端的实例，然后让两者进行通信；
2. Net 模块实现了用于底层通信的接口，可以直接创建基于流操作的（TCP或IPC）服务端和客户端；
	
## 通信过程：
1. 创建服务端：接收和回写客户端数据；
2. 创建客户端：发送和接收服务端数据；
3. 数据传输：内置服务事件和方法读写数据；
	
## 通信事件：
1. 关于连接的常用事件：
    - listening 事件：调用 server.listen 方法之后触发；
    - connection 事件：新的连接建立时触发，也就是服务端每次收到客户端请求回调的时候，它的参数是 net.Socket 的对象实例（通常用 socket 表示），可以理解为一个双工流；
    - connect 事件：客户端建立连接时触发；
    - close 事件：当连接关闭时触发，如果当前还有连接存在，直到所有连接都结束之后才会触发这个事件；
    - error 事件：当错误出现的时候触发；
2. 关于处理数据的常用事件和方法：
    - data 事件：当接收到数据的时候触发，其实就是从可读流中消费数据的操作（net 模块创建的都是基于流的操作，所以它本身就是可读流和可写流的集合，data 事件用于消费数据，write 方法用于写入数据；）；
    - write 方法：在 socket 上发送数据，默认是 UTF8 编码；
    - end 操作（事件&方法）：当 socket 的一端发送 FIN 包时触发，结束可读端；

## 示例代码
1. server.js
    ```JS
    const net = require('net')
    
    // 创建服务端实例
    const server = net.createServer()
    // 应用进程占用的端口
    const PORT = 1234
    // 客户端访问的主机地址
    const HOST = 'localhost'
    
    server.listen(PORT, HOST)
    
    server.on('listening', () => console.log(`服务端已经开启，地址：${HOST}:${PORT}`))
    
    server.on('connection', socket => {
      // 接收数据
      socket.on('data', chunk => {
        const msg = chunk.toString()
        console.log(msg)
        // 响应数据
        socket.write(Buffer.from('你好，' + msg))
      })
    })
    
    server.on('close', () => console.log('服务端断开连接'))
    
    server.on('error', err => {
      err.code === 'EADDRINUSE' ? console.log('地址被占用') : console.log(err);
    })
    
    // 输出：张三
    ```
2. clint.js
    ```JS
    const net = require('net')
    
    // 创建连接
    const client = net.createConnection({ port: 1234, host: '127.0.0.1' })
    
    // 发送数据
    client.on('connect', () => client.write('张三'))
    // 接收响应
    client.on('data', chunk => console.log(chunk.toString()))
    
    client.on('error', err => console.log(err))
    client.on('close', () => console.log('客户端断开连接'))
    
    // 输出：你好张三
    ```
3. 运行服务：
    - 运行服务端 `node server.js`
    - 运行客户端 `node client.js`