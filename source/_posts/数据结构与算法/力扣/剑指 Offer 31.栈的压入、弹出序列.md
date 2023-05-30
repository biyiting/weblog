---
title: 剑指 Offer 31.栈的压入、弹出序列
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 栈
abbrlink: 447cc728
date: 2023-05-30 10:01:48
---

## [栈的压入、弹出序列](https://leetcode.cn/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof/)

## 解题思路：
1. 定义一个辅助栈 stack；
2. 遍历 pushed 不断将里面的元素 push 到辅助栈 stack 里面，每 push 一次就判断一下栈顶的元素是不是等于 popped 的对应索引位置的元素；
    - 如果 stack[i] === popped[i]，则 stack 栈顶元素出栈；
    - 如果 stack[i] !== popped[i]，则 stack 继续入栈；
3. 最后判断 stack 是否为空，为空说明 pushed、popped 是合法序列；

## 图解：图来自 「k神」
<img src="栈的压入、弹出序列1.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列2.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列3.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列4.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列5.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列6.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列7.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列8.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列9.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列10.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列11.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>
<img src="栈的压入、弹出序列12.jpg" width="600px" height="auto" class="lazy-load" title="栈的压入、弹出序列"/>

## 复杂度：
1. 时间复杂度：O(N)，其中 N 为列表 pushed 的长度；每个元素最多入栈与出栈一次，即最多共 2N 次出入栈操作；
2. 空间复杂度：O(N)，辅助栈 stack 最多同时存储 N 个元素；

## 代码实现：
```TS
function validateStackSequences(pushed: number[], popped: number[]): boolean {
  let stack = [];
  let inx = 0;

  for (let i = 0; i < pushed.length; i++) {
    stack.push(pushed[i]);
    while (stack.length && stack[stack.length - 1] == popped[inx]) {
      stack.pop();
      inx++;
    }
  }

  return stack.length === 0;
};
```
