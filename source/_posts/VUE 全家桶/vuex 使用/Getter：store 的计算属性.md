---
title: Getter：store 的计算属性
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: faf71f36
date: 2022-10-01 20:18:35
---

>像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算

## 定义 Getters
```JS
// store
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    // 第一个参数： state，第二个参数： 其他 getters
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    // 返回一个函数
    getTodoById: (state, getters) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})
```

## 获得 Getter

### 通过「属性」访问
>会暴露为 store.getters 对象
```JS
export default {
  // ...
  method: {
    xxx() {
      return this.$store.getters.doneTodos;
    }
  }
}
```
### 通过「方法」访问
>通过让 getter 返回一个函数，来实现给 getter 传参
```JS
export default {
  // ...
  method: {
    xxx() {
      return this.store.getters.getTodoById(2);
    }
  }
}
```
### 通过「mapGetters 辅助函数」访问
>将 store 中的 getter 映射到局部计算属性
```JS
import { mapGetters } from 'vuex'
export default {
  // ...
  computed: {
    // mapGetters 作用：返回一个对象
    ...mapGetters({
      doneCount: 'doneTodosCount'
    })

    // getters 的子节点名称相同，可一使用数组
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
    ]),
  }
}
```