---
title: js 沙箱机制
categories:
  - 高阶技术专题
  - 微前端解决方案
tags:
  - 微前端
abbrlink: f5a4f359
date: 2022-04-16 13:12:58
---

## 沙箱的两种实现方式（当运行子应用时应该跑在内部沙箱环境中）：
1. 快照沙箱：在应用沙箱挂载或卸载时记录快照，在切换时依据快照恢复环境 (无法支持多实例)
2. Proxy 代理沙箱：不影响全局环境（支持多实例）；
	
## 快照沙箱
>快照沙箱只能针对单实例应用场景，如果是多个实例同时挂载的情况则无法解决，只能通过 proxy 代理沙箱来实现：
1. 实现原理：
    - 激活时将当前 window 属性进行快照处理（恢复之前的快照）；
    - 失活时用快照中的内容和当前 window 属性比对，将变化的属性保存到 modifyPropsMap 中，并用快照还原 window 属性；
    - 再次激活时，再次进行快照，并用上次修改的结果还原 window；
2. 实现代码：
    ```JS
    class SnapshotSandbox {
      constructor() {
        this.proxy = window;  // 初始化 proxy 的值为 window
        this.modifyPropsMap = {}; // 存储变化的属性
        this.active();
      }
      active() {
        this.windowSnapshot = {}; // window 对象的快照
        for (const prop in window) {
          if (window.hasOwnProperty(prop)) {
            // 将 window 上的属性进行拍照
            this.windowSnapshot[prop] = window[prop];
          }
        }
        Object.keys(this.modifyPropsMap).forEach(p => {
          window[p] = this.modifyPropsMap[p];
        });
      }
      inactive() { 
        for (const prop in window) { // diff 差异
          if (window.hasOwnProperty(prop)) {
            // 将上次拍照的结果和本次 window 属性做对比
            if (window[prop] !== this.windowSnapshot[prop]) {
              // 保存修改后的结果
              this.modifyPropsMap[prop] = window[prop];
              // 还原 window
              window[prop] = this.windowSnapshot[prop];
            }
          }
        }
      }
    }
    
    // 测试
    let sandbox = new SnapshotSandbox(); // 初始化，默认快照一次
    ((window) => {
        window.a = 1;
        window.b = 2;
        console.log(window.a, window.b); // 1 2
        sandbox.inactive(); // 失活，回到之前的快照状态
        console.log(window.a, window.b); // undefined undefined
        sandbox.active(); // 激活，快照记录
        console.log(window.a, window.b); // 1 2
    })(sandbox.proxy);
    ```

## Proxy 代理沙箱
1. 每个应用都创建一个 proxy 来代理 window，好处是每个应用都是相对独立，不需要直接更改全局 window 属性！
2. 实现代码：
    ```JS
    class ProxySandbox {
      constructor() {
        const rawWindow = window;
        const fakeWindow = {};
        const proxy = new Proxy(fakeWindow, {
          set(target, p, value) {
            target[p] = value;
            return true
          },
          get(target, p) {
            return target[p] || rawWindow[p];
          }
        });
        this.proxy = proxy
      }
    }
    
    // 测试
    let sandbox1 = new ProxySandbox();
    let sandbox2 = new ProxySandbox();
    
    window.a = 1;
    
    ((window) => {
        window.a = 'hello';
        console.log(window.a); // hello
    })(sandbox1.proxy);
    
    ((window) => {
        window.a = 'world';
        console.log(window.a); // world
    })(sandbox2.proxy);
    
    console.log(window.a); // 1
    ```
