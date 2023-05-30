---
title: 剑指 Offer 30.包含min函数的栈
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 栈
abbrlink: 11cbd9c1
date: 2023-05-30 10:01:48
---

## [包含min函数的栈](https://leetcode.cn/problems/bao-han-minhan-shu-de-zhan-lcof/)

## 解题思路：
1. 设计一个数据结构，使得每个元素与其相应的最小值  时刻保持一一对应，因此可以使用一个辅助栈，与元素栈同步插入与删除，用于存储与每个元素对应的最小值；
2. 当一个元素要入栈时，取当前辅助栈的栈顶存储的最小值，与当前元素比较得出最小值，将这个最小值插入辅助栈中；
3. 当一个元素要出栈时，把辅助栈的栈顶元素也一并弹出；
4. 在任意一个时刻，栈内元素的最小值就存储在辅助栈的栈顶元素中；

## 复杂度：
1. 时间复杂度：时间复杂度均为 O(1)；
2. 空间复杂度：O(n)，其中 n 为总操作数；最坏情况下，会连续插入 n 个元素，此时两个栈占用的空间为 O(n)；

## 代码实现：
```TS
class MinStack {
  stack: Array<number>
  minStack: Array<number>

  constructor() {
    this.stack = [];
    // 在存储数据的栈外，再新建一个栈，用于存储最小值
    this.minStack = [Infinity];
  }

  push(x: number): void {
    this.stack.push(x);
    let minNum = Math.min(this.minStack[this.minStack.length - 1], x)
    this.minStack.push(minNum);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  min(): number {
    return this.minStack[this.minStack.length - 1];
  }
}
```
```JS
var MinStack = function () {
  this.stack = [];
  // 在存储数据的栈外，再新建一个栈，用于存储最小值
  this.minStack = [Infinity];
};

MinStack.prototype.push = function (x) {
  this.stack.push(x);

  let minNum = Math.min(this.minStack[this.minStack.length - 1], x)
  this.minStack.push(minNum);
};

MinStack.prototype.pop = function () {
  this.stack.pop();
  this.minStack.pop();
};

MinStack.prototype.top = function () {
  return this.stack[this.stack.length - 1];
};

MinStack.prototype.min = function () {
  return this.minStack[this.minStack.length - 1];
};
```

