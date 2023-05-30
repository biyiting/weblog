---
title: 剑指 Offer 66.构建乘积数组
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 前缀和
abbrlink: f6c89aa9
date: 2023-05-30 12:52:50
---
## [构建乘积数组](https://leetcode.cn/problems/gou-jian-cheng-ji-shu-zu-lcof/)

## 解题思路：
1. 当前元素为 1，乘以 1 不影响最终结果；
2. 第一次循环得到当前下标前面的所有元素的乘积；
3. 第二次循环反向遍历得到的是当前下标后面的所有元素的乘积；

## 图解：
<img src="构建乘积数组.jpg" width="600px" height="auto" class="lazy-load" title="构建乘积数组"/>

## 复杂度：
1. 时间复杂度：O(N)，其中 N 为数组长度，两轮遍历数组 a，使用 O(N)；
2. 空间复杂度：O(1)，使用常数大小额外空间；

## 代码实现：
```TS
function constructArr(arr: number[]): number[] {
  let res = [];

  let tmp = 1;
  for (let index = 0; index < arr.length; index++) {
    res[index] = tmp;
    tmp *= arr[index];
  }

  tmp = 1;
  for (let index = arr.length - 1; index >= 0; index--) {
    res[index] *= tmp;
    tmp *= arr[index];
  }

  return res;
};
```
