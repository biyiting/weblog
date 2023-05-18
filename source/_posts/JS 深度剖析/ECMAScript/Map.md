---
title: Map
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: abe0ec5b
date: 2023-01-31 12:20:32
---

## Map 类似于对象，也是键值对的集合：
1. "键" 的范围不限于字符串，各种类型的值（包括对象）都可以当作键；
2. Map 也实现了iterator 接口，所以可使用「扩展运算符」和「for…of…」进行遍历；
	
## Map 的属性和方法：
|属性和方法|描述|
|-----|-----|
|size 	|返回 Map 的元素个数|
|set 	|增加一个新元素，返回当前 Map|
|get 	|返回键名对象的键值|
|has 	|检测 Map 中是否包含某个元素，返回 boolean 值|
|clear 	|清空集合，返回 undefined|


## 示例代码
```JS
// 创建一个非空 map
let m2 = new Map([
  ['name', 'ws'],
  ['slogon', '…']
]);

// 获取 m2
console.log(m2); // {"name" => "ws", "slogon" => "…"}

// 使用扩展运算符
console.log([...m2]); // [["name", "ws"], ["slogon", "…"]]

// 获取映射元素的个数
console.log(m2.size); // 2 

// 添加映射值
console.log(m2.set('age', 6));

//获取映射值
console.log(m2.get('age')); // 6

//检测是否有该映射
console.log(m2.has('age')); // true

//清除
console.log(m2.clear());
```

