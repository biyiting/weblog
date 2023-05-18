---
title: 剖析全局 VUE 的初始化过程
categories:
  - VUE 全家桶
  - vue2.x 源码分析
tags:
  - vue
abbrlink: 4252c2c5
date: 2023-03-15 10:25:46
---

## Vue 的构造函数
```JS
// Vue 的核心的构造函数
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 对原型进行了扩展
initMixin(Vue)      // _init
stateMixin(Vue)     // $set、$delete、$watch
eventsMixin(Vue)    // $on、$emit、$off、$once
lifecycleMixin(Vue) // _update
renderMixin(Vue)    // _render、$nexTick
```

## Vue 的初始化
```TS
let uid = 0
export function initMixin(Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // 1.每个 vue 实例上都有一个唯一的属性 _uid
    vm._uid = uid++

    // 2.表示是 vue 实例
    vm._isVue = true

    // 3.选项合并策略
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
    vm._self = vm

    // 4.进行初始化操作
    initLifecycle(vm) // 组件的父子关系
    initEvents(vm)    // 组件的事件相关的
    initRender(vm)    // vm._c 创建虚拟节点
    initInjections(vm)// vue inject
    initState(vm)     // 核心  响应式数据原理
    initProvide(vm)   // vue provide

    // 5.如果有 el 就开始进行挂载，就是创建一个渲染 watcher 进行渲染组件的操作
    if (vm.$options.el) {
      vm.$mount(vm.$options.el) // 挂载流程
    }
  }
}
```

## 挂载流程
```JS
// 1.如果有 el 就开始挂载 
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}

// 2.组件的挂载
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating);
}

// 3.创建渲染 watcher 进行渲染
export function mountComponent(vm, el, hydrating) {
  vm.$el = el
  let updateComponent

  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(vm, updateComponent, noop, { // 创建渲染 Watcher
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  return vm
}
```