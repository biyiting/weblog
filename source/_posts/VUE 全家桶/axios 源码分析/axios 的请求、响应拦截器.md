---
title: axios 的请求、响应拦截器
categories:
  - VUE 全家桶
  - axios 源码分析
tags:
  - axios
abbrlink: 1eacf613
date: 2023-02-15 09:40:38
---

## 图解
<img src="图解.jpg" width="auto" height="200px" class="custom-img" title="图解"/>

## 关键代码
```JS
Axios.prototype.request = function request(config) {
    if (typeof config === 'string') {  // config 是字符串的情况，config 为 url
        config = arguments[1] || {};
        config.url = arguments[0];
    } else {
        config = config || {};
    }

    // 合并配置
    config = mergeConfig(this.defaults, config);

    // 匹配请求方式（默认为 get）
    if (config.method) {
        config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
    } else {
        config.method = 'get';
    }


    // 初始化构建 promise chain 链，dispatchRequest 用于发送请求，undefined 用于占位
    var chain = [dispatchRequest, undefined];
    // 生成一个成功的 promise，将 config 传递给后面的 promise
    var promise = Promise.resolve(config); 

    // 遍历请求拦截器，将请求拦截器放入数组的最前面（请求拦截器执行顺序倒置）
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    // 遍历请求拦截器，将响应拦截器放入数组的最尾部
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    // 如果 chain 链长度不为 0，不断的调用 then 将 chain 中的成功、失败的回调放入其中
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
    }

    // 请求拦截器 => 发送请求 => 响应拦截器 => 返回 promise 继续调用用户的 then
    return promise;
};
```

## 结论：
1. 请求拦截器: 在真正发请求前, 可以对请求进行检查或配置进行特定处理的函数, 包括成功/失败的函数, 传递的必须是 config；
2. 响应拦截器: 在请求返回后, 可以对响应数据进行特定处理的函数,包括成功/失败的函数, 传递的默认是 response；
3. 多个请求拦截器的执行顺序是从后向前的（执行顺序倒置）；