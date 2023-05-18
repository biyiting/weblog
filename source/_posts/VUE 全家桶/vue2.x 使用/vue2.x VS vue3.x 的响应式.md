---
title: vue2.x VS vue3.x 的响应式
categories:
  - VUE 全家桶
  - vue2.x 使用
tags:
  - vue2
abbrlink: 5a635150
date: 2022-09-28 12:06:38
---
## Vue 2.x 响应式原理
1. [MDN - Object.defifineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
2. 浏览器兼容 IE8 以上（不兼容 IE8）
3. 如果有一个对象中多个属性需要转换 getter/setter，递归遍历所有属性；
4. 示例代码：
    ```JS
    // 模拟 Vue 中的 data 选项
    let data = {
      msg: 'hello',
      count: 10
    }
    
    // 模拟 Vue 的实例
    let vm = {}
    proxyData(data)
    
    function proxyData(data) {
      // 遍历 data 对象的所有属性
      Object.keys(data).forEach(key => {
        // 把 data 中的属性，转换成 vm 的 setter/setter
        Object.defineProperty(vm, key, {
          // 可枚举，可遍历
          enumerable: true,
          // 可配置（可以使用 delete 删除，可通过 defineProperty 修改）
          configurable: true,
          get() {
            console.log('get: ', key, data[key])
            return data[key]
          },
          set(newValue) {
            console.log('set: ', key, newValue)
            if (newValue === data[key]) {
              return
            }
    
            data[key] = newValue
            // 数据更改，更新 DOM 的值
            document.querySelector('#app').textContent = data[key]
          }
        })
      })
    }
    
    // 测试
    vm.msg = 'Hello World' // 调用 set 方法
    console.log(vm.msg)    // 调用 get 方法
    ```

## Vue 3.x 响应式原理
1. [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 
2. 直接监听对象，而非属性，则不需要遍历所有的属性；
3. ES 6中新增，IE 不支持，性能由浏览器优化；
4. 示例代码：
    ```JS
    // 模拟 Vue 中的 data 选项
    let data = {
      msg: 'hello',
      count: 0
    }
    
    // 模拟 Vue 实例
    let vm = new Proxy(data, {
      // 执行代理行为的函数
    
      // 当访问 vm 的成员会执行
      get(target, key) {
        console.log('get, key: ', key, target[key])
        return target[key]
      },
    
      // 当设置 vm 的成员会执行
      set(target, key, newValue) {
        console.log('set, key: ', key, newValue)
        if (target[key] === newValue) {
          return
        }
    
        target[key] = newValue
        document.querySelector('#app').textContent = target[key]
      }
    })
    
    // 测试
    vm.msg = 'Hello World' // 调用 set 方法
    console.log(vm.msg)    // 调用 get 方法
    ```