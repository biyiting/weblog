---
title: Mutation：提交状态
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: bfd25193
date: 2023-05-18 20:38:30
---

## Mutation 必须是同步函数
1. 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation：mutation 定义的函数相当于自定义事件；
2. 在 mutation 中混合异步调用会导致程序很难调试；
3. 例如，调用了多个包含异步回调的 mutation 来改变状态，很难知道什么时候回调和哪个先回调；

## 定义 mutation
```JS
// store
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state, payload) {
      state.count += payload.amount
    }
  }
})
```

## 提交 Mutation
1. 使用 this.$store.commit('xxx', payload) 提交；
      ```JS
      this.$store.commit('increment', { amount: 10 });
      ```
2. 使用 mapMutations 辅助函数提交：组件中的 methods 映射为 store.commit 调用；
      ```JS
      import { mapMutations } from 'vuex'
      export default {
        // ...
        methods: {
          ...mapMutations({
            add: 'increment' // 将 `this.add(amount)` 映射为 `store.commit('increment', amount)`
          }),
  
          ...mapMutations([
            'increment' // 将 `this.increment(amount)` 映射为 `store.commit('increment',amount)`
          ])
        }
      }
      ```

## 面试题

### mutation 和 action 有什么区别
1. 官方文档说：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，mutation 非常类似于事件：每个 mutation 都有一个字符串的类型(type)和一个回调函数(handler)，Action 类似于 mutation，不同在于：Action 可以包含任意异步操作，但它不能修改状态，需要提交 mutation 才能变更状态；
2. 因此，开发时，包含异步操作或者复杂业务组合时使用 action：需要直接修改状态则提交 mutation；
3. 调用 dispatch 和 commit 两个 APl 时几乎完全一样，但是定义两者时却不甚相同，mutation 的回调函数接收參数是 state 对象，action 则是与 Store 实例具有相同方法和属性的上下文 context 对象，因此一般会解构它为commit、dispatch、state 从而方便编码，另外 dispatch 会返回 Promise 实例便于处理内部异步结果；
4. 实现上 commit(type) 方法相当于调用 options.mutations\[type]\(state), dispatch(type) 方法相当于调用 options.actions\[type]\(store），这样就很容易理解两者使用上的不同了;
