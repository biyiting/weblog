---
title: Reflect
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: 4139f7d5
date: 2023-01-31 10:42:32
---
## 内部封装了一系列对对象的底层操作
|handler 方法	|默认调用|
|------------|-------|
|get 	|Reflect.get()|
|set 	|Reflect.set()|
|has 	|Reflect.has()|
|deleteProperty 	|Reflect.delete()|
|getProperty 	|Reflect.getPrototypeOf()|
|setProperty 	|Reflect.setPrototypeOf()|
|isExtensible 	|Reflect.isExtensible()|
|preventExtensions |	Reflect.preventExtensions()|
|getOwnPropertyDescriptor 	|Reflect.getOwnPropertyDescriptor()|
|defineProperty 	|Reflect.defineProperty()|
|ownKeys 	|Reflect.ownKeys()|
|apply 	|Reflect.apply()|
|construct |	Reflect.construct()|


## Reflect 成员方法就是 Proxy 处理对象的默认实现
```JS
const obj = {
  name: 'zce',
  age: 18
}
// console.log('name' in obj)
console.log(Reflect.has(obj, 'name'))

// console.log(delete obj['age'])
console.log(Reflect.deleteProperty(obj, 'age'))

// console.log(Object.keys(obj))
console.log(Reflect.ownKeys(obj))
```