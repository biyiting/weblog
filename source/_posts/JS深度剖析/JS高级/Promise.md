---
title: Promise
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 54b11a0c
date: 2022-09-13 15:41:13
---

## Promise 解决了哪些问题
1. 多个异步请求并发的问题，Promise.all；
2. 解决异步请求中的回调地狱问题；
    ```js
    function ajax1() {
      return new Promise(resolve => {
        $.ajax({
          url: '/student',
          method: 'get',
          data: {
            class: 1
          },
          success: resolve
        });
      });
    }
    
    function ajax2(arr) {
      return new Promise(resolve => {
        $.ajax({
          url: '/score',
          method: 'get',
          data: {
            stuId: arr
          },
          success: resolve
        });
      });
    }
    
    function ajax3() {
      return new Promise(resolve => {
        $.ajax({
          url: '/jige',
          // ...
          success: resolve
        });
      });
    }
    
    // 第一种实现
    ajax1().then(result => {
      return ajax2(result.map(item => item.id));
    }).then(result => {
      return ajax3();
    }).then(result => {
      // ...
    });
    
    // 第二种实现
    async function handle() {
      let result = await ajax1();
      result = await ajax2(result.map(item => item.id));
      result = await ajax3();
      // 此处的 result 就是三次异步请求后获取的信息
    }
    handle();
    ```

## Promise 的使用
1. new Promise(executor 函数)；
2. executor 函数的两个参数 resolve回调 和 reject回调 的执行都是异步微任务；
3. Promise 是用来管理异步编程的，它本身不是异步的，new Promise 的时候会立即执行 executor 函数，只不过一般会在 executor 函数中处理一个异步操作；
    ```js
    let p1 = new Promise(() => {
      setTimeout(_ => console.log(1), 1000);
      console.log(2);
    });
    console.log(3);
    // 2.3.1
    ```
    {% asset_img 管理异步.jpg 管理异步 %}
4. Promise 本身有三个状态：
    - pending：初始状态，等待态；
    - fulfilled：操作成功完成（resolve执行，PromiseStatus 会从 pending -> fulfilled）；
    - rejected：操作失败（reject执行，PromiseStatu s会从 pending -> rejected）；
5. Promise 本身有一个 value 值，用来记录成功的结果或者是失败的原因；
6. 一般会在异步操作结束后，执行 resolve/reject 函数，执行这两个函数中的一个，都可以修改 Promise 的[[PromiseStatus]]、[[PromiseValue]]，一旦状态被改变，再执行 resolve、reject 就没有用了；
    ```js
    let p1 = new Promise((resolve, reject) => {
      setTimeout(_ => {
        // 一旦状态被改变，在执行resolve、reject就没有用了
        resolve('ok');
        reject('no');
      }, 1000);
    });
    ```
    {% asset_img resolve-reject.jpg resolve-reject %}

## promise 中的 then：每个 Promise 的实例都有 then 方法
1. Promise.prototype.then([resolvedFn], [rejectedFn])
    - resolvedFn：成功执行的方法；
    - rejectedFn：失败执行的方法；
2. 示例代码：
    ```js
    // new Promise 的时候先执行 executor 函数
    let p1 = new Promise((resolve, reject) => {
      setTimeout(_ => {
        let ran = Math.random();
        console.log(ran);

        if (ran < 0.5) {
          reject('NO!');
          return;
        }
  
        resolve('OK!');
      }, 1000);
    });
    
    // p1.then 基于 then 方法，存储起来两个函数（此时这两个函数还没有执行）
    // executor 中的异步操作结束，resolve/reject 控制 Promise 状态，决定执行 then 存储函数中的某一个
    p1.then(result => {
      // 成功：ok
      console.log(`成功：` + result);
    }, reason => {
      // 失败：no
      console.log(`失败：` + reason);
    });
    ```
3. 为什么很多人说「promise 是异步的」？
    ```js
    // resolve/reject 的执行，不论是否放到一个异步操作中，都需要等待 then 先执行完
    // 因为此时 then 还没有执行，没有存储 then 中的操作，resolve/reject 没办法执行 then 中对应的操作
    // 此处是一个异步操作（所以很多人说 promise 是异步的），而且是微任务操作
    let p1 = new Promise((resolve, reject) => {
      resolve(100);
    });
    
    p1.then(result => {
      console.log(`成功：` + result);
    }, reason => {
      console.log(`失败：` + reason);
    });
    console.log(3);
    // 输出：
    //   3
    //   成功：100
    ```

## promise 中的 then 链机制：then 方法结束都会返回一个新的 Promise 实例；
1. 每次执行完 promsie.then 之后返回的都是新的 promise 实例（不能返回 this，因为状态一经修改就不允许改变了，then 链的状态值有可能会变化）；
2. 如果回调返回值是 promise，则根据 promise 的状态来执行 then 的 成功/失败 回调；
    ```js
    Promise.resolve(10)
    .then(
      (result) => {
        console.log(`成功：${result}`);
        return Promise.reject(result * 10);
      },
      (reason) => console.log(`失败：${reason}`)
    )
    .then(
      (result) => console.log(`成功：${result}`),
      (reason) => console.log(`失败：${reason}`)
    );
    // 成功：10
    // 失败：100
    ```
3. 如果回调返回值是 普通值（没有写 return，普通值为 undefinde），执行下一次 then 的 成功回调函数；
    ```js
    let p1 = new Promise((resolve, reject) => resolve(100));

    let p2 = p1.then(
      (result) => {
        console.log("成功：" + result);
        return result + 100;
      },
      (reason) => {
        console.log("失败：" + reason);
        return reason - 100;
      }
    );

    let p3 = p2.then(
      (result) => {
        console.log("成功：" + result);
      },
      (reason) => {
        console.log("失败：" + reason);
      }
    );
    // 成功：100
    // 成功：200
    ```
4. 如果是代码报错的情况，一定会执行下一次 then 的失败回调函数；
    ```js
    new Promise((resolve, reject) => throw new Error("代码错误"))
    .then(
      (result) => console.log(`成功：${result}`),
      (reason) => console.log(`失败：${reason}`)
    ));
    // 失败：Error: 代码错误
    ```
5. 错误处理，如果距离自己最近的 then 没有错误处理，则向下查找；
    ```js
    Promise.reject(10)
    .then(result => {
      console.log(`成功：${result}`);
      return result * 10;
    })
    .then(null, reason => console.log(`失败：${reason}`));
    // 失败：10
    ```

## promise 中的 catch：
1. Promise.prototype.catch(fn) 等价 ===> .then(null,fn)；
2. 示例代码：
    ```js
    Promise.resolve(10).then(result => {
      console(a);//=>报错了
    }).catch(reason => {
      console.log(`失败：${reason}`);
    });

    // 等价
    Promise.resolve(10).then(result => {
      console(a);//=>报错了
    }).then(null, reason => {
      console.log(`失败：${reason}`);
    });
    ```

## then 和 catch 的区别：（使用 catch 更优）
1. 如果在 then 的第一个函数里抛出了异常，后面的 catch 能捕获到，而当前 then 的第二个函数捕获不到；
2. then 的第二个参数和 catch 捕获错误信息的时候会就近原则，如果是 promise 内部报错，reject 抛出错误后
    - then 的第二个参数和 catch 方法都存在的情况下，只有 then 的第二个参数能捕获到；
      ```js
      Promise.resolve(10).then(res => {
        console(a);// 报错了
      }).then(res => {
        console.log(`成功：${res}`);
      }, reason => {
        console.log(`失败1：${reason}`);
      }).catch(reason => {
        console.log(`失败2：${reason}`);
      });
      // 失败1：ReferenceError: a is not defined
      ```
    - 如果 then 的第二个参数不存在，则 catch 方法会捕获到；
      ```js
      Promise.resolve(10).then(result => {
        console(a);// 报错了
      }).then(res => {
        console.log(`失败1：${reason}`);
      }).catch(reason => {
        console.log(`失败2：${reason}`);
      });
      // 失败2：ReferenceError: a is not defined

      Promise.resolve(10).then(res => {
        console(a);// 报错了
      }).catch(reason => {
        console.log(`失败2：${reason}`);
      });
      // 失败2：ReferenceError: a is not defined
      ```
## promise 中其它常用方法
1. 静态方法：
    - Promise.resolve('100')：等价于 new Promise(resolve=> resolve('100'))；
    - Promise.reject('出错了')：等价于 new Promise((, reject) => reject('出错了'))；
    - Promise.all([p1, p2, p3])：
      - 只有 p1、p2、p3 的状态都变成 fulfilled，promise 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 promise 的回调函数；
      - 只要 p1、p2、p3 之中有一个被 rejected，promise 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 promise 的回调函数；
    - Promise.race([p1, p2, p3])：只要 p1、p2、p3 之中有一个实例率先改变状态，promise 的状态就跟着改变，值传递给 promise 的回调函数；
2. 实例方法：
    - Promise.then()：此方法的两个参数，分别代表当前 Promise 对象的成功和失败的回调函数；
    - Promise.catch()：当 pedding 变为 rejected 时会进入 catch，来对错误进行处理；

## 中断 promise
1. 中断 promise：利用 promise.race 实现：
    ```JS
    const wrap = promise => {
      let abort;
  
      // 实现一个 promise，之后可控制该 promsie 来控制 race
      let myP = new Promise((resolve, reject) => { abort = reject });
  
      let p = Promise.race([promise, myP]);
      p.abort = abort;
  
      return p;
    }
    
    // 接口请求
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve('ok 成功了'), 10000);
    });
    
    let p = wrap(promise);
    p.then(data => console.log(data), (err) => console.log(err))
    
    // 需求：2s 后中断请求
    setTimeout(() => p.abort('promise 超时'), 2000);
    ```
2. 中断 then 链：直接返回一个 new Promise
    ```JS
    Promise.resolve(100).then().then((data) => {
      return new Promise(() => { }) // 中断 then 链
    }).then(data => console.log(data), err => console.log(err));
    ```

## 面试题

### 第 1 题：reject 和 catch 处理上有什么不同？
1. reject 是用来抛出异常，catch 用来处理异常；
2. reject 是 Promise 的静态方法，而 catch 是 Promise 实例的方法；
3. reject 后一定会进入 then 中的第二个回调，如果 then 中没有第二个回调，则进入 catch；
4. 网络异常，会直接进入 catch 而不会进入 then 的第二个回调；

### 第 2 题
```JS
Promise.resolve(1).then((res) => {
  console.log(res)
  return 2
}).catch((err) => {
  return 3
}).then((res) => {
  console.log(res)
})

// 1
// 2

// 第一个 then 中没有异常，catch 捕获不到异常，则执行第二个 then
```

### 第 3 题
```JS
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)

// 1
// 2
// 4
// 3

// promise 构造函数是同步任务，构造器的参数 resolve/reject 是异步任务
// promise.then 也是异步任务
```

### 第 4 题
```JS
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1~', promise1)
  console.log('promise2~', promise2)
}, 2000)

// promise1 Promise {<pending>}
// promise2 Promise {<pending>}
// promise1~ Promise {<fulfilled>: 'success'}
// promise2~ Promise {<rejected>: Error: error!!!}

// promise1、promise2 都是微任务执行，此时等待返回结果，状态为 pending
// 2s 后再次输出 promise1、promise2，此时微任务执行完毕，状态更新
```
### 第 5 题
```JS
setTimeout(() => console.log(5), 0);
new Promise(resolve => {
  console.log(1);
  resolve(3);
  Promise.resolve().then(() => console.log(4))
}).then(num => {
  console.log(num)
});
console.log(2);

// 1
// 2
// 4
// 3
// 5

// promise 构造函数里面是同步代码，构造函数的 resolve/reject 是异步的
// Promise.resolve().then 也是异步，此行代码先于 resolve 回调
```
### 第 6 题
```JS
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once')
    resolve('success')
  }, 1000)
})
const start = Date.now()
promise.then((res) => {
  console.log(res, Date.now() - start)
})
promise.then((res) => {
  console.log(res, Date.now() - start)
})

// once
// success 1017
// success 1017
```
### 第 7 题
```JS
Promise.resolve()
  .then(() => {
      return new Error('error!!!')
  })
  .then((res) => {
      console.log('then: ', res)
  })
  .catch((err) => {
      console.log('catch: ', err)
  })

// then:  Error: error!!!

// return 一个 error 对象并不会抛出错误，所以不会被后续的 catch 捕获
// 改成下面这样会被捕获异常
// return Promise.reject(new Error(‘error!!!’))
// throw new Error(‘error!!!’)
```
### 第 8 题
```JS
const promise = Promise.resolve().then(() => {
  return promise
})
promise.catch(console.error)

// 嵌套执行，死循环
// TypeError: Chaining cycle detected for promise 
```
### 第 9 题
```JS
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

// 1

// .then 或者 .catch 的参数期望是函数，传入非函数则会发生值透传
//   链式调用的参数不是函数，会发生值透传
//   传入的非函数值会被忽略
```
### 第 10 题
```JS
Promise.resolve().then(function success(res) {
  throw new Error('error')
}, function fail1(e) {
  console.error('fail1: ', e)
}).catch(function fail2(e) {
  console.error('fail2: ', e)
})

// fail2:  Error: error

// 下面这样会捕获异常
//   return Promise.reject(new Error(‘error!!!’))
//   throw new Error(‘error!!!’)
```
### 第 11 题
```JS
process.nextTick(() => {
  console.log('nextTick')
})
Promise.resolve().then(() => {
  console.log('then')
})
setImmediate(() => {
  console.log('setImmediate')
})
console.log('end')

// end
// nextTick
// then
// setImmediate
```
### 第 12 题
```JS
const first = () => (new Promise((resolve, reject) => {
  console.log(3);
  let p = new Promise((resolve, reject) => {
    console.log(7);
    setTimeout(() => {
      console.log(5);
      resolve(6);
    }, 0)
    resolve(1);
  });
  resolve(2);
  p.then((arg) => {
      console.log(arg);
  });
}));
first().then((arg) => {
  console.log(arg);
});
console.log(4);

// 3
// 7
// 4
// 1
// 2
// 5
```
### 第 13 题
```JS
var p = new Promise((resolve, reject) => {
  reject(Error('The Fails!'))
})
p.catch(error => console.log(error.message))
p.catch(error => console.log(error.message))

// The Fails!
// The Fails!
```
### 第 14 题
```JS
var p = new Promise((resolve, reject) => {
  return Promise.reject(Error('The Fails!'))
})
p.catch(error => console.log(error.message))
p.catch(error => console.log(error.message))

// Error: The Fails!
```
### 第 15 题
```JS
var p = new Promise((resolve, reject) => {
  reject(Error('The Fails!'))
})
  .catch(error => console.log('catch=>' + error))
  .then(error => console.log('then=>' + error))

// catch=> Error: The Fails!
// then => undefined
```
### 第 16 题
```JS
new Promise((resolve, reject) => {
  resolve('Success!')
}).then(() => {
  throw Error('Oh noes!')
}).catch(error => {
  console.log('catch=>' + error)
  return "actually, that worked"
}).catch(error => console.log(error.message))

// catch=>Error: Oh noes!
```
### 第 17 题
```JS
Promise.resolve('Success!').then(data => {
  return data.toUpperCase()
}).then(data => {
  console.log(data)
  return data.toLowerCase()
}).then(console.log)

// SUCCESS!
// success!
```
### 第 18 题
```JS
Promise.resolve('Success!').then(() => {
  throw Error('Oh noes!')
}).catch(error => {
  return 'actually, that worked'
}).then(data => {
  throw Error('The fails!')
}).catch(error => console.log(error.message))

// The fails!
```
### 第 19 题
```JS
async function async1() {
  console.log(1);
  const result = await async2();
  console.log(3);
}
async function async2() {
  console.log(2);
}
Promise.resolve().then(() => {
  console.log(4);
});
setTimeout(() => {
  console.log(5);
});
async1();
console.log(6);

// 1
// 2
// 6
// 4
// 3
// 5
```
### 第 20 题
```JS
// 通过 promise 来实现 
function sleep(ms) {
  var temple = new Promise(
    (resolve) => {
      console.log(111); setTimeout(resolve, ms)
    });
  return temple
}
sleep(500).then(function () {
  console.log(222)
})
```
```JS
// 通过 async 封装
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function test() {
  var temple = await sleep(1000);
  console.log(1111)
  return temple
}
test();
```
```JS
// 通过 generate 来实现
function* sleep(ms) {
  yield new Promise(function (resolve, reject) {
    console.log(111);
    setTimeout(resolve, ms);
  })
}
sleep(500).next().value.then(function () { console.log(2222) })
```
### 第 21 题
```JS
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => { console.log(res) });

Promise.resolve()
  .then(() => { console.log(1) })
  .then(() => { console.log(2) })
  .then(() => { console.log(3) })
  .then(() => { console.log(5) })
  .then(() => { console.log(6) });
```