---
title: 剑指 Offer 18.删除链表的节点
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 链表
  - 双指针
  - 迭代
  - 递归
abbrlink: 82b88d87
date: 2023-05-30 10:46:47
---

## [删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/description/)

## 双指针+虚拟头节点+迭代
1. 解题思路：
    - 初始化一个 dmy 虚拟节点的 next 指向 head，初始化 prev 和 curr 两个节点，prev 指向 dmy，curr 指向 dmy.next 也就是 head；
    - 判断 curr 的值是否等于 val，等于 val 则直接 prev.next = curr.next 删除 curr 节点，直接跳出；
    - 最后返回结果 dmy.next；
2. 复杂度：
    - 时间复杂度：O(n)；
    - 空间复杂度：O(1)；
3. 代码实现：
    ```TS
    function deleteNode(head: ListNode | null, val: number): ListNode | null {
      // 因为 head 有可能是要删除的元素，所以借助虚拟来删除
      let dmy = new ListNode(0, head);
      let prev = dmy;
      let curr = head;

      while (curr !== null) {
        if (curr.val === val) {
          prev.next = curr.next;
          break;
        }
        prev = curr;
        curr = curr.next;
      }

      return dmy.next;
    };
    ```


## 虚拟节点+迭代
1. 解题思路：
    - 初始化一个哨兵节点（虚拟节点）dmy，然后指向 head，初始化 curr 节点指向 dmy；
    - 每次向后移动 curr，判断 curr.next 的值是否等于 val，相等则删除 curr.next 节点；
    - 最后返回结果 dmy.next；
2. 复杂度：
    - 时间复杂度：O(n)；
    - 空间复杂度：O(1)；
3. 代码实现：
    ```TS
    function deleteNode(head: ListNode | null, val: number): ListNode | null {
      let dmy = new ListNode(0, head);
      let curr = dmy;

      while (curr && curr.next !== null) {
        if (curr.next.val === val) {
          curr.next = curr.next.next;
          break;
        }
        curr = curr.next;
      }

      return dmy.next;
    };
    ```

## 递归
1. 复杂度：
    - 时间复杂度：O(n)；
    - 空间复杂度：O(n)；
2. 代码实现：
    ```TS
    function deleteNode(head: ListNode | null, val: number): ListNode | null {
      // 递归的终止条件：head 等于空的时候，直接返回 head，因为一个空的链表是没法删除的
      if (head === null) return head;

      // head 结点的值等于 val，直接返回 head 结点的下一个结点，相当于删除了当前节点
      if (head.val === val) return head.next;

      // 递归调用判断下一个节点是否等于 val
      head.next = deleteNode(head.next, val);

      return head;
    };
    ```

