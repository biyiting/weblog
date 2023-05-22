---
title: events 事件模块
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 48436a97
date: 2022-09-15 20:35:30
---
## events 与 EventEmitter
1. node.js 是基于事件驱动的异步操作架构，内置 events 模块；
2. events 模块提供了 EventEmitter 类：这个类的实例对象具备注册事件、发布事件和删除事件的一系列事件模型机制的常规操作；
3. node.js 中很多内置核心模块继承了 EventEmitter 类：所以开发者在使用的时候无需单独的引入 events 模块；

## EventEmitter 常见 API
1. on(eventName,listener)：注册事件监听器；
2. emit(eventName)：触发事件，按照注册的顺序同步调用每个事件监听器；
3. once(eventName,listener)：注册事件监听器，但只在第一次事件发布的时候执行，之后就被删除；
4. off(eventName,listener)：移除特定的监听器；

## 事件驱动机制
1. Node.s 中有 Event Loop 事件循环机制，在事件触发后就会将回调函数添加到 Event Loop 中；
2. 当主线程代码执行完成后，就会按照内部的实现机制执行 Event Loop 中的回调函数，从而实现异步编程；


## Nodejs 事件循环机制
1. 图示
    <img src="事件循环机制.jpg" width="700px" height="auto" class="custom-img" title="事件循环机制"/>
2. Nodejs 完整事件循环：
    - 执行同步代码，将不同的任务添加到相应的队列，所有同步代码执行后会去执行满足条件的微任务；
    - 所有微任务代码执行后会按照上面图示中的顺序执行六个队列中的任务；
    - 首先会执行 timer 队列中满足的宏任务，当产生的微任务时：
      - node版本小于10：要等到 timer 队列执行完，再清空微任务队列，再依次切换宏任务队列；
      - node版本大于10：等当前宏任务执行完，去清空微任务队列，再继续执行该宏任务队列；
    - 切换并清空全部六个队列后，就会重新从 timer 开始检查，直到所有队列都没有任务了，代码执行结束；

## setTimeout 和 setImmediate 的执行顺序问题
```JS
// setTimeout 和 setimmediate 执行顺序是随机的
setTimeout(() => console.log('s1'))
setImmediate(() => console.log('setimmediate'))

// setImmediate 属于 check phase，由于 check 阶段在 timers phase 后面，所以一般情况下 setTimeout 和 setInterval 会在 setImmediate 之前执行

// 当不传时间参数或者设置为 0 的时候，nodejs 会取值为 1ms（在浏览器端可能取值会更大一下，不同浏览器也各不相同），所以在电脑 cpu 性能够强，能够在1ms 内执行到 timers phase 的情况下，由于时间延迟不满足回调 setTimeout 不会被执行，于是只能等到第二轮再执行，这样 setInterval 就会先执行
// 可能由于 cpu 多次执行相同任务用时会有细微差别，而且在 1ms 上下浮动，才会造成上面的随机现象
```


## I/O 事件回调中运行
>setImmediate 将永远优先于 setTimeout 执行
```js
const fs = require('fs')

fs.readFile('./m1.js', () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immdieate'))
})

// readFile 执行，readFile 属于 poll phase，则切换到 poll 队列
// 向 timer 队列和 check 队列分别添加任务，但不管 setTimeout 向队列添加任务的速度有多快，poll 队列清空后，仍会继续按顺序向下切换队列，所以首先切换到的永远是 check 队列
// 当执行完 check 队列中的 setImmediate 回调，事件循环才会从头检查宏任务队列，这时才轮到 timer 队列中的 setTimeout 任务
// 所以执行结果永远是 immediate timeout
```

## 面试题
### 第 1 题
```JS
setTimeout(() => console.log('s1'))

Promise.resolve().then(() => console.log('p1'))

console.log('start')

process.nextTick(() => console.log('tick')) // 微任务，nextTick 优先级高于 promise

setImmediate(() => console.log('setimmediate'))

console.log('end')

// start,  end, tick, p1, s1,  setimmediate
```
### 第 2 题
```JS
setTimeout(() => {
  console.log('s1')
  Promise.resolve().then(() => console.log('p1'))
  process.nextTick(() => console.log('t1'))
})

Promise.resolve().then(() => console.log('p2'))

console.log('start')

setTimeout(() => {
  console.log('s2')
  Promise.resolve().then(() => console.log('p3'))
  process.nextTick(() => console.log('t2'))
})

console.log('end')

// node 版本 < 10：等待整个宏队列执行后再清空微任务
// start, end， p2, s1, s2 , t1, t2, p1, p3

// node 版本 > 10：清空一个宏任务就清空微任务
// start end p2 s1 t1 p1 s2 t2 p3
```