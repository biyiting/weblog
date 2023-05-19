---
title: Vue3 概览
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: 8bd8ab9a
date: 2022-09-28 16:26:51
---

## 了解相关信息
1. Vue3 支持 vue2 的大多数特性；
2. 更好的支持 Typescript；

## 新增特性
1. api 层面 Vue3 新特性主要包括：
    - Composition API；
    - SFC Composition API 语法糖；
    - Teleport 传送门（瞬移组件的位置）；
    - Fragments 片段（文档碎片）；
    - Emits 选项；
    - 自定义渲染器；
    - SFC CSS 变量；
    - Suspense 异步加载组件的 loading 界面；
2. Vue3 在框架层面也有很多亮眼的改进：
    - 更快：虚拟 DOM 重写；编译器优化：静态提升、patchFlags、block 等；基于 Proxy 的响应式系统；
    - 更小：更好的摇树优化；
    - 更容易维护：TypeScript + 模块化；
    - 更容易扩展：独立的响应化模块；自定义渲染器；


## vue2.x 和 vue3.x 对比
1. 源码采用 monorepo 方式进行管理，将模块拆分到 package 目录中；
2. vue3 采用 ts 开发，增强类型检测，vue2 则采用 flow；
3. vue3 的性能优化，支持 tree-shaking，不使用就不会打包；
	
## 内部代码优化
1. vue3 劫持数据采用 proxy，vue2 劫持数据采用 defineProperty，defineProperty 有性能问题和缺陷；
2. vue3 中对模板编译进行了优化，编译时生成了 Block tree，可以对子节点的动态节点进行收集，可以减少比较，并且采用了 patchFlag 标记动态节点；
3. vue3 采用 composition Api 进行组织功能，解决反复横跳，优化复用逻辑（mixin 带来的数据来源不清晰、命名冲突等），相比 options Api 类型推断更加方便；
4. 增加了 Fragment、Teleport、Suspense 组件；

## 面试题
### Vue 3.0 的设计目标是什么？做了哪些优化？
1. Vue3 的最大设计目标是替代 Vue2，为了实现这一点，Vue3 在以下几个方面做了很大改进，如：易用性、框架性能、扩展性、可维护性、开发体验等；
2. 易用性方面主要是 API 简化，比如：
    - v-model 在 Vue3 中变成了 Vue2 中 v-model 和 sync 修饰符的结合体，用户不用区分两者不同，也不用选择困难；
    - 类似的简化还有用于渲染函数内部生成 VNode 的 h(type, props, children)，其中 props 不用考虑区分属性、特性、事件等，框架替我们判断，易用性大增；
3. 开发体验方面：
    - 新组件 Teleport 传送门、Fragments 、Suspense 等都会简化特定场景的代码编写；
    - SFC Composition API 语法糖更是极大提升开发体验；
4. 扩展性方面提升如：
    - 独立的 reactivity 模块；
    - custom renderer API 等；
5. 可维护性方面主要是：
    - Composition API，更容易编写高复用性的业务逻辑；
    - 还有对 TypeScript 支持的提升；
6. 性能方面的改进也很显著：
    - 例如编译期优化；
    - 基于 Proxy 的响应式系统；


### Composition API 和 Options API 有何不同？
1. Composition API 是一组 APl，包括：Reactivity APl、生命周期钩子、依赖注入，使用户可以通过导入函数方式编写 vue 组件，而 0ptions API 则通过声明组件选项的对象形式编写组件；
2. Composition API 最主要作用是能够简洁、高效复用逻辑，解决了过去 Options API 中 mixins 的各种缺点；
    - 另外 Composition API 具有更加敏捷的代码组织能力，很多用户喜欢 0ptions API，认为所有东西都有固定位置的选项放置代码，但是单个组件增长过大之后这反而成为限制，一个逻辑关注点分散在组件各处，形成代码碎片，维护时需要反复横跳，composition API 则可以将它们有效组织在一起；
    - 最后 Composition API 拥有更好的类型推断，对 ts 支持更友好，options API 在设计之初并未考虑类型推断因素，虽然官方为此做了很多复杂的类型体操，确保用户可以在使用 Options API、时获得类型推断，然而还是没办法用在 mixins 和 provide/inject 上；
3. Vue3 首推 Composition API，但是这会让我们在代码组织上多花点心思，因此在选择上，如果项目属于中低复杂度的场景，0ptions API 仍是一个好选择，对于那些大型，高扩展，强维护的项目上，Composition API 会获得更大收益；
