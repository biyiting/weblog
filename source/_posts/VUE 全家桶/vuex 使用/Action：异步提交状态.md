---
title: Action：异步提交状态
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: 7345f9e4
date: 2023-05-18 20:48:30
---
> Action 类似于 mutation，不同在于 Action 提交的是 mutation，而不是直接变更状态，Action 可以包含任意异步操作；

## 定义 Action
```JS
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
    // 结合 promise 使用、或者 async/await 一起使用
    increment({ state, commit，getter }, params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          context.commit('increment', params)
          resolve()
        }, 1000)
      })
    },
  }
})
```


## 分发 Action
1. 使用 this.$store.dispatch('xxx', payload) 分发：
    ```JS
    this.$store.dispatch('increment', payload)
    ```
2. 使用 mapActions('命名空间',[]|{}) 辅助函数：
    ```JS
    import { mapActions } from 'vuex'
    export default {
      // ...
      methods: {
        ...mapActions({
          // 将 `this.add(amount)` 映射为 `this.$store.dispatch('increment', amount)`
          add: 'increment' 
        }),

        ...mapActions([
          // 将 `this.increment(amount)` 映射为`store.dispatch('increment', amount)`
          'increment'
        ])
      }
    }
    ```