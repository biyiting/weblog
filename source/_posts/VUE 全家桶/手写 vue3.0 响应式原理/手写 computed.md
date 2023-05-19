---
title: 手写 computed
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: 50558f61
date: 2021-12-17 16:49:34
---

## 手写 computed
>这里采用简单粗暴的方式，直接返回一个  effect
```JS
export function computed (getter) {
  const result = ref()

  // getter() 访问响应式对象属性，去收集依赖，并返回结果值赋值给 result.value
  effect(() => (result.value = getter()))

  return result
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
    import { reactive, effect, computed } from './reactivity/index.js'
    const product = reactive({
      name: 'iPhone',
      price: 5000,
      count: 3
    })

    let total = computed(() => {
      return product.price * product.count
    })
    
    console.log(total.value)

    product.price = 4000
    console.log(total.value)

    product.count = 1
    console.log(total.value)
  </script>
</body>
</html>
```