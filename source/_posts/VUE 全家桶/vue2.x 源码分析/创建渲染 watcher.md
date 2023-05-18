---
title: 创建渲染 watcher
categories:
  - VUE 全家桶
  - vue2.x 源码分析
tags:
  - vue
abbrlink: b28fe6ac
date: 2023-03-16 18:25:46
---
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

## 生成虚拟 DOM
>先调用 _render 方法生成虚拟 dom
```JS
// 调用 _render 方法生成虚拟 dom
Vue.prototype._render = function () {
  const vm = this;
  const { render } = vm.$options;
  // 模板编译的时候，将模板转化成了 render 函数
  let vnode = render.call(vm); // 去实例上 取值
  return vnode;
}
```

## 生成真实 DOM 元素
>通过 _update 方法将虚拟 dom 创建成真实的 dom
```JS
Vue.prototype._update = function (vnode) {
  const vm = this;
  vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
}
```
```JS
export function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;
        let el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling);
        parentElm.removeChild(oldVnode)
        return el;
    }
}
function createElm(vnode) {
    let { tag, children, key, data, text } = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        updateProperties(vnode);
        children.forEach(child => {
            return vnode.el.appendChild(createElm(child));
        });
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el
}
function updateProperties(vnode) {
    let newProps = vnode.data || {}; // 获取当前老节点中的属性 
    let el = vnode.el; // 当前的真实节点
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else { // 给这个元素添加属性 值就是对应的值
            el.setAttribute(key, newProps[key]);
        }
    }
}
```