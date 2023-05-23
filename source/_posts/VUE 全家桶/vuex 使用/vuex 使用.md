---
title: vuex 使用
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: 8a9279ce
date: 2022-10-01 19:53:35
---

## vuex 是什么
>对 vue 应用中多个组件的共享状态进行集中式的管理(读/写)；

## 状态自管理应用
1. state: 驱动应用的数据源；
2. view: 以声明方式将 state 映射到视图；
3. actions: 响应在 view 上的用户输入导致的状态变化(包含 n 个更新状态的方法)；

## 单向数据流
>当应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

<img src="单向数据流.jpg" width="auto" height="300px" class="lazy-load" title="单向数据流"/>


## 多组件共享状态的问题
1. vuex 就是用来解决这个问题：
    - 多个视图依赖于同一状态；
    - 来自不同视图的行为需要变更同一状态；
2. 以前的解决办法：
    - 将数据以及操作数据的行为都定义在父组件,将数据以及操作数据的行为传递给需要的各个子组件(有可能需要多级传递)；
    - 使用 eventBus；

## vuex 结构图
<img src="结构图.jpg" width="auto" height="400px" class="lazy-load" title="结构图"/>

## 如何使用：
1. 使用 Vue.use(Vuex) 调用插件，将其注入到 Vue 根实例中：
2. state：包含了 store 中存储的各个状态；
3. getter: 类似于 Vue 中的计算属性，根据其他 getter 或 state 计算返回值；
4. mutation: 一组方法，是改变 store 中状态的执行者，只能是同步操作；
5. action: 一组方法，其中可以包含异步操作；

## 示例代码
1. index.js
    ```JS
    import Vuex from 'vuex'
    import Vue from 'vue'
    Vue.use(Vuex)
    
    let store = new Vuex.Store({
      state: {
        // 放置的都是一些公用数据
        count: 100
      },
      mutations: {
        // 这里的函数必须都是同步函数（原则问题：异步后期不好维护）
        // 放置的都是用来改变数据的方法
        /**
         * @param {*} state 上面state中存储的值
          * @param {*} option 用户传参
          */
        changeCount(state, option) {
          state.count += option
        }
      },
      getters: {
        countType(state) {
          return state.count % 2 == 0 ? '偶数' : '奇数'
        }
      },
      actions: {
        // 放置 异步函数
        // 通过 store.dispatch(函数名,参数)触发这里的函数
        /**
         * @param {*} store 
          * @param {*} option 
          */
        asyncChangeCount(store, option) {
          setTimeout(() => {
            store.commit('changeCount', option)
          }, 1000);
        }
      },
      modules: {
        // 模块化
        qqq: {
          // state: {},
          // mutations: {},
          // getters: {},
          // actions: {}
        }
      }
    })
    export default store
    ```
2. 注入到根实例：main.js 
    ```JS
    // 引入vuex-store
    import store from './store/index';
    
    // 注入到根实例
    new Vue({
      el: '#app',
      // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
      store,
      template: '<App/>',
      components: { App }
    })
    ```


## 面试题

### 说说对 Vuex 的理解
1. Vuex 是一个专为 Vue.js 应用开发的状态管理模式+库，它采用集中式存储，管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化；
2. 期待以一种简单的"单向数据流”的方式管理应用，即「状态->视图->操作」单向循环的方式，但当应用遇到多个组件共享状态时，比如：多个视图依赖于同一状态或者来自不同视图的行为需要变更同一状态，此时单向数据流的简洁性很容易被破坏；因此，有必要把组件的共享状态抽取出来，以一个全局单例模式管理，通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，代码将会变得更结构化且易维护，这是 vuex 存在的必要性；
3. Vuex 解决状态管理的同时引入了不少概念：例如 state、mutation、 action 等，是否需要引入还需要根据应用的实际情况衡量一下：如果不打算开发大型单页应用，使用 Vuex 反而是繁琐冗余的，一个简单的 store 模式就足够了，但如果要构建一个中大型单页应用，Vuex 基本是标配；
4. 在使用过程中，有不好的体验：
    - 如果模块特别多，获取模块状态带命名空间，获取全局不带命名空间，容易混淆；
    - 配置起来很繁琐，对 ts 支持也不友好；

### 什么情况需要使用 Vuex 模块
1. 项目规模变大之后，单独一个 store 对象会过于庞大臃肿，通过模块方式可以拆分开来便于维护；
2. 可以按之前规则单独编写子模块代码，然后在主文件中通过 modules 选项组织起来；
3. 不过使用时要注意访问子模块状态时需要加上注册时模块名：store.state.模块名.xxx，但同时 getters、mutations 和 actions 又在全局空间中，使用方式和之前一样，如果要做到完全拆分，需要在子模块加上 namespace 选项，此时再访问它们就要加上命名空间前缀；
4. 很显然，模块的方式可以拆分代码，但是缺点也很明显，就是使用起来比较繁琐复杂，容易出错，而且类型系统支持很差，不能给我们带来帮助，pinia 显然在这方面有了很大改进，是时候切换过去了；


### 如何监听 vuex 状态变化
1. 两种方法：
    - watch 选项方式，可以以字符串形式监听 $store.state.xx；
    - subscribe 方式，可以调用 store.subscribe(cb),回调函数接收 mutation 对象和 state 对象，这样可以进一步判断 mutation.type 是否是期待的那个，从而进一步做后续处理；
2. 两种方法的区别：
    - watch 方式简单好用，且能获取变化前后值，首选；
    - subscribe 方法会被所有 commit 行为触发，因此还需要判断 mutation.type，用起来略繁琐，一般用于 vuex 插件中；


### 刷新后 vuex 状态丢失怎么解
1. vuex 只是在内存保存状态，刷新之后就会丢失，如果要持久化就要存起来；
2. localStorage 就很合适，提交 mutation 的时候同时存入 localStorage，store 中把值取出作为 state 的初始值即可；
3. 这里有两个问题，不是所有状态都需要持久化；如果需要保存的状态很多，编写的代码就不够优雅，每个提交的地方都要单独做保存处理；这里就可以利用 vuex 提供的 subscribe 方法做一个统一的处理，甚至可以封装一个vuex 插件以便复用；
4. 类似的插件有 vuex-persist、 vuex-persistedstate，内部的实现就是通过订阅 mutation 变化做统一处理，通过插件的选项控制哪些需要持久化；

### vuex 有什么缺点
1. vuex 利用响应式，使用起来已经相当方便快捷了，但是在使用过程中感觉模块化这一块做的过于复杂，用的时候容易出错，还要经常查看文档；
2. 比如访问 state 时要带上模块 key，内嵌模块的话会很长，不得不配合 mapState 使用，加不加 namespaced 区别也很大，getters、mutations、actions 这些默认是全局，加上之后必须用字符串类型的 path 来匹配，使用模式不统一容易出错，对 ts 的支持也不友好，在使用模块时没有代码提示；
3. 之前 Vue2 项目中用过 vuex-module-decorators 的解决方案，虽然类型支持上有所改善，但又要学一套新东西，增加了学习成本；
4. pinia 出现之后使用体验好了很多，Vue3 + pinia 会是更好的组合；