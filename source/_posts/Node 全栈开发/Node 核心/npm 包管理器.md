---
title: npm 包管理器
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 130263fe
date: 2022-09-15 14:35:30
---
## 什么是包管理器？
1. 包管理器又称为软件包管理系统，它是电脑中自动安装、配置、卸载和升级软件包的工具组合，在软件和应用软件的安装管理中均有广泛应用；
2. 举例：
    - linux：rpm、dpkg、apt、yum；
    - mac：brew；
    - java：maven；
    - windows：chocolatey

## npm 是什么？
1. 使用 Node 包管理器 (NPM: Node Package Manager)
2. NPM 包含三部分：
    - 存放第三方包的代码库；
    - 管理本地已经安装包的机制信；
    - 定义包依赖关系的标准；

## npm 的安装模式
1. 本地模式：
    - NPM 只工作在工作目录下，不会造成系统范围的修改，这个模式让你在某个 Node 程序下尽情地安装，测试模块，而不会影响你电脑上的其他 Node 程序；
2. 全局模式：
    - 全局模式适合那些将被很多程序使用，而且总是被全局加载的公共模块，比如命令行工具这些公不会被应用程序直接使用的模块；
    - NPM 会把包安装到 /usr/local/lib/node_modules；

## 常用命令
```YAML
# 本地模式
npm install vue

# 全局模式
npm install nodemon -g

# 指定版本
npm install vue@3.0.0

# 指定版本分支版本
npm install vue@3.0.x

# 小于某一个版本
npm install vue@" <3. 0.x"

# 指定范围
npm install vue@">-1.0.0 <2.0.0"

# 卸载模块
npm uninstall vue

# 更新模块
npm update vue
```