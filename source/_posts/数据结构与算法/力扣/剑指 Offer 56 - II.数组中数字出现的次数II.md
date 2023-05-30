---
title: 剑指 Offer 56 - II.数组中数字出现的次数II
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 位运算
abbrlink: d300dae1
date: 2023-05-30 08:34:42
---


## [传送门](https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-ii-lcof/)

## 图解：
<img src="数组中数字出现的次数II.jpg" width="600px" height="auto" class="lazy-load" title="数组中数字出现的次数II"/>

## 复杂度：
1. 时间复杂度：O(N)，其中 N 位数组 nums 的长度；遍历数组占用 O(N)，每轮中的常数个位运算操作占用 O(1)；
2. 空间复杂度：O(1)，数组 counts 长度恒为 32，占用常数大小的额外空间；

## 代码实现：
```TS
function singleNumber(nums: number[]): number {
  let res = 0;

  for (let i = 0; i < 32; i++) {
    let count = 0;

    for (let j = 0; j < nums.length; j++) {
      // 先将数右移，并求出最后一位为 1 的个数
      if ((nums[j] >> i & 1) == 1) {
        count++;
      }
    }

    // 找到某一位取余为 1 的数，并左移，为了将这一位循环结束后移至原位
    if (count % 3 != 0) {
      res = res | 1 << i;
    }
  }

  return res;
};
```