---
title: State：单一状态树
categories:
  - VUE 全家桶
  - vuex 使用
tags:
  - vuex
abbrlink: 4d2c62e5
date: 2023-05-18 20:11:30
---

## 单一状态树
1. 用一个对象就包含了全部的应用层级状态，至此它便作为一个 "唯一数据源" 而存在；
2. 单一状态树能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照；

## 获得 Vuex 状态
1. store.state.count：由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态：
    ```JS
    // store
    const store = new Vuex.Store({
      state: {
        count: 0
      }
    })
    
    //  组件中
    const Counter = {
      template: `<div>{{ count }}</div>`,
      computed: {
        count() {
          return this.$store.state.count
        }
      }
    }
    ```
2. mapState 辅助函数：当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余；
    ```JS
    import { mapState } from 'vuex'
		export default {
      // ...
      computed: {
        // mapState 作用：返回一个对象
        ...mapState({
          count: state => state.count,
          countAlias: 'count', // 等同于 `state => state.count`
        }),

        // state 的子节点名称相同，可一使用数组
        ...mapState([
          'count',  // 映射 this.count 为 store.state.count
          'countAlias'  // 映射 this.countAlias 为 store.state.countAlias
        ])
      }
    }
    ```