---
title: Redis 综合案例
categories:
  - Node 全栈开发
  - Redis
tags:
  - Redis
abbrlink: b623a08b
date: 2023-01-12 08:50:58
---
## Redis 课程作业
1. 众所周知，微信有几亿的用户群，某一时刻可能有几千人同时在玩漂流瓶，对于这种高并发数据量小的服务，使用 Node.js 和 Redis 绝对是一个不二的选择；
2. 第一步，当然是需要设计好与服务器交互的接口，采用 JSON 形式的 API 接口，因为 Node.js 中对 HTTP 一流的支持，以及对 JSON 的友好让我们创建 JSON API 变得格外简单；


## 打捞一个漂流瓶
1. 设定：以 GET 加参数的形式访问服务器打捞一个漂流瓶，返回 JSON 数据：
    ```JSON
    // GET /?user=xxx[&type=xxx]
    
    // 成功返回
    {
      "code": 1,
      "msg": {
        "time": "xxx",
        "owner": "xxx",
        "type": "xxx",
        "content": "xxx"
      }
    }
    
    // 失败返回
    {
      "code": 0,
      "msg": "xxx"
    }
    ```
2. GET请求的参数如下：
    - user：捡漂流瓶的人的用户名或用户id，必须唯一；
    - type：漂流瓶类型，这里设置三种类型：all代表全部，male代表男性，female代表女性，默认时为all；
3. 返回的JSON参数含义如下：
    - code：标识码，1代表成功，0代表出错；
    - msg：返回的信息，错误时返回错误的信息，成功时返回漂流瓶的信息；
    - time：漂流瓶扔出的时间戳；
    - owner：漂流瓶主人，可以是用户名或用户id，但必须仅有一个；
    - type：漂流瓶类型，为male或female之一；
    - content：漂流瓶内容；


## 扔出一个漂流瓶
1. 以 POST 形式请求服务器扔出一个漂流瓶，返回 JSON 数据：
    ```JSON
    // POST owner=xxx&type=xxx&content=xxx[&time=xxx]
    
    // 成功
    {
      "code": 1,
      "msg": "xxx"
    }
    
    // 失败
    {
      "code": "xxx",
      "msg": "xxx"
    }
    ```
2. POST 请求的参数如下：
    - time：漂流瓶扔出的时间戳，默认时设置为Date.now（）；
    - owner：漂流瓶主人，可以是用户名或用户id，但必须仅有一个；
    - type：漂流瓶类型，为male或female之一；
    - content：漂流瓶内容；
3. 返回的 JSON 参数含义如下：
    - code：标识码，0代表错误，1代表正确；
    - msg：返回正确或错误时的信息；


## 代码实现
1. 项目初始化
    ```BASH
    mkdir drift-bottle 
    cd drift-bottle 
    npm init -y 
    npm i express ioredis uuidv4 
    ```
2. 路由：
    ```JS
    const { uuid } = require('uuidv4');
    const Redis = require('ioredis');
    const express = require('express');
    
    const app = express();
    app.use(express.json());
    
    // 创建 Redis 实例
    const redis = new Redis();
    
    // 扔一个漂流瓶
    app.post('/', (req, res, next) => {
      try {
        res.send('post /');
      } catch (error) {
        next(error);
      }
    });
    
    // 捡一个漂流瓶
    app.get('/', (req, res, next) => {
      try {
        res.send('get /');
      } catch (error) {
        next(error);
      }
    });
    
    // 统一处理异常
    app.use((err, req, res, next) => {
      res.status(500).json({
        error: err.message,
      });
    });
    
    app.listen(3000, () => {
      console.log('runnning');
    });
    ```
3. 扔一个漂流瓶
    ```JS
    // 扔一个漂流瓶
    app.post('/', async (req, res, next) => {
      try {
        const bottle = req.body;
    
        // 设置时间戳
        bottle.time = bottle.time || Date.now();
    
        // 为每个漂流瓶随机生成一个不重复的id
        const bottleId = uuid();
        const type = {
          male: 0,
          female: 1,
        };
    
        await redis
          .pipeline()
          // 根据类型切换数据库
          .select(type[bottle.type])
          // 将数据存为 Hash
          .hmset(bottleId, bottle)
          // 设置 1 天有效期
          .expire(bottleId, 24 * 60 * 60)
          .exec();
    
        res.status(201).json({
          bottle: {
            id: bottleId,
            ...bottle,
          },
        });
      } catch (error) {
        next(error);
      }
    });
    ```
4. 捡一个漂流瓶
    ```JS
    // 捡一个漂流瓶
    app.get('/', async (req, res, next) => {
      try {
        const query = req.query;
        const type = {
          all: Math.round(Math.random()),
          male: 0,
          female: 1,
        };
    
        query.type = query.type || 'all';
    
        // 根据类型切换数据库
        await redis.select(type[query.type]);
    
        // 随机获取一个 key
        const bottleId = await redis.randomkey();
    
        if (!bottleId) {
          res.status(200).json({
            message: '大海很干净...',
          });
        }
    
        // 根据漂流瓶 id 获取完整的漂流瓶信息
        const bottle = await redis.hgetall(bottleId);
        res.status(201).json({
          bottle,
        });
    
        // 从 Redis 中删除捡到的漂流瓶
        redis.del(bottleId);
      } catch (error) {
        next(error);
      }
    });
    ```

## 接口测试
1. 扔一个漂流瓶
    <img src="扔一个漂流瓶.jpg" width="600px" height="auto" class="lazy-load" title="扔一个漂流瓶"/>
2. 捡一个漂流瓶
    <img src="捡一个漂流瓶.jpg" width="600px" height="auto" class="lazy-load" title="捡一个漂流瓶"/>