---
title: axios 与 Axios 的关系
categories:
  - VUE 全家桶
  - axios 源码分析
tags:
  - axios
abbrlink: 85ec8cff
date: 2023-02-14 15:22:38
---

## 图解
<img src="图解.jpg" width="auto" height="500px" class="lazy-load" title="图解"/>


## 关键代码：axios.js
```JS
'use strict';
// axios 入口文件
//引入工具
var utils = require('./utils');
//引入绑定函数  创建函数
var bind = require('./helpers/bind');// 创建函数的
//引入 Axios 主文件
var Axios = require('./core/Axios');
// 引入合并配置的函数
var mergeConfig = require('./core/mergeConfig');
// 导入默认配置
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 * 创建一个 Axios 的实例对象
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    // instance 为返回 Axios 原型上的 request 方法，this  指向 context，context 为 Axios 的实例
    var instance = bind(Axios.prototype.request, context);
    // instance 函数身上添加 Axios.prototype 的所有方法，this 指向 context
    utils.extend(instance, Axios.prototype, context);
    // instance 函数身上添加 context 实例对象的所有属性
    utils.extend(instance, context);
    return instance;
}

// 通过配置创建 axios 函数
var axios = createInstance(defaults);

axios.Axios = Axios;

// 工厂函数  用来返回创建实例对象的函数
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;
//简单实现全局暴露 axios
window.axios = axios;
module.exports.default = axios;
```

## 结论：
1. 从语法上来说：axios 不是 Axios 的实例；
2. 从功能上来说：axios 是 Axios 的实例；
3. axios 是 Axios.prototype.request 函数 bind() 返回的函数；
4. axios 作为对象有 Axios 原型上所有的方法，有 Axios 对象上所有的属性；