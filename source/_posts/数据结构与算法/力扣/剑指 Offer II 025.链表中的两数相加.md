---
title: 剑指 Offer II 025.链表中的两数相加
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 链表
  - 迭代
abbrlink: 1b80a3e
date: 2023-05-30 10:34:15
---

## [链表中的两数相加](https://leetcode.cn/problems/lMSNwu/)

## 解题思路：
1. 迭代两个链表的值放入两个栈中；
2. 利用两个栈计算每一位的值，判断是否进位；
3. 利用头插法构建链表；

## 复杂度：
1. 时间复杂度：O(max(m,n))，其中 m 和 n 分别为两个链表的长度，需要遍历两个链表的全部位置，而处理每个位置只需要 O(1) 的时间；
2. 空间复杂度：O(m + n)，其中 m 和 n 分别为两个链表的长度，空间复杂度主要取决于把链表内容放入栈中所用的空间；

## 代码实现：
```TS
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  let stack1: Array<number> = [];
  let stack2: Array<number> = [];

  // 将两个链表的值放入两个栈中
  while (l1 !== null) {
    stack1.push(l1.val);
    l1 = l1.next;
  }
  while (l2 !== null) {
    stack2.push(l2.val);
    l2 = l2.next;
  }

  let curr = null;
  let addOne = 0;
  while (addOne || stack1.length || stack2.length) {
    let val1 = stack1.length ? stack1.pop() : 0;
    let val2 = stack2.length ? stack2.pop() : 0;

    let sum = val1 + val2 + addOne;
    sum >= 10 ? addOne = 1 : addOne = 0;

    // 头插法构建链表
    let currNode = new ListNode(sum % 10, curr);
    curr = currNode;
  }

  return curr;
};
```
