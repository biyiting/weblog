---
title: 在 Node 中操作 Redis
categories:
  - Node 全栈开发
  - Redis
tags:
  - Redis
abbrlink: 123a450
date: 2023-01-12 06:50:58
---
## Node.js 中可以操作 Redis 的软件包推荐：
1. node-redis；
2. ioredis；

## 以 ioredis 为例
1. ioredis 功能强大的 Redis 客户端，已被世界上最大的在线商务公司阿里巴巴和许多其他了不起的公司所使用；
2. ioredis 特点：
	- 功能齐全，它支持集群，前哨，流，流水线，当然还支持 Lua 脚本和发布/订阅（具有二进制消息的支持）；
	- 高性能；
	- 令人愉快的 API，它的异步 API 支持回调函数与 Promise；
	- 命令参数和返回值的转换；
	- 透明键前缀；
	- Lua 脚本的抽象，允许定义自定义命令；
	- 支持二进制数据；
	- 支持 TLS；
	- 支持脱机队列和就绪检查；
	- 支持 ES6 类型，例如 Map 和 Set；
	- 支持 GEO 命令（Redis 3.2不稳定）；
	- 复杂的错误处理策略；
	- 支持 NAT 映射；
	- 支持自动流水线；

## 基本使用
```JS
const Redis = require("ioredis");
const redis = new Redis(); // 建立连接

redis.set("foo", "bar");

// 回调函数
redis.get("foo", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // "bar"
  }
});

// Promise
redis.get("foo").then(function (result) {
  console.log(result); // "bar"
});

redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");

redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((res) => console.log(res));

redis.set("key", 100, "EX", 10);
```

## Pipelining 管道
1. 如果要发送一批命令，则可以使用流水线将命令在内存中排队，然后将它们一次全部发送到 Redis，这样，性能提高了 50％〜300％；
2. redis.pipeline() 创建一个 Pipeline 实例，可以像 Redis 实例一样在其上调用任何 Redis 命令，这些命令在内存中排队，并通过调用 exec 方法刷新到 Redis：
    ```JS
    // 流水线管道
    const pipeline = redis.pipeline();
    
    // 第一种方式：
    redis
      .pipeline()
      .set("foo", "bar")
      .del("cc")
      .exec((err, results) => {});
    
    // 第二种方式：
    const promise = redis.pipeline().set("foo", "bar").get("foo").exec();
    promise.then((result) => {}).catch((error) => {});
    ```
3. 每个链接的命令还可以具有一个回调，该回调将在命令得到答复时被调用：
    ```JS
    redis
      .pipeline()
      .set("foo", "bar")
      .get("foo", (err, result) => {
        // result === 'bar'
      })
      .exec((err, result) => {
        // result[1][1] === 'bar'
      });
    ```
4. 除了将命令分别添加到管道队列之外，还可以将命令和参数数组传递给构造函数：
    ```JS
    redis
      .pipeline([
        ["set", "foo", "bar"],
        ["get", "foo"],
      ])
      .exec(() => {
        /* ... */
      });
    ```
5. #length 属性显示管道中有多少个命令：
    ```JS
    const length = redis.pipeline().set("foo", "bar").get("foo").length;
    // length === 2
    ```


## multi 事务
1. 大多数时候，事务命令 multi 与管道一起使用，因此在调用 multi 时，默认情况下会自动创建 Pipeline 实例，因此可以像使用管道一样使用 multi：
    ```JS
    redis
      .multi()
      .set("foo", "bar")
      .get("foo")
      .exec((err, results) => {
        // results === [[null, 'OK'], [null, 'bar']]
      });
    ```
2. 如果事务的命令链中存在语法错误（例如，错误的参数数量，错误的命令名称等），则不会执行任何命令，并返回错误：
    ```JS
    redis
      .multi()
      .set("foo")
      .set("foo", "new value")
      .exec((err, results) => {
        // err:
        //  { [ReplyError: EXECABORT Transaction discarded because of previous errors.]
        //    name: 'ReplyError',
        //    message: 'EXECABORT Transaction discarded because of previous errors.',
        //    command: { name: 'exec', args: [] },
        //    previousErrors:
        //     [ { [ReplyError: ERR wrong number of arguments for 'set' command]
        //         name: 'ReplyError',
        //         message: 'ERR wrong number of arguments for \'set\' command',
        //         command: [Object] } ] }
      });
    ```
3. 就接口而言，multi 与管道的区别在于，当为每个链接的命令指定回调时，排队状态 将传递给回调，而不是命令的结果：
    ```JS
    redis
      .multi()
      .set("foo", "bar", (err, result) => {
        // result === 'QUEUED'
      })
      .exec( /* ... */ );
    ```
4. 如果要使用不带管道的事务，请将 { pipeline: false } 传递给 multi，每个命令将立即发送到 Redis，而无需等待 exec 调用（不建议）：
    ```JS
    redis.multi({ pipeline: false });
    redis.set("foo", "bar");
    redis.get("foo");
    redis.exec((err, result) => {
      // result === [[null, 'OK'], [null, 'bar']]
    });
    ```
5. multi 的构造函数还可以接受一批命令：
    ```JS
    redis
      .multi([
        ["set", "foo", "bar"],
        ["get", "foo"],
      ])
      .exec(() => {
        /* ... */
      });
    ```
6. 管道支持内联事务，这意味着可以将管道中的命令子集 分组为一个事务：
    ```JS
    redis
      .pipeline()
      .get("foo")
      .multi()
      .set("foo", "bar")
      .get("foo")
      .exec()
      .get("foo")
      .exec();
    ```

## 错误处理
1. Redis 服务器返回的所有错误都是 ReplyError 的实例，可以通过 Redis 进行访问：
    ```JS
    const Redis = require("ioredis");
    const redis = new Redis();
    
    // This command causes a reply error since the SET command requires two arguments.
    // 没有错误的堆栈信息
    redis.set("foo", (err) => {
      err instanceof Redis.ReplyError;
    });
    ```
2. 默认情况下，错误堆栈没有任何意义，因为整个堆栈都发生在 ioredis 模块本身而不是代码中；因此，要找出错误在代码中的位置并不容易，ioredis 提供了一个选项 showFriendlyErrorStack 来解决该问题，启用 showFriendlyErrorStack 时，ioredis 将为您优化错误堆栈：
    ```JS
    const Redis = require("ioredis");
    
    const redis = new Redis({ showFriendlyErrorStack: true });
    
    redis.set("foo");
    ```
3. 输出将是：
    ```JS
    (node:75056) UnhandledPromiseRejectionWarning: ReplyError: ERR wrong number of arguments for 'set' command
      at Object.<anonymous> (/Users/wushuai/Desktop/ioredis-demo/index.js:7:7)
      at Module._compile (internal/modules/cjs/loader.js:1158:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1178:10)
      at Module.load (internal/modules/cjs/loader.js:1002:32)
      at Function.Module._load (internal/modules/cjs/loader.js:901:14)
      at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:74:12)
      at internal/main/run_main_module.js:18:47
    (node:75056) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
    (node:75056) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
    ```
4. 错误堆栈会大大降低性能，因此，默认情况下，此选项是禁用的，只能用于调试目的，不建议在生产环境中使用此功能；