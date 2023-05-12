---
title: 同步异步编程、EventLoop
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-11 15:41:13
---
## 浏览器的进程
1. 进程是计算机调度的基本单位，进程中包含着线程
2. 每一个页签都是一个进程，互不影响；
3. 浏览器也有一个主线程（用户界面）；
4. 渲染进程：每个页签里都有一个渲染进程（浏览器内核）；
5. 网路进程（处理请求）；
6. GPU 进程，3d 绘制；
7. 第三方插件的进程；

## 渲染进程（包含多个线程）
1. GUI 渲染进程（渲染页面）；
2. js 引擎线程与页面渲染时互斥；
3. 事件触发线程是独立的线程 EventLoop；
4. 事件 click、setTimeout、ajax 也是一个独立的线程；

## 宏任务、微任务：
1. 宏任务：宿主环境提供的异步方法都是宏任务；
    - script 脚本；
    - ui 渲染；
    - ajax；
    - 事件；
    - requestFrameAnimation；
    - setTimeout：setTimeout 时间为 0 的时候，为浏览器的反应时间，谷歌浏览器一般是 5-6ms 左右，综合评估（老电脑、低版本浏览器）一般是 17ms 左右；
    - setInterval；
    - setImmediate（IE）；
    - MessageChannel；
    - ......
2. 微任务：语言标准提供的；
    - promise.then；
    - process.nextTick；
    - MutationObserver；

## 事件循环图解
{% asset_img 事件循环图解.jpg 事件循环图解 %}

## 案例分析
```HTML
<body>
  <script>
    document.body.style.background = 'green';
    console.log(1);

    Promise.resolve().then(() => {
      console.log(2);
      document.body.style.background = 'red';
    });

    console.log(3);
    // 1 3 2 red（只渲染红色）
  </script>
</body>
```
```HTML
<body>
  <script>
    document.body.style.background = 'green';
    console.log(1);

    setTimeout(() => {
      console.log(2);
      document.body.style.background = 'red';
    }, 10);

    console.log(3);
    // 1 3 2 green => red（屏幕闪烁）
  </script>
</body>
```

## 面试题 

### 第 1 题
1. 题目
    ```JS
    let n = 0;

    // 设置定时器的操作是同步的，但是 1S 后做的事情是异步的
    setTimeout(_ => {
        n += 10;
        console.log(n);
    }, 1000);

    n += 5;
    console.log(n);
    ```
2. 图解
    {% asset_img 第1题.jpg 第1题 %}

### 第 2 题
1. 题目
    ```JS
    setTimeout(() => {
      console.log(1);
    }, 20);

    console.log(2);

    setTimeout(() => {
      console.log(3);
    }, 10);

    console.log(4);

    // 计时开始
    console.time('AA');
    for (let i = 0; i < 90000000; i++) {
      // do soming  280ms左右
    }
    // 计时结束
    console.timeEnd('AA');

    console.log(5);

    setTimeout(() => {
      console.log(6);
    }, 8);

    console.log(7);

    setTimeout(() => {
      console.log(8);
    }, 15);

    console.log(9);
    ```
2. 图解
    {% asset_img 第2题.jpg 第2题 %}

### 第 3 题
```JS
console.log(1);

setTimeout(_ => console.log(2), 50);

console.log(3);

setTimeout(_ => {
  console.log(4);
  // 遇到死循环，所有代码执行最后都是在主栈中执行，遇到死循环，主栈永远结束不了，后面啥都干不了
  while (1 === 1) { }
}, 0);

console.log(5);
```

### 第 4 题
```HTML
<body>
  <button id="button">按钮</button>
  <script>
    button.addEventListener('click', () => {
      console.log('listener1');
      Promise.resolve().then(() => console.log('micro task1'))
    })
    button.addEventListener('click', () => {
      console.log('listener2');
      Promise.resolve().then(() => console.log('micro task2'))
    })
    // 相当于函数执行 click1() click2()，此时并未将回调放到 宏任务队列中
    button.click();
    // listener1
    // listener2
    // micro task1
    // micro task2
  </script>
</body>
```
```HTML
<body>
  <!-- 点击按钮 -->
  <button id="button">按钮</button>
  <script>
    button.addEventListener('click', () => {
      console.log('listener1');
      Promise.resolve().then(() => console.log('micro task1'))
    })
    button.addEventListener('click', () => {
      console.log('listener2');
      Promise.resolve().then(() => console.log('micro task2'))
    })
    // 点击按钮执行事件，将两个事件回调都放到了宏任务队列中，每次拿出一个执行
    // listener1
    // micro task1
    // listener2
    // micro task2
  </script>
</body>
```