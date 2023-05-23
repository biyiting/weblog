---
title: Redis 安装
categories:
  - Node 全栈开发
  - Redis
tags:
  - Redis
abbrlink: e97e4f76
date: 2023-01-09 09:22:58
---

## 关于 Redis 的版本
1. Redis 借鉴了 Linux 操作系统对于版本号的命名规则：
    - 版本号第二位如果是奇数，则为非稳定版本（例如 2.7、2.9、3.1）；
    - 如果是偶数，则为稳定版本（例如 2.6、2.8、3.0、3.2）；
2. 当前奇数版本就是下一个稳定版本的开发版本：例如 2.9 版本是 3.0 版本的开发版本，所以在生产环境通常选取偶数版本的 Redis，如果对于某些新的特性想提前了解和使用，可以选择最新的奇数版本；


## 获取 Redis 的方式
1. 安装到自己电脑上；
2. 安装到虚拟机上；
3. 安装到远程服务器上；
4. 可以从 Docker Hub 获取 Redis 的 Docker 镜像；
5. ......

## 在 macOS 中安装 Redis
1. 方式一：编译安装；
2. 方式二（推荐）：使用 Homebrew 安装；brew install redis

## 运行 Redis
1. 编译后在 Redis 源代码目录的 src 文件夹中会有以下几个可执行文件：
    |可执行文件	|说明|
    |---------|----|
    |redis-server	Redis |服务器|
    |redis-cli	Redis |命令行客户端|
    |redis-benchmark	|Redis 性能测试工具|
    |redis-check-aof	|AOF 文件修复工具|
    |redis-check-dump	|RDB 文件检查工具|
    |redis-sentinel	|哨兵模式工具|
2. 运行 redies：redis-server
    ```SHELL
    # 直接运行 redis-server 即可启动 Redis
    redis-server

    # 默认使用 6379 端口，可通过 --port 指定端口
    redis-server --port 1234
        
    # 后台运行 Redis
    redis-server --daemonize yes
        
    # 查看 Redis 运行状态
    ps -ef | grep -i redis
    ```

## 停止 Redis
1. 考虑到 Redis 有可能正在将内存中的数据同步到硬盘中，强行终止 Redis 进程可能会导致数据丢失；
2. 正确停止 Redis 的方式应该是向 Redis 发送 SHUTDOWN 命令：
    ```SHELL
    # 先断开所有客户端连接，然后根据配置执行持久化，最后完成退出
    redis-cli shutdown

    # 使用 kill Redis 进程的 PID 也可以正常结束 Redis
    kill -9 4684
    ```

## 连接 Redis
1. redis-cli 是 Redis 自带的基于命令行的 Redis 客户端，也是学习和测试 Redis 的重要工具；
    ```SHELL
    # 运行 redis-cli 即可连接数据库
    redis-cli 
        
    # 可以指定服务器地址和端口连接
    redis-cli -h 127.0.0.1 -p 1234
        
    # 测试与 Redis 是否连接正常：Redis 返回 PONG，证明连接正常
    127.0.0.1:6379> PING

    # 断开连接 Ctrl + C 或者 quit
    quit
    ```

## Redis 设置远程连接
1. 为了保护数据安全，开放远程连接需谨慎操作；
2. Redis 默认是不允许远程连接的，修改 redis.conf 配置文件可以开启远程连接：
    ```yaml
    # 绑定的端口号
    bind 0.0.0.0
    
    # 关闭保护模式
    protected-mode no
    ```
3. 除此之外还需要检查服务器防火墙是否开放了 Redis 服务占用的端口号；
4. 修改之后重启 Redis 服务即可生效；