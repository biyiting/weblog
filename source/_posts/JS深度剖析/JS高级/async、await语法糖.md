---
title: async、await语法糖
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 5818f9b7
date: 2022-09-14 15:41:13
---

## Promise 缺陷：<small>还是基于链式调用，但是可以用 async/await 来解决</small>

## async
1. async 函数返回的是一个 promise  对象，return 的值就是 promise 实例的值；
2. 最主要的作用是配合 await 使用的，一旦在函数中使用 await，那么当前的函数必须用 async 修饰；
3. 示例代码：
    ```js
    async function fn() {
      return 10;
    }
    console.log(fn());
    ```
    ```js
    async function fn() {
      // 因为加入了 setTimeout 异步操作，直接向下执行，没有 return，fn 的值为 undefined
      setTimeout(_ => {
        return 10;
      }, 1000);
    }
    console.log(fn());
    ```

## await
1. await 只能处理 promise 为 fulfilled（成功）的时候；
2. await 是异步编程，当代码执行到此行，构建一个异步的微任务，等待 promise 返回结果，否则 await 下面的代码都不能执行（await 下面的代码也都被列到任务队列中）；
    - 若 promise 返回 rejected 失败状态，则 await 不会接收其返回结果，await 下面的代码也不会再继续执行；
    - 若 promise 返回 fulfilled 成功状态，则继续执行以下代码；
3. 示例代码：
    ```js
    async function fn() {
      console.log(1);
      let AA = await Promise.resolve(100);
      console.log(AA);
    }
    fn();
    console.log(2);
    // 1 2 100
    ```
    ```js
    let p1 = Promise.resolve(100);
    let p2 = new Promise(resolve => {
      setTimeout(_ => {
        resolve(200);
      }, 1000);
    });
    async function fn() {
      console.log(1);
      // await 以下的所有代码都不执行，放入事件队列微任务中，1s 后返回输出 200
      let result = await p2;
      console.log(result);
      // await 以下的所有代码都不执行，放入事件队列微任务中，p1 执行完后返回输出 100
      let AA = await p1;
      console.log(AA);
    }
    fn();
    console.log(2);
    // 1  2  200  100
    ```
    ```js
    async function fn() {
      let reason = await Promise.reject(3);
      console.log(reason);
    }
    fn();
    // 报错：Uncaught (in promise) 3
    ```

## 面试题

### 第 1 题：（头条、字节）
1. 题目
    ```JS
    async function async1() {
      console.log('async1 start');

      await async2();
      console.log('async1 end');

      // 浏览器环境：识别 await 后面跟的是 promise 的话默认就会直接调用 promise.then
      // 等价于 async2().then(() => console.log('async1 end'))

      // node 低版本环境：node 识别不出 await，则直接用 promsie 的 resolve 包裹起来，resole 里面是 promise 会调用 then，然后再调用 then(() => console.log('async1 end'))，相当于调了两次 then，所以结果和浏览器的不太一致
      // new Promise((resolve, reject) => resolve(async2())).then(() => console.log('async1 end'));
    }

    async function async2() {
      console.log('async2');
    }

    console.log('script start');

    setTimeout(function () {
      console.log('setTimeout');
    }, 0)

    async1();

    new Promise(function (resolve) {
      console.log('promise1');
      resolve();
    }).then(function () {
      console.log('promise2');
    });

    console.log('script end');

    // 浏览器环境执行：
    //  script start
    //  async1 start
    //  async2
    //  promise1
    //  script end
    //  async1 end
    //  promise2
    //  setTimeout
    ```
2. 图解
    {% asset_img 第1题.jpg 第1题 %}
### 第 2 题：（字节）
1. 题目
    ```JS
    console.log(1);

    setTimeout(_ => { console.log(2); }, 1000);

    async function fn() {
      console.log(3);
      setTimeout(_ => { console.log(4); }, 20);
      return Promise.reject();
    }

    async function run() {
      console.log(5);
      await fn();
      console.log(6);
    }

    run();

    // 需要执行 150MS 左右
    for (let i = 0; i < 90000000; i++) { }

    setTimeout(_ => {
      console.log(7);
      new Promise(resolve => {
        console.log(8);
        resolve();
      }).then(_ => { console.log(9); });
    }, 0);

    console.log(10);

    // 1
    // 5
    // 3
    // 10
    // 4
    // 7
    // 8
    // 9
    // 2
    ```
2. 图解
    {% asset_img 第2题.jpg 第2题 %}