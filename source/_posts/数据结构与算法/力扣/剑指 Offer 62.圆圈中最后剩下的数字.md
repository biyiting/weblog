---
title: 剑指 Offer 62.圆圈中最后剩下的数字
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 递归
abbrlink: adedb570
date: 2023-05-30 09:23:09
---

## [圆圈中最后剩下的数字](https://leetcode.cn/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/)

## 解题思路：
1. 问题转换：
    <img src="圆圈中最后剩下的数字1.jpg" width="500px" height="auto" class="lazy-load" title="圆圈中最后剩下的数字"/>

    - 从8个人开始，每次杀掉一个人，去掉被杀的人，然后把杀掉那个人之后的第一个人作为开头重新编号；
    - 第一次C被杀掉，人数变成7，D作为开头，（最终活下来的G的编号从6变成3）；
    - 第二次F被杀掉，人数变成6，G作为开头，（最终活下来的G的编号从3变成0）；
    - 第三次A被杀掉，人数变成5，B作为开头，（最终活下来的G的编号从0变成3）；
    - 以此类推，当只剩一个人时，他的编号必定为0！（重点！）；
2. 最终活着的人编号的反推：先把被杀掉的 C 补充回来，然后右移 m 个人，发现溢出了，再把溢出的补充在最前面；
    <img src="圆圈中最后剩下的数字2.jpg" width="500px" height="auto" class="lazy-load" title="圆圈中最后剩下的数字"/>

3. 递推公式：f(8,3)=[f(7,3)+3]%8
    <img src="圆圈中最后剩下的数字3.jpg" width="500px" height="auto" class="lazy-load" title="圆圈中最后剩下的数字"/>

    - 当只有一个人时，这个人必死；
    - 当人数大于 1 时，按照下面的递推公式得到最终活着的人；

## 复杂度：
1. 时间复杂度：O(n)，需要求解的函数值有 n 个；
2. 空间复杂度：O(n)，函数的递归深度为 n，需要使用  O(n) 的栈空间；O(1)，迭代的空间复杂度为 O(1)；

## 代码实现：
```TS
// 递归
function lastRemaining(n: number, m: number): number {
  function travese(n, m) {
    // 若只有 1 个人的时候，这个人就是活着的人
    if (n == 1) return 0;

    // 每次循环右移
    return (travese(n - 1, m) + m) % n;
  }

  return travese(n, m);
};
```
```TS
// 迭代
function lastRemaining(n: number, m: number): number {
  // 若只有 1 个人的时候，这个人就是活着的人
  let pos = 0;  
  // 需要 2 个人以上的时候，求出活着的人
  for (let i = 2; i <= n; i++) {
    // 每次循环右移
    pos = (pos + m) % i;
  }

  return pos;
};
```
