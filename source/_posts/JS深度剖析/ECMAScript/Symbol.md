---
title: Symbol
categories:
  - JS深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: eb6433cf
date: 2023-01-31 13:20:32
---

## Symbol：
1. ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值；
2. JavaScript 语言的第七种数据类型，是一种类似于字符串的数据类型；
	
## Symbol 特点：
1. Symbol 的值是唯一的，用来解决命名冲突的问题（遇到唯一性的场景时要想到 Symbol）；
2. Symbol 值不能与其他数据进行运算；
3. Symbol 定义的对象属性不能使用 for…in 循环遍历，但是可以使用 Reflect.ownKeys 来获取对象的所有键名；
	
## 示例代码
1. 使用 Symbol 为对象添加用不重复的键
    ```JS
    let s1 = Symbol('ws');
    let s2 = Symbol('ws');
    
    console.log(s1); // Symbol(ws)
    console.log(s2); // Symbol(ws)
    console.log(s1 === s2); // false
    ```
2. Symbol 模拟实现私有成员
    ```JS
    const name = Symbol()
    const person = {
      [name]: 'zce',
      say() {
        console.log(this[name])
      }
    }
    
    person.say(); // zce
    console.log(person[name]); // zce
    
    // 由于无法创建出一样的 Symbol 值，无法直接访问到 person 中的「私有」成员
    console.log(person.name); // undefined
    ```
3. Symbol 全局注册表
    ```JS
    //使用 Symbol for 定义
    let s1 = Symbol.for('ws');
    let s2 = Symbol.for('ws');
    
    console.log(s1); // Symbol(ws)
    console.log(s2); // Symbol(ws)
    console.log(s1 === s2); // true
    ```
4. Symbol 属性名获取
    ```JS
    const obj = {
      [Symbol()]: 'symbol value',
      foo: 'normal value'
    }
    console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol() ]
    ```