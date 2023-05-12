---
title: Promise
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-13 15:41:13
---

## Promise 解决了哪些问题

## Promise 的使用

## promise 中的 then：每个 Promise 的实例都有 then 方法

## promise 中的 then 链机制：then 方法结束都会返回一个新的 Promise 实例；

## promise 中的 catch：

## then 和 catch 的区别：（使用 catch 更优）

## promise 中其它常用方法

## 面试题

### 第 1 题：reject 和 catch 处理上有什么不同？
1. reject 是用来抛出异常，catch 用来处理异常；
2. reject 是 Promise 的静态方法，而 catch 是 Promise 实例的方法；
3. reject 后一定会进入 then 中的第二个回调，如果 then 中没有第二个回调，则进入 catch；
4. 网络异常，会直接进入 catch 而不会进入 then 的第二个回调；

### 第 2 题
```JS
```

### 第 3 题
```JS
```

### 第 4 题
```JS
```
### 第 5 题
```JS
```
### 第 6 题
```JS
```
### 第 7 题
```JS
```
### 第 8 题
```JS
```
### 第 9 题
```JS
```
### 第 10 题
```JS
```
### 第 11 题
```JS
```
### 第 12 题
```JS
```
### 第 13 题
```JS
```
### 第 14 题
```JS
```
### 第 15 题
```JS
```
### 第 16 题
```JS
```
### 第 17 题
```JS
```
### 第 18 题
```JS
```
### 第 19 题
```JS
```
### 第 20 题
```JS
```