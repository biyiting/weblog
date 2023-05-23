---
title: macOS 安装 MongoDB
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: 534e12a1
date: 2022-01-13 18:33:24
---

## 安装说明
1. 关于 MongoDB 的版本号；
    - 奇数为开发版（4.3），建议开发环境使用；
    - 偶数为稳定版（4.4），建议生产环境使用；
2. 从版本 3.2 之后不再支持 32 位操作系统；

## 使用 homebrew 安装 MongoDB
1. 安装 Command Line Tools for Xcode
    - 如果电脑上安装了 XCode 软件开发工具（在 App Store 中安装 Xcode），Command Line Tools for Xcode 已经安装好了；
    - 也可以直接安装 Command Line Tools for Xcode，在终端输入 xcode-select --install 完成安装；
2. 安装 Homebrew
    ```SHELL
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    ```
3. 添加 MongoDB 安装源到 Homebrew
    ```SHELL
    brew tap mongodb/brew
    ```
4. 使用 homebrew 安装 MongoDB
    ```SHELL
    brew install mongodb-community@4.4
    ```
5. 该安装除安装必要的二进制文件之外，还会创建运行 MongoDB 服务所需的文件目录：
    - MongoDB 配置文件：/usr/local/etc/mongod.conf；
    - 日志文件存储目录：/usr/local/var/log/mongodb；
    - 数据文件存储目录：/usr/local/var/mongodb；


## 启动 MongoDB
```shell
# 启动 MongoDB 并运行在后台
brew services start mongodb-community@4.4

# 或者手动启动 MongoDB，运行在前台，也可以加入 --fork 参数运行在后台
mongod --config /usr/local/etc/mongod.conf
```

## 查看 MongoDB 服务运行状态
```shell
# 在正在运行的进程中搜索 mongod
ps aux | grep -v grep | grep mongod

# 还可以通过查看日志文件以查看 mongod 进程的当前状态
/usr/local/var/log/mongodb/mongo.log
```

## 停止 MongoDB
```shell
brew services stop mongodb-community@4.4
```

## 卸载 MongoDB
```shell
brew uninstall mongodb-community@4.4
```

## 查看版本号
```shell
mongod --version
```
