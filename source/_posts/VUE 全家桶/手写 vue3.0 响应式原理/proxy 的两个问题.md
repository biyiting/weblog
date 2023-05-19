---
title: proxy 的两个问题
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: fc3a0428
date: 2021-12-17 12:42:34
---

## 问题一： set 和 deleteProperty 中需要返回布尔类型的值；
1. 在严格模式下，如果返回 false 的话会出现 Type Error 的异常；
2. 示例代码：
    ```JS
    'use strict'
    
    const target = {
        foo: 'xxx',
        bar: 'yyy'
    }
    
    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            // return target[key]
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            // target[key] = value // 使用该种方式严格模式下会报错
            return Reflect.set(target, key, value, receiver)
        },
        deleteProperty(target, key) {
            // delete target[key] // 使用该种方式严格模式下会报错
            return Reflect.deleteProperty(target, key)
        }
    })
    
    proxy.foo = 'zzz'
    // delete proxy.foo
    ```

## 问题二：Proxy 和 Reflect 中的 receiver
1. 「Proxy 中 receiver」：Proxy 或者继承 Proxy 的对象；
2. 「Reflect 中 receiver」：如果 target 对象中设置了 getter，getter 中的 this 指向 receiver；
3. 示例代码：
    ```JS
    const obj = {
      get foo() {
        // 此时的 this 是obj
        console.log(this)
        return this.bar
      }
    }

    const proxy = new Proxy(obj, {
      get(target, key, receiver) {
        if (key === 'bar') {
          return 'value - bar'
        }
        return Reflect.get(target, key)
      }
    })

    console.log(proxy.foo)
    ```
    ```JS
    const obj = {
      get foo() {
        // 此时的 this 是代理对象 receiver
        console.log(this)
        // 'value - bar'，this.bar 会执行 proxy 的 get
        return this.bar
      }
    }

    const proxy = new Proxy(obj, {
      get(target, key, receiver) {
        if (key === 'bar') {
          return 'value - bar'
        }
        return Reflect.get(target, key, receiver)
      }
    })

    console.log(proxy.foo)
    ```