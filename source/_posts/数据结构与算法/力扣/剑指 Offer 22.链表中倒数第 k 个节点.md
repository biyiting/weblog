---
title: 剑指 Offer 22.链表中倒数第 k 个节点
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 链表
  - 双指针
abbrlink: 1c9c196c
date: 2023-05-30 10:46:46
---

## [链表中倒数第k个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/description/)

## 解题思路：
1. 初始化快慢指针 fast、slow；
2. fast 先向后移动 k 个位置，然后 fast 和 slow 再一起向后移动；
3. 当 fast 走到最后的时候，slow 的位置就是倒数第 k 个位置；

## 复杂度：
1. 时间复杂度：O(N)，N 为链表长度；
2. 空间复杂度：O(1)；

## 代码实现：
```TS
function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let slow = head;
  let fast = head;

  while (k-- > 0) fast = fast.next;

  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  return slow;
};
```
