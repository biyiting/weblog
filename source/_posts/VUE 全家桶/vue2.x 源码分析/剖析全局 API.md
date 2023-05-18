---
title: 剖析全局 API
categories:
  - VUE 全家桶
  - vue2.x 源码分析
tags:
  - vue
abbrlink: 3ba29a85
date: 2023-03-15 09:25:46
---

## Vue.util
>暴露的工具方法，避免使用（Vue 内部的工具方法，可能会发生变动），例如：在 Vue.router 中就使用了这个工具方法；
``` js
Vue.util = {
  warn: warn,
  extend: extend,
  mergeOptions: mergeOptions,
  defineReactive: defineReactive
};
```

## Vue.set / Vue.delete
>Vue 的缺陷：新增之前不存在的属性不会发生视图更新，修改数组索引不会发生视图更新 (解决方案就是通过 $set 方法,数组通过 splice 进行更新视图，对象则手动通知)
```JS
export function set(target: Array<any> | Object, key: any, val: any): any {
  // 如果是数组 Vue.set(array,1,100); 调用重写的 splice 方法 (这样可以更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  // 如果是对象本身的属性，则直接添加即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  const ob = (target: any).__ob__
  // 如果这个对象不是观测的对象 那就直接赋值就好了，也不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val
    return val
  }

  // 将属性定义成响应式的
  defineReactive(ob.value, key, val)

  // 手动通知视图刷新
  ob.dep.notify();
  return val
}
```
```JS
export function del(target: Array<any> | Object, key: any) {
  // 如果是数组依旧调用 splice 方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }

  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }

  // 如果本身就没有这个属性什么都不做
  if (!hasOwn(target, key)) {
    return
  }

  // 删除这个属性
  delete target[key]
  if (!ob) {
    return
  }

  // 通知更新
  ob.dep.notify()
}
```

## Vue.nextTick
>nextTick 原理就是将回调函数存入到一个队列中，最后异步的清空这个队列；
```JS
const callbacks = [] // 存放 nextTick 回调
let pending = false

function flushCallbacks() { // 让 nextTick 里的回调执行
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc
// 先采用微任务，并按照优先级优雅降级的方式实现异步刷新
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx) // 循环执行时 如果是 promise 就让这个 promise 成功
    }
  })

  if (!pending) {
    pending = true
    timerFunc() // 刷新队列
  }

  // 支持 promise 写法
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

## Vue.observable
>2.6 新增的方法，将对象进行观测，并返回观测后的对象，可以用来做全局变量，实现数据共享；
```TS
Vue.observable = <T>(obj: T): T => {
  observe(obj)
  return obj
}
```

## Vue.options
>存放全局的组件、指令、过滤器的一个对象，及拥有 _base 属性保存 Vue 的构造函数；
```JS
ASSET_TYPES.forEach(type => {
//  Vue.options.components / filters/ directives
  Vue.options[type + 's'] = Object.create(null)
})

Vue.options._base = Vue

// 融合 keep-alive
extend(Vue.options.components, builtInComponents)
```

## Vue.use
>主要的作用就是调用插件的 install 方法,并将 Vue 作为第一个参数传入，这样做的好处是可以避免编写插件时需要依赖 Vue 导致版本问题；
```TS
export function initUse(Vue: GlobalAPI) {
  // 传入 Vue，不会强依赖 Vue
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 1.如果安装过这个插件直接跳出
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // 2.获取参数并在参数中增加 Vue 的构造函数
    const args = toArray(arguments, 1)
    args.unshift(this) // 将 Vue 放入参数数组的第一位

    // 3.执行 install 方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }

    // 4.记录安装的插件
    installedPlugins.push(plugin)

    return this
  }
}
```

## Vue.mixin
```TS
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // mixin 与 全局 options 合并
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```
```TS
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

const strats = {};
// 生命周期的合并策略（合并为一个数组，并且 mixin 的钩子排前，实例钩子排后）
function mergeHook(parentVal, childValue) {
  if (childValue) {
      if (parentVal) {
          return parentVal.concat(childValue);
      } else {
          return [childValue]
      }
  } else {
      return parentVal;
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

// 组件以  孙子.__proto__ = 儿子、儿子.__proto__ = 父亲  原型链的方式继承
function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal) // res.__proto__ = parentVal
  if (childVal) {
      for (let key in childVal) {
          res[key] = childVal[key];
      }
  }
  return res;
}
strats.components = mergeAssets

export function mergeOptions(parent, child) {
  // 1.组件先将自己的 extends、mixin 的组件扩展属性与父属性合并（components 合并）
  if (!child._base) {
      if (child.extends) {
          parent = mergeOptions(parent, child.extends, vm)
      }
      if (child.mixins) {
          for (let i = 0, l = child.mixins.length; i < l; i++) {
              parent = mergeOptions(parent, child.mixins[i], vm)
          }
      }
  }

  // 2.再用之前合并后的结果，与自身的属性进行合并
  const options = {}
  for (let key in parent) {
      mergeField(key)
  }
  for (let key in child) {
      if (!parent.hasOwnProperty(key)) {
          mergeField(key);
      }
  }
  function mergeField(key) {
      if (strats[key]) {
          options[key] = strats[key](parent[key], child[key]);
      } else {
          if (typeof parent[key] == 'object' && typeof child[key] == 'object') {
              options[key] = {
                  ...parent[key],
                  ...child[key]
              }
          } else {
              options[key] = child[key];
          }
      }
  }
  return options
}
```

## Vue.extend
>可以通过传入的对象获取这个对象的构造函数，并继承 Vue 构造器，可以自己实例化并且将其挂载在任意的元素上；
```JS
Vue.extend = function (extendOptions: Object): Function {
  // ...
  const Sub = function VueComponent(options) {
    this._init(options)
  }

  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.options = mergeOptions( // 子组件的选项和 Vue.options 进行合并
    Super.options,
    extendOptions
  )

  // ...
  return Sub;
}
```

## 组件、指令、过滤器
>格式化用户传入的内容，全局组件、指令过滤器其实就是定义在 Vue.options 中，这样创建子组件时都会和 Vue.options 进行合并，所以子组件可以拿到全局的定义；
```TS
export function initAssetRegisters(Vue: GlobalAPI) {
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (id: string, definition: Function | Object): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }

        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }

        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }

        // 将指令、过滤器、组件 绑定在 Vue.options 上
        this.options[type + 's'][id] = definition;
        return definition
      }
    }
  })
}
```