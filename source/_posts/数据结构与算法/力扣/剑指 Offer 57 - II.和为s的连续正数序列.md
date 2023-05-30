---
title: 剑指 Offer 57 - II.和为s的连续正数序列
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 双指针
  - 滑动窗口
abbrlink: bd22e886
date: 2023-05-30 11:28:05
---
## [和为 s 的连续正数序列](https://leetcode.cn/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

## 解题思路：
1. 初始化窗口的边界，初始化值为 left = 1、right = 2，窗口的和为 sum = 3；
2. 当窗口的和小于 target，right 不断右移拓宽窗口的宽度，并维护窗口的值 sum += right；
3. 当窗口的和大于 target，left 不断右移收缩窗口的宽度，并维护窗口的值 sum -= left；
4. 优化点：并不需要循环遍历整个 target 长度，只需要循环 target 一半加 1 的长度；

## 复杂度：
1. 时间复杂度：由于两个指针移动均单调不减，且最多移动 target/2 次，所以时间复杂度为 O(target)；
2. 空间复杂度：O(1)；

## 代码实现：
```TS
function findContinuousSequence(target: number): number[][] {
  let res = [];
  if (target <= 2) return res;

  let left = 1;
  let right = 2;
  let sum = 3;

  while (left < right && right <= (target >> 1) + 1) {
    if (sum === target) {
      const temp = [];
      for (let k = left; k <= right; k++) {
        temp.push(k);
      }
      res.push(temp);
    }

    if (sum > target) {
      // 当窗口的和 >= target，左窗口向右收缩
      sum -= left;
      left++
    } else {
      // 当窗口的和 < target，右窗口向右拓宽
      right++;
      sum += right;
    }
  }

  return res;
};
```
