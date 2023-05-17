---
title: for_of
categories:
  - JS深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: 2c97714
date: 2023-01-31 14:20:32
---

>for...of 支持 break，普通对象不能被直接 for...of 遍历；

## for...of 遍历数组
```JS
const arr = [100, 200, 300, 400]

for (const item of arr) {
  console.log(item)
}
```

## for...of 遍历 set
```JS
const s = new Set(['foo', 'bar'])

for (const item of s) {
  console.log(item)
}
```

## for...of 遍历 map
```JS
const m = new Map()
m.set('foo', '123')
m.set('bar', '345')

for (const [key, value] of m) {
  console.log(key, value)
}
```