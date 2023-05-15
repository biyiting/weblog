---
title: generator生成器
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-14 22:41:13
---
## 生成器函数
>是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同（同样可以解决回调地狱）；

## generator 说明
1. \* 的位置没有限制；
2. 生成器函数返回的结果是迭代器对象，调用迭代器对象的 next 方法可以得到 yield 语句后的值；
3. yield 相当于函数的暂停标记，每调用一次 next 方法，执行一段代码；
4. next 方法可以传递实参，作为 yield 语句的返回值；
5. 示例代码
    ```JS
    function* foo() {
      console.log('1111')
      yield 100
      console.log('2222')
      yield 200
      console.log('3333')
      yield 300
      console.log('4444')
    }

    const generator = foo()
    // 1111
    console.log(generator.next()) // {value: 100, done: false}
    // 2222
    console.log(generator.next()) // {value: 200, done: false}
    // 3333
    console.log(generator.next()) // {value: 300, done: false}
    // 4444
    console.log(generator.next()) // {value: undefined, done: true}
    ```
    ```JS
    function* read(value) {
        let a = yield 1;
        console.log(a); // 7
        let b = yield 2;
        console.log(b); // 8
        let c = yield 3;
        console.log(c); // 9
        return c;
    }
    // 除了第一次之外的 next 方法，都是把 next 中的参数传递给上一次 yield 的返回结果
    let it = read(123);
    console.log(it.next(6)); // { value: 1, done: false }，第一次 next 传递参数没有意义，执行 yield 1
    console.log(it.next(7)); // { value: 2, done: false }，把 7 赋值给 a，a 输出为 7
    console.log(it.next(8)); // { value: 3, done: false }，把 8 赋值给 b，b 输出为 8
    console.log(it.next(9)); // { value: 9, done: true } ，把 9 赋值给 c，c 输出为 9
    console.log(it.next(10));// { value: undefined, done: true }
    console.log(it.next(11));// { value: undefined, done: true }
    ```

## 应用场景
### 案例1：发号器
```js
function * createIdMaker() {
  let id = 1
  while (true) {
    yield id++
  }
}
const idMaker = createIdMaker()

console.log(idMaker.next().value) // 1
console.log(idMaker.next().value) // 2
console.log(idMaker.next().value) // 3
console.log(idMaker.next().value) // 4
```

### 案例2：使用 Generator 函数实现 iterator 方法
```js
const likeArray = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 };

likeArray[Symbol.iterator] = function () {
    let i = 0;
    return { next: () => ({ value: this[i], done: i++ === this.length }) };
}

console.log(...likeArray); // a b c d
```
```js
const likeArray = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 };

likeArray[Symbol.iterator] = function* () { // generator 函数可以生成遍历器
    let i = 0;
    while (i !== this.length) {
        console.log(this); // likeArray 对象
        yield this[i++]; // 每次都返回 { value: this[i++], done: false/true }
    }
}

console.log(...likeArray);
```

### 案例3：生成器函数实例：异步编程
```js
// name.txt 的内容 age.txt
// age.txt  的内容 10
const fs = require('fs').promises;

// 类似 async - await
function* read() { // 代码编写更像是同步的 （执行还是异步的）
    try {
        let name = yield fs.readFile('name.txt', 'utf8');
        let age = yield fs.readFile(name, 'utf8');
        return age
    } catch (error) {
        console.log(error);
    }
}

// 需要优化
let it = read();
let { value, done } = it.next(); // value 是个 promise
value.then(data => {
    let { value, done } = it.next(data);
    value.then(data => {
        let { value, done } = it.next(data);
        console.log(data);
    })
})
```
```js
// name.txt 的内容 age.txt
// age.txt  的内容 10
const fs = require('fs').promises;

function* read() { // 代码编写更像是同步的 （执行还是异步的）
    let name = yield fs.readFile('name.txt', 'utf8');
    let age = yield fs.readFile(name, 'utf8');   // async - await
    return age
}

// 优化后的代码（手写 co，异步迭代）：co 有现成的库，koa、express 的作者 tj
const co = it => {
    return new Promise((resolve, reject) => {
        // 异步迭代靠的是 回调函数
        function next(data) {
            let { value, done } = it.next(data);
            if (!done) {
                // 默认成功后会调用next方法 将结果传递到next函数中
                Promise.resolve(value).then(next, reject);
            } else {
                resolve(value);
            }
        }
        next();
    });
}

// 测试：co 会将生成器的结果转成 promise
co(read())
    .then(data => console.log(data))
    .catch(err => console.log(err))


// async + await = generator + co
// async await 替换掉了 generator 和 co，默认 async 函数执行后返回的就是一个 promise
```