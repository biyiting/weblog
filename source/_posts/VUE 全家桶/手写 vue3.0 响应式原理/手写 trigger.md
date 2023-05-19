---
title: 手写 trigger
categories:
  - VUE 全家桶
  - 手写 vue3.0 响应式原理
tags:
  - vue
abbrlink: b5438618
date: 2021-12-17 15:07:34
---

## trigger
>修改在 effect 中指定过的内容时会触发 set 捕获器，在此过程中 trigger 负责执行当前 target 下 key 对应的 effect ，完成响应式的过程；

## 手写 trigger
```JS
export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}
```