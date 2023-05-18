---
title: proxy和defineProperty
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: '337107e8'
date: 2023-01-31 09:20:32
---
## proxy 基本用法
```JS
const person = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person, {
  // 监视属性读取
  get(target, property) {
    return property in target ? target[property] : 'default'
  },

  // 监视属性设置
  set(target, property, value) {
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError(`${value} is not an int`)
      }
    }
    target[property] = value
  }
})

personProxy.age = 100
personProxy.gender = true
console.log(personProxy.name) // zce
console.log(personProxy.xxx) // default
```

## proxy VS Object.defineProperty

### 优势1：Proxy 可以监视读写以外的操作
|handler 方法|	触发方式|
|------------|--------|
|get	|读取某个属性|
|set	|写入某个属性|
|has	|in 操作符|
|deleteProperty	|delete 操作符|
|getProperty	|Object.getPropertypeOf()|
|setProperty 	|Object.setPrototypeOf()|
|isExtensible 	|Object.isExtensible()|
|preventExtensions 	|Object.preventExtensions()|
|getOwnPropertyDescriptor 	|Object.getOwnPropertyDescriptor()|
|defineProperty 	|Object.defineProperty()|
|ownKeys 	|Object.keys()<br/>Object.getOwnPropertyNames()<br/> Object.getOwnPropertySymbols()|
|apply 	调用一个函数|
|construct 	用 new 调用一个函数|


### 优势2：Proxy 可以很方便的监视数组操作
```JS
const list = [];
const listProxy = new Proxy(target, {
    get(target, key, receiver) {
        // return target[key]
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        // target[key] = value // 使用该种方式严格模式下会报错
        return Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key) {
        // delete target[key] // 使用该种方式严格模式下会报错
        return Reflect.deleteProperty(target, key)
    }
})
listProxy.push(100);
```

### 优势3：Proxy 不需要侵入对象
```JS
// Object.defineProperty 方式需要递归迭代对象
const person = {}

Object.defineProperty(person, 'name', {
  get() {
    console.log('name 被访问')
    return person._name
  },
  set(value) {
    console.log('name 被设置')
    person._name = value
  }
})

Object.defineProperty(person, 'age', {
  get() {
    console.log('age 被访问')
    return person._age
  },
  set(value) {
    console.log('age 被设置')
    person._age = value
  }
})

person.name = 'jack'
// name 被设置
// name 被访问
// jack
console.log(person.name)
```
```JS
// Proxy 方式更为合理
const person2 = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person2, {
  get(target, property) {
    console.log('get', property)
    return target[property]
  },
  set(target, property, value) {
    console.log('set', property, value) 
    target[property] = value // 使用该种方式严格模式下会报错
  }
})

personProxy.name = 'jack'
// set name jack
// get name
// jack
console.log(personProxy.name)
```