---
title: localStorage和sessionStorage
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 3749c4bb
date: 2022-09-18 14:41:13
---

## localStorage（h5 支持）
1. 特点：
    - 生命周期：持久化的本地存储，除非主动删除数据，否则数据永远不会过期；
    - 存储的信息在同一域中是共享的；
    - 当本页操作（新增、修改、删除）了 localStorage 的时候，本页面不会触发 storage 事件，但是同域下别的页面会触发 storage 事件；
    - 大小：5M（跟浏览器厂商有关系）；
    - localStorage 本质上是对字符串的读取，如果存储内容多的话，会消耗内存空间，会导致页面变卡；
    - 受同源策略的限制，不能跨域；
2. localStorage 的使用：
    ```JS
    // 保存数据：
    localStorage.setItem(key, value);
    // 读取数据：
    localStorage.getItem(key);
    // 删除单个数据：
    localStorage.removeItem(key);
    // 删除所有数据：
    localStorage.clear();
    // 得到某个索引的key：
    localStorage.key(index);
    ```
3. 缺点：
    - 无法像 Cookie 一样设置过期的时间（可以手动设置）；
    - 只能存入字符串，无法直接存对象；

## sessionStorage（h5 支持）
1. sessionStorage 和 localStorage 使用方法基本一致，唯一不同的是生命周期，一旦页面（会话）关闭，sessionStorage 将会删除数据；
2. sessionStorage 的使用：
    ```JS
    // 保存数据：
    sessionStorage.setItem(key, value);
    // 读取数据：
    sessionStorage.getItem(key);
    // 删除单个数据：
    sessionStorage.removeItem(key);
    // 删除所有数据：
    sessionStorage.clear();
    // 得到某个索引的key
    sessionStorage.key(index);
    ```

## indexedDB
1. 特点：
    - indexedDB 是一种低级的 API，用于客户端存储大量结构化数据，该 API 使用索引来实现对该数据的高性能搜索；
    - 虽然 Web Storage 对于存储较少量的数据很有用，但对于存储大量的结构化数据来说，这种方法不太方便，这是用 IndexDB 就很有用；
2. 优点：
    - 存储量理论上没有上限；
    - 所有操作都是异步的，相比 LocalStorage 同步操作性能更高，尤其是数据量较大时；
    - 原生支持存储 JS 的对象；
    - 就是一个数据库，数据库能做的它都能做；
3. 缺点：
    - 操作非常繁琐；
    - 本身有一定的门槛；

## 面试题

### 第 1 题：如何监听 localStorage 的变化
1. 使用自定义事件实现（两个界面同源），火狐会失效：
2. 实现代码：
    ```HTML
    <!-- a.html -->
    <script>
        // 重写 localStorage.setItem
        function dispatchEventStroage() {
            const signSetItem = localStorage.setItem;

            localStorage.setItem = function (key, val) {
                let setEvent = new Event('setItemEvent');
                setEvent.key = key;
                setEvent.newValue = val;
                window.dispatchEvent(setEvent);
                signSetItem.apply(this, arguments);
            }
        }
        dispatchEventStroage();

        // localStorage 的监听事件
        window.addEventListener("setItemEvent", function (e) {
            alert(e.newValue);
        });

        // 修改 localStorage 的值
        localStorage.setItem("name", "wang");
    </script>
    ```
    ```HTML
    <!-- b.html -->
    <script>
        // 当 a.html 修改 localStorage 时，该事件被触发
        window.addEventListener("storage", function (e) {
            alert(e.newValue);
        });
    </script>
    ```
