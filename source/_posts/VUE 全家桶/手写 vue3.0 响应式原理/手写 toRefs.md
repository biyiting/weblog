---
title: 手写 toRefs
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: cd322504
date: 2021-12-17 16:41:34
---


## 手写 toRefs
```JS
export function toRefs (proxy) {
  // 判断 proxy 是不是 reactive 创建的对象
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}
  // 若不是 reactive 创建的对象，发出警告（由于没有在 reactive 做出标识，此处先省略）

  for (const key in proxy) {
    // 将每一个属性都转成 ref 创建的对象
    ret[key] = toProxyRef(proxy, key)
  }

  return ret
}

function toProxyRef (proxy, key) {
  const r = {
    __v_isRef: true,
    get value () {
      // 会调用 proxy 中的 get，收集依赖（proxy 是 reactive 创建的对象）
      return proxy[key]
    },
    set value (newValue) {
      // 会调用 proxy 中的 set，触发更新（proxy 是 reactive 创建的对象）
      proxy[key] = newValue
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
    import { reactive, effect, toRefs } from './reactivity/index.js'
    function useProduct () {
      const product = reactive({
        name: 'iPhone',
        price: 5000,
        count: 3
      })
      
      return toRefs(product)
    }
    const { price, count } = useProduct()

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