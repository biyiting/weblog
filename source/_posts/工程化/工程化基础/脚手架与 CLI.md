---
title: 脚手架与 CLI
categories:
  - 工程化
  - 工程化基础
tags:
  - 工程化
abbrlink: 87bac55
date: 2022-09-15 17:20:17
---

## 什么是脚手架
1. 脚手架是为保证各施工过程顺利进行而搭设的工作平台；
2. 在软件开发上的脚手架指的是：有人帮你把这个开发过程中要用到的工具、环境都配置好了，你就可以方便地直接开始做开发，专注你的业务，而不用再花时间去配置这个开发环境；

## 什么是 CLI 工具
1. CLI（command-line interface,命令行界面）是指可在用户提示符下键入可执行指令的界面；
2. 它通常不支持鼠标，用户通过键盘输入指令，计算机接收到指令后，予以执行；

## 前端脚手架
1. 通常前端脚手架都会和 CLI 工具配合出现，以至于很多人认为脚手架就是 CLI 工具；
2. 著名的脚手架：
    - vue-cli；
    - create-react-app；
    - Plop 可以使用已有的模板文件批量生成代码，省去了手动复制粘贴的过程；
    - Yeoman 一款老牌、通用的脚手架工具，与其说它是一个脚手架，不如说是一个脚手架的运行平台，支持各种语言，比如 Web、 Java、 Python、C＃ 等；

## 为什么要创建自己的脚手架
1. 为项目引入新的通用特性；
2. 针对构建环境配置优化；
3. 单元测试等辅助工具代码；
4. 定制目录结构与通用模板；