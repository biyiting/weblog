---
title: Set
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: de59633c
date: 2023-01-31 11:20:32
---

## 	Set 无序无重复集合
1. 类似数组，但成员的值都是唯一的；
2. set 集合实现了 iterator 接口，所以可使用「扩展运算符」和「for…of…」进行遍历；

## 集合的属性和方法
|属性和方法|描述|
|-----|-----|
|size 	|返回集合的元素个数|
|add 	|增加一个新元素，返回当前集合|
|delete 	|删除元素，返回 boolean 值|
|has 	|检测集合中是否包含某个元素，返回 boolean 值|
|clear 	|清空集合，返回 undefined|

## 示例代码
```JS
// 创建一个非空集合
let s1 = new Set([1, 2, 3, 1, 2, 3]);

// 返回集合的元素个数
console.log(s1.size); // 3

// 添加新元素
console.log(s1.add(4)); // Set(4) {1, 2, 3, 4}

// 删除元素
console.log(s1.delete(1)); // true

// 检测是否存在某个值
console.log(s1.has(2)); // true

// 使用扩展运算符
console.log([...s1]); // [2, 3, 4]

// 清空集合
console.log(s1.clear());
```