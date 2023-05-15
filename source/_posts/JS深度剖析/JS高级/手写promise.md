---
title: 手写promise
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 5a8d6d78
date: 2022-09-14 16:41:13
---

## Promise 核心逻辑实现
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        this.status = PENDING; // promsie 状态，修改之后不可再修改
        this.value = undefined; // 成功之后的值
        this.reason = undefined; // 失败后的原因

        let resolve = (value) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;

          this.status = FULFILLED; // 将状态更改为成功
          this.value = value; // 保存成功之后的值
        };

        let reject = (reason) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;

          this.status = REJECTED; // 将状态更改为失败
          this.reason = reason; // 保存失败后的原因
        };

        try {
          executor(resolve, reject); // 立即执行
        } catch (error) {
          reject(error);
        }
      }

      // 每个 Promise 实例都有 then 方法
      then(successCallback, failCallback) {
        // 判断状态
        if (this.status === FULFILLED) {
          successCallback(this.value);
        }

        if (this.status === REJECTED) {
          failCallback(this.reason);
        }
      }
    }
    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    /*
      1. Promise 就是一个类 在执行这个类的时候 需要传递一个执行器进去 执行器会立即执行
      2. Promise 中有三种状态，默认 pending 状态，一旦状态修改就不可更改
      3. promise.then 不能捕获 代码错误，只能识别执行 resolve/reject 后返回的状态；
    */

    let Promise = require("./myPromise");
    let promise = new Promise((resolve, reject) => {
      // resolve('成功');
      // resolve('失败');
      throw new Error("代码错误");
    });

    promise.then(
      (data) => {
        console.log("success", data);
      },
      (err) => {
        console.log("faild", err);
      }
    );
    ```

## Promise 的 then 方法，加入异步逻辑
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        this.status = PENDING; // promsie 状态
        this.value = undefined; // 成功之后的值
        this.reason = undefined; // 失败后的原因

        this.successCallback = []; // 存放成功回调
        this.failCallback = []; // 存放失败回调

        let resolve = (value) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = FULFILLED; // 将状态更改为成功
          this.value = value; // 保存成功之后的值

          this.successCallback.forEach((fn) => fn());
        };
        let reject = (reason) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = REJECTED; // 将状态更改为失败
          this.reason = reason; // 保存失败后的原因

          this.failCallback.forEach((fn) => fn());
        };

        try {
          executor(resolve, reject); // 立即执行
        } catch (error) {
          reject(error);
        }
      }

      // 每个 Promise 实例都有 then 方法
      then(successCallback, failCallback) {
        // 判断状态
        if (this.status === FULFILLED) {
          successCallback(this.value);
        }
        if (this.status === REJECTED) {
          failCallback(this.reason);
        }

        // 处理异步的情况，将所有的 成功/失败 的回调存储起来
        if (this.status === PENDING) {
          this.successCallback.push(() => {
            // todo... 面向切面编程，可以增加额外的逻辑
            successCallback(this.value);
          });
          this.failCallback.push(() => {
            // todo... 面向切面编程，可以增加额外的逻辑
            failCallback(this.reason);
          });
        }
      }
    }
    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    let Promise = require('./myPromise');
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
          // resolve('成功');
          resolve('失败');
      }, 1000);
    })
    
    // 1. 当执行异步代码的时候，状态一直是 pending
    // 2. 发布订阅模式：如果状态是 pending，promise.then 要将成功或者失败的回调存起来，稍后调用 resolve/reject 的时候执行
    promise.then((data) => {
      console.log('success1', data);
    }, (err) => {
      console.log('faild1', err);
    })
    
    promise.then((data) => {
      console.log('success2', data);
    }, (err) => {
      console.log('faild2', err);
    })
    ```

## Promise then 的链式调用和普通值处理
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
        constructor(executor) {
            this.status = PENDING; // promsie 状态
            this.value = undefined; // 成功之后的值
            this.reason = undefined; // 失败后的原因

            this.successCallback = []; // 存放成功回调
            this.failCallback = []; // 存放失败回调

            let resolve = (value) => {
                // 如果状态不是等待 阻止程序向下执行
                if (this.status !== PENDING) return;
                this.status = FULFILLED; // 将状态更改为成功
                this.value = value; // 保存成功之后的值

                this.successCallback.forEach((fn) => fn());
            };

            let reject = (reason) => {
                // 如果状态不是等待 阻止程序向下执行
                if (this.status !== PENDING) return;
                this.status = REJECTED; // 将状态更改为失败
                this.reason = reason; // 保存失败后的原因

                this.failCallback.forEach((fn) => fn());
            };

            try {
                executor(resolve, reject); // 立即执行
            } catch (error) {
                reject(error);
            }
        }

        // 1.每次执行完 promsie.then 之后返回的都是一个新的 promise 实例
        // 2.如果回调返回值是 promise，则根据 promise 的状态来执行 then 的 成功/失败 回调；
        // 3.如果回调返回值是 普通值（没有写 return，普通值为 undefinde），执行下一次 then 的 成功回调函数；
        // 4.如果是代码报错的情况，一定会执行下一次 then 的失败回调函数；
        // 5.错误处理，如果距离自己最近的 then 没有错误处理，则向下查找
        then(successCallback, failCallback) {
            let promise2 = new Promise((resolve, reject) => {
                // 判断状态
                if (this.status === FULFILLED) {
                    let x = successCallback(this.value);
                    resolve(x);
                }
                if (this.status === REJECTED) {
                    let x = failCallback(this.reason);
                    resolve(x);
                }
                // 处理异步的情况，将所有的 成功/失败 的回调存储起来
                if (this.status === PENDING) {
                    this.successCallback.push(() => {
                        let x = successCallback(this.value);
                        resolve(x);
                    });
                    this.failCallback.push(() => {
                        let x = failCallback(this.reason);
                        resolve(x);
                    });
                }
            });
            return promise2；
        }
    }
    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    let Promise = require("./myPromise");

    // promise 返回 普通值 测试
    new Promise((resolve, reject) => resolve(100))
        .then(() => '成功')
        .then((data) => console.log(data, "********"));

    new Promise((resolve, reject) => reject(100))
        .then(() => 1, err => '失败')
        .then((data) => console.log(data, "********"));
    ```

## Promise2 的状态处理
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        this.status = PENDING; // promsie 状态
        this.value = undefined; // 成功之后的值
        this.reason = undefined; // 失败后的原因

        this.successCallback = []; // 存放成功回调
        this.failCallback = []; // 存放失败回调

        let resolve = (value) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = FULFILLED; // 将状态更改为成功
          this.value = value; // 保存成功之后的值

          this.successCallback.forEach((fn) => fn());
        };

        let reject = (reason) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = REJECTED; // 将状态更改为失败
          this.reason = reason; // 保存失败后的原因

          this.failCallback.forEach((fn) => fn());
        };

        // 此处 try catch 只能捕获同步代码错误
        try {
          executor(resolve, reject); // 立即执行
        } catch (error) {
          reject(error);
        }
      }

      // 1.每次执行完 promsie.then 之后返回的都是一个新的 promise 实例
      // 2.如果回调返回值是 promise，则根据 promise 的状态来执行 then 的 成功/失败 回调；
      // 3.如果回调返回值是 普通值（没有写 return，普通值为 undefinde），执行下一次 then 的 成功回调函数
      // 4.如果是代码报错的情况，一定会执行下一次 then 的失败回调函数；
      // 5.错误处理，如果距离自己最近的 then 没有错误处理，则向下查找
      then(successCallback, failCallback) {
        let promise2 = new Promise((resolve, reject) => {
          // 判断状态
          if (this.status === FULFILLED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = successCallback(this.value);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }
          if (this.status === REJECTED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = failCallback(this.reason);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }
          // 处理异步的情况，将所有的 成功/失败 的回调存储起来
          if (this.status === PENDING) {
            this.successCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = successCallback(this.value);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
            this.failCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = failCallback(this.reason);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
          }
        });
        return promise2;
      }
    }

    // 处理 x 是普通值/promise的情况
    function resolvePromise(promise2, x, resolve, reject) {
      console.log(promise2, x, resolve, reject);
    }

    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    let Promise = require("./myPromise");
	
    // promise 返回 promise 测试
    new Promise((resolve, reject) => resolve(100))
        .then(() => new Promise((resolve, reject) => setTimeout(() => resolve("ok"), 1000)))
        .then(
            (data) => console.log(data, "********"),
            (err) => console.log(err)
        );

    // then 捕获异步的代码异常测试
    new Promise((resolve, reject) => resolve(100))
        .then(
            (data) => throw new Error("code 错误"),
            (err) => console.log("失败")
        )
        .then(
            (data) => console.log(data, "********"),
            (err) => console.log(err)
        );
    ```

## Promise 的 resolvePromise 解析
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        this.status = PENDING; // promsie 状态
        this.value = undefined; // 成功之后的值
        this.reason = undefined; // 失败后的原因

        this.successCallback = []; // 存放成功回调
        this.failCallback = []; // 存放失败回调

        let resolve = (value) => {
          if (value instanceof Promise) {
            return value.then(resolve, reject); //递归解析resolve中的参数，直到这个值是普通值
          }

          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = FULFILLED; // 将状态更改为成功
          this.value = value; // 保存成功之后的值

          this.successCallback.forEach((fn) => fn());
        };

        let reject = (reason) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = REJECTED; // 将状态更改为失败
          this.reason = reason; // 保存失败后的原因

          this.failCallback.forEach((fn) => fn());
        };

        // 此处 try catch 只能捕获同步代码错误
        try {
          executor(resolve, reject); // 立即执行
        } catch (error) {
          reject(error);
        }
      }
      // 1.每次执行完 promsie.then 之后返回的都是新的 promise 实例
      // 2.如果回调返回值是 promise，则根据 promise 的状态来执行 then 的 成功/失败 回调；
      // 3.如果回调返回值是 普通值（没有写 return，普通值为 undefinde），执行下一次 then 的 成功回调函数
      // 4.如果是代码报错的情况，一定会执行下一次 then 的失败回调函数；
      // 5.错误处理，如果距离自己最近的 then 没有错误处理，则向下查找
      then(successCallback, failCallback) {
        // 值的穿透
        successCallback =
          typeof successCallback === "function" ? successCallback : (v) => v;
        failCallback =
          typeof failCallback === "function"
            ? failCallback
            : (err) => {
                throw err;
              };

        let promise2 = new Promise((resolve, reject) => {
          // 判断状态
          if (this.status === FULFILLED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = successCallback(this.value);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }

          if (this.status === REJECTED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = failCallback(this.reason);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }

          // 处理异步的情况，将所有的 成功/失败 的回调存储起来
          if (this.status === PENDING) {
            this.successCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = successCallback(this.value);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });

            this.failCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = failCallback(this.reason);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
          }
        });
        return promise2;
      }
    }

    // resolvePromise 要兼容所有的库的 promise
    function resolvePromise(promise2, x, resolve, reject) {
      // 1. 循环引用： 自己等待自己完成，错误的实现
      if (promise2 === x)
        return reject(
          new TypeError("Chaining cycle detected for promise #<Promise>")
        );
      // 后续代码要严格判断，保证代码能和别的库一起使用
      let called;
      if ((typeof x === "object" && x != null) || typeof x === "function") {
        // 有可能是 promise
        try {
          let then = x.then;
          if (typeof then === "function") {
            // 为 promise
            then.call(
              x,
              (y) => {
                // y 为 x(promise) 的处理结果
                if (called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject); // 递归解析
              },
              (err) => {
                if (called) return;
                called = true;
                reject(err);
              }
            );
          } else {
            // {then:'23'}
            resolve(x);
          }
        } catch (error) {
          // 防止失败了再进入成功
          if (called) return;
          called = true;
          reject(error);
        }
      } else {
        resolve(x);
      }
    }
    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    let Promise = require("./myPromise");

    // 1.多层 promise 测试（递归解析）
    let p = new Promise((resolve, reject) => resolve(100));
    let promise2 = p.then((data) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            new Promise((resolve, reject) => {
              setTimeout(() => resolve(2000), 1000);
            })
          );
        });
      }, 1000);
    });
    promise2.then(
      (data) => console.log("成功：" + data),
      (err) => console.log(err)
    );

    // 2.值的穿透测试
    let p2 = new Promise((resolve, reject) => resolve(1000));
    p2.then()
      .then()
      .then(
        (data) => console.log("成功：" + data),
        (err) => console.log(err)
      );
    ```

## promise 其他方法的实现
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        // ......
      }
      then(successCallback, failCallback) {
        // ......
      }

      catch(failCallback) {
        return this.then(null, failCallback);
      }

      static resolve(value) {
        return new Promise((resolve, reject) => resolve(value));
      }

      // 区别在于 resolve 会等待里面的 promise 执行完毕，reject 不会有等待效果
      static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
      }

      finally(callback) {
        return this.then(
          (value) => {
            // return Promise.resolve(callback())，直接这么写会把 finally 前的 value 改变
            // 执行一个 then，再把上一步的成功的 value 执行出去
            return Promise.resolve(callback()).then(() => value);
          },
          (reason) => {
            // return Promise.resolve(callback())，直接这么写会把 finally 前的 value 改变
            return Promise.resolve(callback()).then(() => {
              throw reason;
            });
          }
        );
      }

      static all(list) {
        return new Promise((resolve, reject) => {
          let values = [];
          let count = 0;
          for (let [i, p] of list.entries()) {
            // 数组参数如果不是 Promise 实例，先调用 Promise.resolve 转成 promise
            this.resolve(p).then(
              (res) => {
                values[i] = res;
                count++;
                // 所有状态都变成 fulfilled 时返回的 Promise 状态就变成 fulfilled
                if (count === list.length) resolve(values);
              },
              (err) => {
                // 有一个被 rejected 时返回的 Promise 状态就变成 rejected
                reject(err);
              }
            );
          }
        });
      }

      static race(list) {
        return new Promise((resolve, reject) => {
          for (let p of list) {
            // 只要有一个实例率先改变状态，新的 Promise 的状态就跟着改变
            // p 如果不是 Promise 实例，先调用 Promise.resolve
            this.resolve(p).then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
          }
        });
      }
    }

    module.exports = Promise;
    ```
2. catch 测试
    ```JS
    let Promise = require("./myPromise");
    new Promise(() => { throw new Error('错误') }).catch(err => console.log(err));
    ```
3. Promise.resolve 测试
    ```JS
    let Promise = require("./myPromise");
    Promise.resolve(11)
        .then(data => console.log("success：" + data), err => console.log("failed：" + err))
        .catch(err => console.log(err))
    // success：11
    Promise.resolve(new Promise((resolve, reject) => setTimeout(() => resolve('ok'), 1000)))
        .then(data => console.log(data));
    // ok
    ```
4. Promise.reject 测试
    ```JS
    let Promise = require("./myPromise");
    Promise.reject(11)
        .then(data => console.log("success：" + data), err => console.log("failed：" + err))
        .catch(err => console.log(err))
    // failed：11
    ```
5. finally 测试
    ```JS
    let Promise = require("./myPromise");
    Promise.resolve(123).finally(() => console.log('finally'))
        .then(data => console.log(data, 'success'))
        .catch(err => console.log(err, 'error'))
    // finally
    // 123 success

    Promise.reject(456).finally(() => console.log('finally'))
        .then(data => console.log(data, 'success'))
        .catch(err => console.log(err, 'error'))
    // finally
    // 456 error

    // 若 finally 返回一个成功的 promise，会等待 promise 执行完毕，并不会修改成功值
    Promise.resolve(123).finally(() => {
        console.log('finally');
        return new Promise((resolve, reject) => setTimeout(() => resolve('ok'), 3000))
    }).then(data => console.log(data, 'success'))
      .catch(err => console.log(err, 'error'));
    // finally
    // 123 success

    // 若 finally 返回一个失败的 promise，会等待 promise 执行完毕，会把失败原因传给下一个人
    Promise.resolve(123).finally(() => {
        console.log('finally');
        return new Promise((resolve, reject) => setTimeout(() => reject('ok'), 3000))
    }).then(data => console.log(data, 'success'))
      .catch(err => console.log(err, 'error'));
    // finally
    // ok error
    ```
6. Promise.all 测试
    ```JS
    let Promise = require("./myPromise");
    let p1 = new Promise((resolve, reject) => setTimeout(() => resolve('p1'), 2000));
    let p2 = new Promise((resolve, reject) => resolve('p2'));
    Promise.all(['a', 'b', p1, p2, 'c']).then(value => console.log(value));
    // [ 'a', 'b', 'p1', 'p2', 'c' ]
    ```
7. Promise.race 测试
    ```JS
    let Promise = require("./myPromise");
    let p1 = new Promise((resolve, reject) => setTimeout(() => resolve('p1'), 2000));
    let p2 = new Promise((resolve, reject) => reject('p2'));
    let p3 = new Promise((resolve, reject) => resolve('p3'));
    Promise.race([p1, p2, p3])
        .then(value => console.log('then：' + value))
        .catch(err => console.log('catch：' + err))
    // catch：p2
    ```

## 规范测试
1. 实现代码
    ```JS
    const PENDING = "pending"; // 等待
    const FULFILLED = "fulfilled"; // 成功
    const REJECTED = "rejected"; // 失败

    class Promise {
      constructor(executor) {
        this.status = PENDING; // promsie 状态
        this.value = undefined; // 成功之后的值
        this.reason = undefined; // 失败后的原因

        this.successCallback = []; // 存放成功回调
        this.failCallback = []; // 存放失败回调

        let resolve = (value) => {
          if (value instanceof MyPromise) {
            return value.then(resolve, reject); //递归解析resolve中的参数，直到这个值是普通值
          }
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = FULFILLED; // 将状态更改为成功
          this.value = value; // 保存成功之后的值
          this.successCallback.forEach((fn) => fn());
        };

        let reject = (reason) => {
          // 如果状态不是等待 阻止程序向下执行
          if (this.status !== PENDING) return;
          this.status = REJECTED; // 将状态更改为失败
          this.reason = reason; // 保存失败后的原因
          this.failCallback.forEach((fn) => fn());
        };

        // 此处 try catch 只能捕获同步代码错误
        try {
          executor(resolve, reject); // 立即执行
        } catch (error) {
          reject(error);
        }
      }

      // 1.每次执行完 promsie.then 之后返回的都是新的 promise 实例
      // 2.如果回调返回值是 promise，则根据 promise 的状态来执行 then 的 成功/失败 回调；
      // 3.如果回调返回值是 普通值（没有写 return，普通值为 undefinde），执行下一次 then 的 成功回调函数
      // 4.如果是代码报错的情况，一定会执行下一次 then 的失败回调函数；
      // 5.错误处理，如果距离自己最近的 then 没有错误处理，则向下查找
      then(successCallback, failCallback) {
        // 值的穿透
        successCallback =
          typeof successCallback === "function" ? successCallback : (v) => v;
        failCallback =
          typeof failCallback === "function"
            ? failCallback
            : (err) => {
                throw err;
              };

        let promise2 = new MyPromise((resolve, reject) => {
          // 判断状态
          if (this.status === FULFILLED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = successCallback(this.value);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }

          if (this.status === REJECTED) {
            // 若不加 setTimeout 拿不到 promise2，只有 promise全部执行完才会返回 promise2
            setTimeout(() => {
              // 此处 try catch 捕获异步的代码错误
              try {
                let x = failCallback(this.reason);
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          }

          // 处理异步的情况，将所有的 成功/失败 的回调存储起来
          if (this.status === PENDING) {
            this.successCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = successCallback(this.value);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
            this.failCallback.push(() => {
              // 此处可以不加 setTimeout，因为此处本身就是异步的，但最好是加上
              setTimeout(() => {
                // 此处 try catch 捕获异步的代码错误
                try {
                  let x = failCallback(this.reason);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
          }
        });
        return promise2;
      }
    }

    // resolvePromise 要兼容所有的库的 promise
    function resolvePromise(promise2, x, resolve, reject) {
      // 1. 循环引用： 自己等待自己完成，错误的实现
      if (promise2 === x)
        return reject(
          new TypeError("Chaining cycle detected for promise #<Promise>")
        );

      // 后续代码要严格判断，保证代码能和别的库一起使用
      let called;
      if ((typeof x === "object" && x != null) || typeof x === "function") {
        // 有可能是 promise
        try {
          let then = x.then;
          if (typeof then === "function") {
            // 为 promise
            then.call(
              x,
              (y) => {
                // y 为 x(promise) 的处理结果
                if (called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject); // 递归解析
              },
              (err) => {
                if (called) return;
                called = true;
                reject(err);
              }
            );
          } else {
            // {then:'23'}
            resolve(x);
          }
        } catch (error) {
          // 防止失败了再进入成功
          if (called) return;
          called = true;
          reject(error);
        }
      } else {
        resolve(x);
      }
    }

    Promise.defer = Promise.deferred = function () {
      let dfd = {};
      dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
      });
      return dfd;
    };

    module.exports = Promise;
    ```
2. 测试代码
    ```JS
    // 安装 promise 规范测试包
    npm install promises-aplus-tests -g
    // 执行命令 测试 promise
    promises-aplus-tests myPromise.js
    ```

## defer 的作用
1. 作用
    - deferred 对象实现了 Promise，并且将 resolve 和 reject 方法暴露在了构造函数外面，Promise 对象的状态更为灵活；状态的改变只有一次，之后的更改会忽略；
    - 示例代码
      ```JS
      let deferred = {};
      deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      setTimeout(() => deferred.resolve(1), 1000);
      deferred.promise.then((res) => console.log("ok：", res));
      // ok： 1
      ```
2. 使用场景
    - 减少代码嵌套
      ```JS
      let fs = require("fs");

      // 实现 promise 延迟对象 defer
      let Deferred = function () {
        let dfd = {};
        dfd.promise = new Promise((resolve, reject) => {
          dfd.resolve = resolve;
          dfd.reject = reject;
        });
        return dfd;
      };

      // function read() {
      //     return new Promise((resolve, reject) => {
      //         fs.readFile('./a.txt', 'utf8', (err, data) => {
      //             if (!err) resolve(data)
      //         })
      //     })
      // }

      // 减少代码嵌套
      function read() {
        let defer = Deferred();

        fs.readFile("./a.txt", "utf8", (err, data) => {
          if (!err) defer.resolve(data);
        });

        return defer.promise;
      }

      read().then((data) => console.log(data));
      ```
    - 多个地方想控制 1 个 Promise 的状态，回调只想执行 1 次
      ```JS
      let deferred = {};
      deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      // 异步操作的顺序不确定
      setTimeout(() => deferred.resolve(), 10 * Math.random());
      setTimeout(() => deferred.resolve(), 10 * Math.random());

      // 只要有 1 个异步操作完成就执行回调
      deferred.promise.then(() => console.log("ok"));
      ```
    - 多个异步之间的协作方案，多个延迟对象配合使用
      ```JS
      let Deferred = function () {
        let dfd = {};
        dfd.promise = new Promise((resolve, reject) => {
          dfd.resolve = resolve;
          dfd.reject = reject;
        });
        return dfd;
      };

      let d1 = Deferred();
      let d2 = Deferred();

      Promise.all([d1.promise, d2.promise]).then((res) => {
        console.log(res); // [ 'Fish', 'Pizza' ]
      });
      d1.resolve("Fish");
      d2.resolve("Pizza");
      ```

## 面试题

### 中断 promise
1. 方式一：中断 promise，利用 promise.race 实现
    ```js
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
2. 方式二：中断 then 链，直接返回一个 new Promise
    ```js
    Promise.resolve(100)
      .then()
      .then((data) => {
        return new Promise(() => {}); // 中断 then 链
      })
      .then(
        (data) => console.log(data),
        (err) => console.log(err)
      );
    ```