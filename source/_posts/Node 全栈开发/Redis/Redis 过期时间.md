---
title: Redis 过期时间
categories:
  - Node 全栈开发
  - Redis
tags:
  - Redis
abbrlink: ec4b5d4c
date: 2023-01-09 17:27:58
---

## 在实际开发中经常会遇到一些有时效的数据
1. 比如限时优惠活动、缓存或验证码等，过了一定时间就需要删除这些数据；
2. 在关系数据库中一般需要额外的一个字段记录到期时间，然后定期检测删除过期数据；
3. 而在 Redis 中可以设置一个键的过期时间，到时间后 Redis 会自动删除它；


## 设置键的过期时间
1. 语法：
    ```batch
    # 以秒为单位设置 key 的过期时间，它会被自动删除
    EXPIRE key seconds
    
    # 以毫秒为单位设置 key 的过期时间
    PEXPIRE key milliseconds
    
    # 以秒为单位设置 key 的过期 unix 的时间戳
    EXPIREAT key timestamp
    
    # 以毫秒为单位设置 key 的过期 unix 时间戳
    PEXPIREAT key milliseconds-timestamp
    ```
2. 上面这 4 个命令只是单位和表现形式上的不同，但实际上 EXPIRE、PEXPIRE 以及 EXPIREAT 命令的执行最后都会使用 PEXPIREAT 来实行；
3. 比如使用 EXPIRE 来设置 KEY 的生存时间为 N 秒，那么后台是如何运行的呢：
    - 它会调用 PEXPIRE 命令把 N 秒转换为 M 毫秒；
    - 然后获取当前的 UNIX 时间单位也是毫秒；
    - 把当前 UNIX 时间加上 M 毫秒传递给 PEXPREAT；
4. 另外给键设置了过期时间，这个时间保存在一个字典里，也是键值结构，键是一个指针，指向真实的键，而值这是一个长整型的 UNIX 时间；


## 获取键的过期时间
1. 语法
    ```batch
    # 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)
    TTL key
    
    # 类似于 TTL，但它以毫秒为单位返回 key 的剩余生存时间
    PTTL key
    ```
2. 过期时间返回值说明
    |值	|说明|
    |---|---|
    |-2	|过期且已删除|
    |-1	|没有过期时间设置，即永不过期|
    |>0	|表示距离过期还有多少秒或者毫秒|


## 清除键的过期时间
1. 语法
    ```batch
    # 移除给定 key 的生存时间，转换成『持久的』
    PERSIST key
    ```
2. 注意：
    - 使用 SET 或 GETSET 命令为键赋值也会同时清除键的过期时间；
    - 其它只对键值进行操作的命令（如 INCR、LPUSH、HSET、ZREM）不会影响键的过期时间；