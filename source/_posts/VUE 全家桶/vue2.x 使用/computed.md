---
title: computed
categories:
  - VUE 全家桶
  - vue2.x 使用
tags:
  - vue2
abbrlink: 564c12f7
date: 2022-09-25 21:46:38
---
## 计算属性特点
1. 可以依赖其他计算属性；
2. 不仅可以依赖当前 vue 实例，还可以依赖其他实例的数据；

## 计算属性原理
1. 默认 computed 也是一个 watcher，是具备缓存的，只要依赖的属性发生改变时才会更新视图；
2. 由于计算属性会依赖当前函数同步使用的变量，这些依赖数据被 Object.defineProperty 劫持了，会给每一个依赖属性一个订阅器 Dep（也叫事件池）；
3. vue 内部执行计算属性函数的时候，通过 get 会把每一个依赖的 watcher 放入到 Dep 中；
4. 只要某个依赖属性发生改变，就会通过 set 函数通知该依赖的 Dep 事件池中所有的 watcher，则所有依赖该依赖数据的计算属性都得到了更新；

## 使用场景
1. 模板属性太重的时候使用；
2. 需要经过复杂的计算的时候使用；

## 示例代码
>表达式里面包含了 3 个操作，有时候可能会更加复杂，这时可以使用计算属性
```HTML
<template>
  <div>
    <!-- 定义的 计算属性 看起来虽然是函数，但是在控制台打印出来之后，是属性 -->
    {{ reversedMessage }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        message: '123,456'
      }
    },
    computed: {
      reversedMessage: function () {
        // 这里的 this 指向的是当前的 vue 实例
        return this.message.split(',').reverse().join(',')
      }
    }
  }
</script>
```

## 面试题
### watch 和 computed 的区别以及选择?
1. 计算属性可以从组件数据派生出新数据，最常见的使用方式是设置一个函数，返回计算之后的结果，computed 和methods 的差异是它具备缓存性，如果依赖项不变时不会重新计算；侦听器可以侦测某个响应式数据的变化并执行副作用，常见用法是传递一个函数，执行副作用，watch 没有返回值，但可以执行异步操作等复杂逻辑；
2. 计算属性常用场景是简化行内模板中的复杂表达式，模板中出现太多逻辑会是模板变得臃肿不易维护，侦听器常用场景是状态变化之后做一些额外的 DOM 操作或者异步操作，选择采用何用方案时首先看是否需要派生出新值，基本能用计算属性实现的方式首选计算属性；
3. 使用过程中有一些细节，比如计算属性也是可以传递对象，成为既可读又可写的计算属性，watch可以传递对象，设置 deep、immediate 等选项（watch 不会立即执行，设置 immediate 后会自动执行）；
4. vue3 中watch 选项发生了一些变化，例如不再能侦测一个点操作符之外的字符串形式的表达式； reactivity API中新出现了 watch、watchEffect 可以完全替代目前的 watch 选项，且功能更加强大；