---
title: 剑指 Offer 58 - II.左旋转字符串
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 字符串
  - 队列
  - 取余
abbrlink: c2dbbbb2
date: 2023-05-29 17:09:42
---

## [传送门](https://leetcode.cn/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

## 取余
1. 解题思路：
    - 取余比较巧妙，从 n 开始，到 len + n；
    - 对 len 取模，当 i <= len时，整个遍历过程拿到的是n -> len 的字符，但 i > len 时，i % len 的结果等于0 到 n 的下标；
2. 复杂度：
    - 时间复杂度： O(n)；
    - 空间复杂度： O(n)；
3. 代码实现：
    ```TS
    function reverseLeftWords(s: string, n: number): string {
      let result: string = "";

      for (let i = n; i < n + s.length; i++) {
        result += s[i % s.length];
      }

      return result;
    };
    ```

## 队列
1. 解题思路：
    - 把字符串转成数组，当旋转 2 次，那么执行 2 次出队再入队，就能得到旋转后的结果；
2. 复杂度：
    - 时间复杂度： O(n)；
    - 空间复杂度： O(n)；
3. 代码实现：
    ```TS
    function reverseLeftWords(s: string, n: number): string {
      let res = s.split('');

      while (n-- > 0) {
        res.push(res.shift());
      }

      return res.join('');
    };
    ```


