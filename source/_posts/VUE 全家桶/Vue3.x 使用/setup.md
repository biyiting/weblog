---
title: setup
categories:
  - VUE 全家桶
  - Vue3.x 使用
tags:
  - vue
abbrlink: 251d5630
date: 2022-09-28 16:35:51
---

## setup
>新的 option, 所有的组合 API 函数都在此使用, 只在初始化时执行一次
>函数如果返回对象, 对象中的属性或方法, 模板中可以直接使用；
```HTML
<template>
  <div>hello</div>
  <h1>{{ number }}</h1>
</template>

<script lang="ts">
// defineComponent函数,目的是定义一个组件,内部可以传入一个配置对象
import { defineComponent } from "vue";

// defineComponent 最重要的是：在 TS 下，给予了组件正确的参数类型推断 
export default defineComponent({
  // 当前组件的名字是 App
  name: "App",
  // 测试代码 setup 是组合 API 中第一个要使用的函数
  setup() {
    const number = 10;
    return {
      number,
    };
  },
});
</script>
```

## setup 执行的时机
1. 在解析完 props、beforeCreate 之前执行(一次), 此时组件对象还没有创建（此时没有this）；
2. this 是 undefined, 不能通过 this 来访问 data/computed/methods/props，其实所有的 composition API 相关回调函数中也都不可以；

## setup 的返回值
1. 一般都返回一个对象: 为模板提供数据, 也就是模板中可以直接使用此对象中的所有属性/方法；
    - 返回对象中的属性会与 data 函数返回对象的属性合并成为组件对象的属性；
    - 返回对象中的方法会与 methods 中的方法合并成功组件对象的方法；
    - 如果有重名, setup 优先；
2. 注意:
    - 一般不要混合使用: methods 中可以访问 setup 提供的属性和方法, 但在 setup 方法中不能访问 data 和 methods；
    - setup 不能是一个 async 函数: 因为返回值不再是 return 的对象, 而是 promise, 模板获取不到 return 对象中的属性数据；


## setup 的参数
>setup(props, context) / setup(props, {attrs, slots, emit})
1. props: 和 vue2 中的 props 作用一样；
2. attrs: 包含没有在 props 配置中声明的属性的对象, 相当于 this.$attrs；
3. slots: 包含所有传入的插槽内容的对象, 相当于 this.$slots；
4. emit: 用来分发自定义事件的函数, 相当于 this.$emit；