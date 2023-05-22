---
title: TCP 数据粘包
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 14c7e502
date: 2022-09-20 07:35:30
---
## 数据粘包：
1. 数据的通讯至少包含发送端和接收端两个部分；
2. 发送端在工作时并不是实时的将手里的数据不停的传给接收端，而是存在一个缓冲区，等待数据累积到一定程度之后才会执行一次发送操作；
3. 同样，接收端在处理数据的时候，也不是立马使用数据，它也会把接收到的数据先放到缓存中，然后再执行数据的获取和使用；
4. 这样设计的好处就是可以减少 I/O 操作带来的性能消耗，但是对于数据使用来说就会产生粘包的问题；
5. 数据是被放在缓存中的，在什么情况下才会开始执行发送，这个就取决于 TCP 的拥塞机制；
6. 这里的粘包（nian bao）指的是由于接收端不知道数据之间的界限，在提取数据时会按照预估的字节数提取缓冲区的数据；
	
## 演示粘包现象：
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
    ```
2. client.js
    ```JS
    const net = require('net')
    
    // 创建连接
    const client = net.createConnection({ port: 1234, host: '127.0.0.1' })
    
    client.on('connect', () => {
      // 发送数据
      client.write('张三')
      client.write('张三2')
      client.write('张三3')
      client.write('张三4')
    })
    
    // 接收响应
    client.on('data', chunk => console.log(chunk.toString()))
    ```
3. 客户端发送了四条消息，期望的结果是服务器接收并处理这四次请求，客户端接收响应并打印四次结果：
    ```JS
    // 服务端打印
    张三
    张三2
    张三3
    张三4
    // 客户端打印
    你好，张三
    你好，张三2
    你好，张三3
    你好，张三4
    ```
4. 但实际结果是：有三条请求被累积到一次处理，这就是粘包的现象，这也是基于流的操作和当前 TCP 实例的实现所产生的问题；
    ```JS
    // 服务端打印
    张三
    张三2张三3张三4

    // 客户端打印
    你好，张三
    你好，张三2张三3张三4
    ```

## 解决办法
1. 最常见的办法是将数据的发送间隔时间拉长，虽然解决粘包的问题，但是也降低了数据的传输效率；
    ```JS
    const net = require('net')
    
    // 创建连接
    const client = net.createConnection({ port: 1234, host: '127.0.0.1' })
    
    const dataArr = ['张三', '张三2', '张三3', '张三4']
    
    client.on('connect', () => {
      // 发送数据
      for (let i = 0; i < dataArr.length; i++) {
        // 延迟发送
        setTimeout(() => client.write(dataArr[i]), i * 1000)
      }
    })
    
    // 接收响应
    client.on('data', chunk => console.log(chunk.toString()))
    client.on('error', err => console.log(err))
    client.on('close', () => console.log('客户端断开连接'))
    ```
2. 更好的方式使用封包拆包解决；
