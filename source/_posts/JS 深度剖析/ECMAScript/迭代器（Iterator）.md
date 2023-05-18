---
title: 迭代器（Iterator）
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: 35dbafe4
date: 2023-01-31 16:20:32
---

## 遍历器（Iterator）
1. 它是一种接口，为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署 Iterator 接口，就可以完成遍历操作；
2. ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费（只要能用 for...of，就实现了 Iterator）；


## 原生具备 iterator 接口的数据，可用 for of 遍历
1. Array；
2. Arguments；
3. Set；
4. Map；
5. String；
6. TypedArray；
7. NodeList；


## 工作原理
1. 创建一个指针对象，指向当前数据结构的起始位置；
2. 第一次调用对象的 next 方法，指针自动指向数据结构的第一个成员；
3. 接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员；
4. 每调用 next 方法返回一个包含 value 和 done 属性的对象；

## for...of 原理
```JS
const set = new Set(['foo', 'bar', 'baz'])
const iterator = set[Symbol.iterator]()

while (true) {
  const current = iterator.next()

  // 迭代已经结束了，没必要继续了
  if (current.done) break 

  console.log(current.value)
}
// foo
// bar
// baz
```

## obj 实现 iterator 接口
```JS
// 对象实现了iterator，则可以使用 for...of 遍历
const obj = {
  store: ['foo', 'bar', 'baz'],
  [Symbol.iterator]: function () {
    let index = 0

    return {
      next: () => {
        const result = {
          value: this.store[index],
          done: index >= this.store.length
        }
        index++

        return result
      }
    }
  }
}

for (const item of obj) {
  console.log('循环体', item)
}
// 循环体 foo
// 循环体 bar
// 循环体 baz
```