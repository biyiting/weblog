---
title: mongo Shell
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: a6879564
date: 2022-01-13 19:33:24
---

## 什么是 mongo Shell？
1. mongo Shell 是 MongoDB 官方提供的一个在命令行中用来连接操作 MongoDB 服务的客户端工具；
2. 使用 mongo Shell 可以对 MongoDB 数据库进行数据的管理；

## 下载 mongo Shell
> mongo Shell 包含在 MongoDB 服务器安装中，如果已经安装了服务器，则 mongo Shell 将安装在与服务器二进制文件相同的位置；

## 启动 mongo Shell 并连接到 MongoDB
1. 在后台启动 mongodb 服务：
    ```SHELL
    # --dbpath 设置数据存放目录
    # --logpath 设置日志存放目录
    # --fork 在后台运行
    mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
    ```
2. 连接默认端口上的本地 MongoDB 服务：
    ```SHELL
    # 使用默认端口 27017
    mongo
    ```
3. 连接非默认端口上的本地 MongoDB 服务：
    ```SHELL
    # --port 设置端口号
    mongo --port 28015
    ```
4. 连接远程主机上的 MongoDB 服务：
    ```SHELL
    # --host <host> 设置远程服务器地址
		# --port 设置端口号
    mongo --host mongodb0.example.com --port 28015
    ```
5. 连接具有身份认证的 MongoDB 服务：
    ```SHELL
    # 在连接字符串中指定用户名，身份验证数据库以及可选的密码
    mongo "mongodb://alice@mongodb0.examples.com:28015/?authSource=admin"
    
    # --username <user> 用户名
    # --password 密码
    # --authenticationDatabase <db> 身份验证数据库
    mongo --username alice --password --authenticationDatabase admin --host mongodb.examples.com --port 28015
    ```

## 查看 mongod 服务是否启动
```SHELL
ps aux | grep -v grep | grep mongod
```

## mongo Shell 执行环境
1. 提供了 JavaScript 执行环境；
2. 内置了一些数据库操作命令：
    - show dbs；
    - db；
    - use database；
    - show collections；
    - ......
3. 提供了一大堆的内置 API 用来操作数据库；
    - db.users.insert({ name: 'Jack', age: 18 })；
    - ......


## 退出连接
1. 第一种：exit；
2. 第二种：quit()；
3. 第三种：Ctrl + C；