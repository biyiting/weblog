---
title: router-link 和 router-view
categories:
  - VUE 全家桶
  - 手写 vue-router
tags:
  - vue-router
abbrlink: f6a837b2
date: 2023-03-20 14:49:41
---

## router-link
```JS
export default {
  name: 'router-link',
  functional: true, // 函数式组件，函数不用 new，没有 this，没有生命周期，没有数据 data 
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String
    }
  },
  render(h, context) {
    let tag = context.tag || 'a';
    const clickHandler = () => { // 指定跳转方法
      context.parent.$router.push(context.props.to);
      // 调用 $router 中的 push 方法进行跳转
    }
    return h(tag, {
      on: {
        click: clickHandler
      },
    }, context.slots().default);
  }
}
```

## router-view
```JS
export default {
  name: 'router-view',
  functional: true,  
  render(h, context) { // h => createElement，context 是 vm 实例
    // parent：当前父组件，data：<router-view a='1' b="2"/>上的一些标识（a、b 是 data里面的）
    let { parent, data } = context; 

    // 每个 vm 实例都有 $route.matched，依次的将他赋予到对应的 router-view 上
    let { matched } = parent.$route; 

    let depth = 0; // 判断当前组件是第几层组件，eg：第一层则取 matched[1]
    // 标识路由属性，渲染<router-view/>后设置 routerView 为 true，表示渲染完成
    data.routerView = true; 

    while (parent) {
      // $vnode 是 <hello-world/> 这个自定义组件的虚拟 dom
      // _vnode 是 <hello-world/> 这个自定义组件里面的 sfc 的内容的虚拟 dom
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++; // 若存在父亲则 depth++，一直向上查找
      }
      parent = parent.$parent;
    }
    let record = matched[depth];
    if (!record) return h(); // 渲染一个空元素

    return h(record.component, data)
  }
}
```