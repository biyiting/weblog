---
title: Diff 算法
categories:
  - VUE 全家桶
  - vue2.x 源码分析
tags:
  - vue
abbrlink: b7e144d1
date: 2023-03-18 19:25:46
---

## 作用
1. Diff 是一种比较算法，比较两个虚拟 DOM 的区别，也就是比较两个对象的区别；
2. 只比较平级；
3. 同一级的变化节点，如果节点相同只是位置交换，则会复用；

## 整体流程
>当数据发生改变的时候，对应的 set 方法会执行，调用数据的 Dep.notify 通知所有的订阅者，订阅者就会通过patch 函数比较，从而给真实的 DOM 打补丁，更新相应的视图；
{% asset_img 整体流程.jpg 整体流程 %}

## 比对标签
>如果标签不一致说明是两个不同元素，在 diff 过程中会先比较标签是否一致；
```JS
// patch 关键代码

// 如果标签不一致用新的标签替换掉老的标签
if (oldVnode.tag !== vnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
}

// 如果标签一致，有可能都是文本节点，那就比较文本的内容即可
if (!oldVnode.tag) {
    if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text;
    }
}
```

## 比对属性
>当标签相同时，可以复用老的标签元素，并且进行属性的比对；
```JS
// patch 关键代码
let el = vnode.el = oldVnode.el;
updateProperties(vnode, oldVnode.data);

function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data || {};
    let el = vnode.el;
    // 比对样式
    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    // 删除多余属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key);
        }
    }
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}
```

## 比对子元素
>判断新老节点儿子的状况
```JS
var oldChildren = oldVnode.children || [];
var newChildren = vnode.children || [];

if (oldChildren.length > 0 && newChildren.length > 0) {
  // 新老都有儿子 需要比对里面的儿子
  updateChildren(_el, oldChildren, newChildren);
} else if (newChildren.length > 0) {
  // 新的有孩子，老的没孩子，直接将孩子虚拟节点转化成真实节点插入即可
  for (var i = 0; i < newChildren.length; i++) {
    var child = newChildren[i];
    _el.appendChild(createElm(child));
  }
} else if (oldChildren.length > 0) {
  // 老的有孩子，新的没孩子，直接删除老节点的孩子
  _el.innerHTML = '';
}
```

## updateChildren：对比新旧节点都有孩子节点的情况
### 优化策略-在开头和结尾新增元素（常见）
{% asset_img 新增元素.jpg 新增元素 %}
```JS
function isSameVnode(oldVnode, newVnode) {
  // 如果两个人的标签和key 一样我认为是同一个节点 虚拟节点一样我就可以复用真实节点了
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 优化向后追加逻辑
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
      // 优化向前追加逻辑
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode); // 比较孩子 
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
      parent.insertBefore(createElm(newChildren[i]), ele);
    }
  }
}
```
### 优化策略-头移尾、尾移头（常见）
{% asset_img 头移尾尾移头.jpg 头移尾尾移头 %}
```JS
// 头移动到尾部
else if (isSameVnode(oldStartVnode, newEndVnode)) {
  patch(oldStartVnode, newEndVnode);
  parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
  oldStartVnode = oldChildren[++oldStartIndex];
  newEndVnode = newChildren[--newEndIndex]
  // 尾部移动到头部
} else if (isSameVnode(oldEndVnode, newStartVnode)) {
  patch(oldEndVnode, newStartVnode);
  parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
  oldEndVnode = oldChildren[--oldEndIndex];
  newStartVnode = newChildren[++newStartIndex]
}
```
### 优化策略-暴力比对（乱序对比）
{% asset_img 乱序对比.jpg 乱序对比 %}
```JS
// 对所有的孩子元素进行编号
function makeIndexByKey(children) {
  let map = {};
  children.forEach((item, index) => {
    map[item.key] = index
  });
  return map;
}
let map = makeIndexByKey(oldChildren);

// 用新的元素去老的中进行查找，如果找到则移动，找不到则直接插入
let moveIndex = map[newStartVnode.key];
if (moveIndex == undefined) { // 老的中没有将新元素插入
  parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
} else { // 有的话做移动操作
  let moveVnode = oldChildren[moveIndex];
  oldChildren[moveIndex] = undefined;
  parent.insertBefore(moveVnode.el, oldStartVnode.el);
  patch(moveVnode, newStartVnode);
}
newStartVnode = newChildren[++newStartIndex]

// 如果有剩余则直接删除
if (oldStartIndex <= oldEndIndex) {
  for (let i = oldStartIndex; i <= oldEndIndex; i++) {
    let child = oldChildren[i];
    if (child != undefined) { // 在比对过程中，可能出现空值情况则直接跳过
      parent.removeChild(child.el)
    }
  }
}
```

## 更新操作
```JS
Vue.prototype._update = function (vnode) {
  const vm = this;
  const prevVnode = vm._vnode; // 保留上一次的 vnode
  vm._vnode = vnode;

  if (!prevVnode) {
    vm.$el = patch(vm.$el, vnode); // 通过虚拟节点渲染出真实的 dom，替换掉真实的 $el
  } else {
    vm.$el = patch(prevVnode, vnode); // 更新时做diff操作
  }
}
```
