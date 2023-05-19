---
title: Module：模块化
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: f0bf31fc
date: 2023-05-18 21:03:30
---

## 为什么要使用 vuex 的模块化
1. 由于使用单一状态树 state，应用的所有状态会集中到一个比较大的对象；
2. 当应用变得非常复杂时，store 对象就有可能变得相当臃肿；

## 解决上面的问题
>为了解决以上问题，Vuex 允许将 store 分割成模块，每个模块拥有自己的 state、mutation、action、getter 甚至是嵌套子模块——从上至下进行同样方式的分割；

## 示例代码
```JS
const moduleA = {
  namespaced: true,
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  namespaced: true,
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    room: moduleA,
    user: moduleB
  }
})

store.state.room // -> moduleA 的状态
store.state.user // -> moduleB 的状态
...mapState('room', { ... }),
```

## 案例
```JS
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const rootModule = {
  state: {},
  mutations: {},
  actions: {},
  modules: {}
}

// 通过 require.context() 动态加载模块，实现 store 的状态分割
const files = require.context('./modules/', false, /\.js$/);
files.keys().forEach((key, index) => {
  let store = files(key).default;
  const moduleName = key.replace(/^\.\//, '').replace(/\.js$/, '');

  const modules = rootModule.modules || {};
  modules[moduleName] = store;
  modules[moduleName].namespaced = true;
  rootModule.modules = modules
});

const store = new Vuex.Store(rootModule);
export default store;
```