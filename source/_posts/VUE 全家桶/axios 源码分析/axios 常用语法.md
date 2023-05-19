---
title: axios 常用语法
categories:
  - VUE 全家桶
  - axios 源码分析
tags:
  - axios
abbrlink: 46df655c
date: 2023-02-14 15:20:38
---

## 常用语法
|语法|描述|
|-------|-------|
|axios(config):	|通用/最本质的发任意类型请求的方式 |
|axios(url[, config]):	|可以只指定 url 发 get |
|axios.request(config): 	|等同于 axios(config) |
|axios.get(url[, config]): 	|发 get 请求 |
|axios.delete(url[, config]): 	|发 delete 请求 |
|axios.post(url[, data, config]): 	|发 post 请求|
|axios.put(url[, data, config]): 	|发 put 请求 |
|axios.defaults.xxx: 	|请求的默认全局配置|
|axios.interceptors.request.use(): 	|添加请求拦截器|
|axios.interceptors.response.use(): 	|添加响应拦截器|
|axios.create([config]): 	|创建一个新的 axios(它没有下面的功能)|
|axios.Cancel(): 	|用于创建取消请求的错误对象 |
|axios.CancelToken(): 	|用于创建取消请求的 token 对象|
|axios.isCancel(): 	|是否是一个取消请求的错误 |
|axios.all(promises): 	|用于批量执行多个异步请求 |
|axios.spread(): 	|用来指定接收所有成功数据的回调函数的方法|


## 图解
<img src="图解.jpg" width="700px" height="auto" class="custom-img" title="图解"/>