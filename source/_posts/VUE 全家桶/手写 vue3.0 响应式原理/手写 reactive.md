---
title: 手写 reactive
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: ae1ceaf1
date: 2021-12-17 14:07:34
---

## reactive
1. 接收一个参数，判断这参数是否是对象；
2. 创建拦截器对象 handler，设置 get/set/deleteProperty；
3. 返回 Proxy 对象；
	
## 手写 reactive
```JS
// 是否是 object 类型
const isObject = val => val !== null && typeof val === 'object'
// target 如果是 object，则调用 reactive 处理成响应式
const convert = target => isObject(target) ? reactive(target) : target
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)

export function reactive (target) {
  // 接收一个参数，判断这个参数是否是对象
  if (!isObject(target)) return target

  // 创建拦截器对象 handler，设置 get/set/deleteProperty
  const handler = {
    get (target, key, receiver) {
      // 收集依赖
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // 若当前 result 是对象，则递归进行 reactive 处理成响应式对象
      return convert(result)
    },

    set (target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      let result = true
      if (oldValue !== value) {
        // 若当前 value 是对象，先不处理，等到获取该对象的时候，再在 get 中处理成响应式对象
        result = Reflect.set(target, key, value, receiver)
        // 触发更新
        trigger(target, key)
      }
      return result // set 操作成功要返回 true
    },

    deleteProperty (target, key) {
      const hadKey = hasOwn(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey && result) {
        // 触发更新
        trigger(target, key)
      }
      return result // deleteProperty 操作成功要返回 true
    }
  }

  // 返回 Proxy 对象
  return new Proxy(target, handler)
}
```

## 测试
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>effect</title>
</head>
<body>
  <script type="module">
    import { reactive, effect } from './reactivity/index.js'

    const product = reactive({
      name: 'iPhone',
      price: 5000,
      count: 3
    })

    let total = 0 

    effect(() => {
      total = product.price * product.count
    })
    console.log(total)

    product.price = 4000
    console.log(total)

    product.count = 1
    console.log(total)
  </script>
</body>
</html>
```