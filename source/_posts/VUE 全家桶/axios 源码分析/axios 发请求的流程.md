---
title: axios 发请求的流程
categories:
  - VUE 全家桶
  - axios 源码分析
tags:
  - axios
abbrlink: 7833ee8
date: 2023-02-15 09:38:38
---

## 图解
<img src="图解.jpg" width="500px" height="auto" class="custom-img" title="图解"/>


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


    // 初始化构建 promise chain 链，dispatchRequest 用于发送请求，undefined用于占位
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
1. 整体流程: request(config)  ==> dispatchRequest(config) ==> xhrAdapter(config)；
2. request(config): 将请求拦截器、dispatchRequest()、响应拦截器通过 promise 链串连起来, 返回 promise；
3. dispatchRequest(config): 转换请求数据 ==> 调用 xhrAdapter()发请求 ==> 请求返回后转换响应数据，返回promise；
4. xhrAdapter(config): 创建 XHR 对象, 根据 config 进行相应设置, 发送特定请求, 并接收响应数据, 返回promise；
