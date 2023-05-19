---
title: 手写 ref
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: 13aa4943
date: 2021-12-17 15:09:34
---

## 手写 ref
```JS
export function ref (raw) {
  // 判断 raw 是否是 ref 创建的对象，如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) {
    return
  }

  // 若当前 raw 是对象，则递归进行 reactive 处理成响应式对象
  let value = convert(raw)

  const r = {
    __v_isRef: true, // 标识该对象是 ref 创建的对象

    get value () {
      // 收集依赖
      track(r, 'value')
      return value
    },

    set value (newValue) {
      if (newValue !== value) {
        raw = newValue
        // 若当前 newValue 是对象，则递归进行 reactive 处理成响应式对象
        value = convert(raw)
        // 触发更新
        trigger(r, 'value')
      }
    }
  }

  return r
}
```

## 测试
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module">
    import { reactive, effect, ref } from './reactivity/index.js'
    const price = ref(5000)
    const count = ref(3)
    
    let total = 0 
    effect(() => {
      total = price.value * count.value
    })
    console.log(total)

    price.value = 4000
    console.log(total)

    count.value = 1
    console.log(total)
  </script>
</body>
</html>
```