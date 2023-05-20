---
title: webpack 简介
categories:
  - 工程化
  - webpack5
tags:
  - webpack
abbrlink: 94c61764
date: 2022-10-10 13:13:34
---

## webpack 是什么？
1. webpack 是基于 node（express）的一种前端资源构建工具，一个模块打包工具（module bundler） ；
2. 在 webpack 看来, 前端的所有资源文件(js / json / css / img / less /...)都会作为模块处理；
3. 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)；


## 核心工作原理
> Loader 机制是 webpack 的核心
1. 先配置一个 js 入口文件；
    <img src="入口.jpg" width="300px" height="auto" class="custom-img" title="入口"/>
2. 在这个入口文件中的 require 和 import 会去加载资源，根据这个规则会生成一棵依赖树；
    <img src="依赖树.jpg" width="300px" height="auto" class="custom-img" title="依赖树"/>
3. webpack 会递归遍历这棵依赖树，找到每个节点对应的模块，在配置的 rules 中选择这个模块对应的加载器，将打包的内容放到 bundle.js 中；
    <img src="bundle.jpg" width="500px" height="auto" class="custom-img" title="bundle"/>

## webpack 的功能
1. 代码转化 ：
    - ts => js；
    - less  sass stylus => css；
    - 高版本 js 语法 => 低版本 js 语法；
2. 代码压缩：
    - 压缩 css js html => 删除空格、换行、注释，把变量替换成比较短的单词；
    - 转化图片；
3. 支持模块化；
4. 自动更新（热更新）： 代码更改页面自动更新；

## 模块化规范
1. commonjs 规范：node 提供（凡是配置文件都是 commonjs 规范）
    - 导入：require；
    - 导出：module.exports；
2. esModule 规范：浏览器支持（业务代码基本都是 esModule）
    - 导入：import
    - 导出：export