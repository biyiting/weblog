---
title: 手写 effect 和 trace
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: 98c06703
date: 2021-12-17 14:49:34
---

## 收集依赖
{% asset_img 收集依赖.jpg 收集依赖 %}
1. effect：副作用，创建用于管理  effect ，将  effect  用于依赖收集，执行一次该  effect ，进入  get  捕获阶段，捕获完毕之后移出该 effect；
2. trace
    - effect 执行后数据触发 get 捕获器, 在此过程中调用 track 进行依赖收集；
    - 定义 targetMap ，以 WeakMap 的方式收集依赖，管理目标对象 target 及其对应的 key；
    - 第二层用于管理 key 及其对应的 effect ，上面图示可以看到数据的结构和层次划分；

## 手写 effect 和 trace
```JS
let activeEffect = null

export function effect (callback) {
  activeEffect = callback
  callback() // 访问响应式对象属性，去收集依赖
  activeEffect = null
}

let targetMap = new WeakMap()

// track 收集依赖
export function track (target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 没有 target 对应的 depsMap，则 new Map 加入到 targetMap 中
    targetMap.set(target, (depsMap = new Map()))
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    // 没有 key 对应的 dep，则 new Set 加入到 depsMap 中
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(activeEffect)
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