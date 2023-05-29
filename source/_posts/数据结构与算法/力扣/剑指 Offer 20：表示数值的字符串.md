---
title: 剑指 Offer 20：表示数值的字符串
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 字符串
abbrlink: b5d348d8
date: 2023-05-29 17:11:32
---

## [传送门](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/)

## 解题思路：
1. 去掉字符串的空格，并初始化 数字、小数点、e 标识符；
2. 小数点只可以出现在 e 之前，且只能出现一次，.num  num.num num.都是被允许的；
3. 判定为 e，之前没出现过 e，之前出现过数字了，e 后面必须出现数字；
4. 判定为 +/- 符号，只能出现在第一位或者紧接 e 后面；

## 复杂度：
1. 时间复杂度： O(N)，其中 N 为字符串 s 的长度；
2. 空间复杂度： O(1)，使用常数大小的额外空间；

## 代码实现：
```TS
function isNumber(s: string): boolean {
  if (s == null || s.length == 0) return false;

  //去掉首位空格
  s = s.trim();

  //是否出现数字
  let numFlag: boolean = false;
  //是否出现小数点
  let dotFlag: boolean = false;
  // 是否出现 e
  let eFlag: boolean = false;

  for (let i = 0; i < s.length; i++) {
    //判定为数字，则标记numFlag
    if (s[i] >= '0' && s[i] <= '9') {
      numFlag = true;
      //小数点只可以出现再e之前，且只能出现一次.num  num.num num.都是被允许的
    } else if (s[i] == '.' && !dotFlag && !eFlag) {
      dotFlag = true;
      //判定为e，之前没出现过e，之前出现过数字了
    } else if ((s[i] == 'e' || s[i] == 'E') && !eFlag && numFlag) {
      eFlag = true;
      //避免e以后没有出现数字
      numFlag = false;
    } else if ((s[i] == '+' || s[i] == '-') && (i == 0 || s[i - 1] == 'e' || s[i - 1] == 'E')) {
      //判定为+-符号，只能出现在第一位或者紧接e后面
      continue;
    } else {
      //其他情况，都是非法的
      return false;
    }
  }

  //是否出现了数字 
  return numFlag;
};
```
