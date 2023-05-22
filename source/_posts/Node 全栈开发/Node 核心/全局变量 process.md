---
title: 全局变量 process
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 350e08bf
date: 2022-09-15 12:35:30
---
## process 
>是一个全局变量，即 global 对象的属性：用于描述当前 Node.js 进程状态的对象，提供了与操作系统交流的接口；

## 常用方法
1. process.argv 是命令行参数数组：
    ```YAML
    $ node argv.js 1991 name=byvoid --v "Carbo Kuo" 

    # 第一个返回参数是 node；
    # 第二个是文件路径及文件名；
    # 第三个后面每个元素是一个运行参数；
    [ 'node',   
      '/home/byvoid/argv.js',  
      '1991',   
      'name=byvoid',  
      '--v',   
      'Carbo Kuo' 
    ]
    ```
2. process.stdout：
    - process.stdout 是标准输出流，通常使用 console.log() 输出打印字符；
    - process.stdout.write() 函数提供了更底层的接口；
3. process.stdin：标准输入流，初始时是被暂停的状态，想要输入数据，首先必须恢复流，并手动编写流事件的响应函数；
    ```JS
    //重启恢复
    process.stdin.resume();
    
    //编写流事件响应函数
    process.stdin.on('data',function(data)) {
      process.stdout.wtite('read from console :' + data.toString());
    }
    ```
4. process.nextTick(callback)：为事件循环设置一项任务，nodejs 会在下次事件循环响应时调用 callback；
5. process.version：一个暴力 node 版本（NODE_VERSION）的内编译属性；
6. process.versions：一个暴露 nodejs 版本和其依赖的属性；
7. process.arch：系统运行的处理器的架构："arm"、"ia32"、"x64"、......；
8. process.platform：运行的系统环境 'linux2'、'darwin' 等；
9. process.memoryUsage()：返回字节码为单位的 node 进程的内存使用情况描述对象；
10. process.uptime()：node 运行的时间，秒；
11. process.cwd()：当前用户的工作目录；