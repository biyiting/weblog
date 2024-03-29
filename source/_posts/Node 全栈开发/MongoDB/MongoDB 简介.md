---
title: MongoDB 简介
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: 4bdfd500
date: 2022-01-13 17:33:24
---
## 什么是 MongoDB？
1. [官方文档](https://www.mongodb.com/)
2. MongoDB 是由 C++ 语言编写的，是一个基于分布式文件存储的开源 NoSQL 数据库系统；
3. MongoDB 是一个介于关系数据库和非关系数据库之间的产品，非关系数据库当中功能最丰富，最像关系数据库的；
4. 这会让曾经使用过关系型数据库的人比较容易上手；
5. MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成；MongoDB 文档类似于 JSON 对象；字段值可以包含其他文档，数组及文档数组；
6. MongoDB 的查询功能非常强大；
    - 不仅支持大部分关系型数据库中的单表查询，还支持范围查询、排序、聚合、MapReduce 等；
    - MongoDB 的查询语法类似于面相对象的程序语言；


## MongoDB 有哪些特点？
1. 文档型数据库（可存储复杂结构的数据）；
2. 高性能；
3. 灵活性；
4. 可扩展性；
5. 强大的查询语言；；
6. 优异的性能；
7. 高性能：支持使用嵌入数据时，减少系统I/O负担，支持子文档查询；
8. 多种查询类型支持，且支持数据聚合查询、文本检索、地址位置查询；
9. 高可用、水平扩展：支持副本集与分片；
10. 多种存储引擎：WiredTiger , In-Memory；


## MongoDB 发展历史
1. 2007年10月，MongoDB 由 10gen 团队所发展；
2. 2009年2月首度推出 1.0 版；
3. 2011年9月，发布 2.0 版本：分片、复制等功能；
4. 2015年3月，发布 3.0 版本：WiredTiger 存储引擎支持；
5. 2018年6月，发布 4.0 版本：推出 ACID 事务支持，成为第一个支持强事务的 NoSQL 数据库；
6. ……


## MongoDB 适用于哪些场景？
1. 需要处理大量的低价值数据，且对数据处理性能有较高要求：比如，对微博数据的处理就不需要太高的事务性，但是对数据的存取性能有很高的要求，这时就非常适合使用 MongoDB；
2. 需要借助缓存层来处理数据：因为 MongoDB 能高效的处理数据，所以非常适合作为缓存层来使用，将 MongoDB 作为持久化缓存层，可以避免底层存储的资源过载；
3. 需要高度的伸缩性：对关系型数据库而言，当表的大小达到一定数量级后，其性能会急剧下降，这时可以使用多台 MongoDB 服务器搭建一个集群环境，实现最大程度的扩展，且不影响性能；