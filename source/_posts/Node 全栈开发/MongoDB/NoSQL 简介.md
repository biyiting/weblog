---
title: NoSQL 简介
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: 1d91af6e
date: 2022-01-13 17:13:24
---

## 关系型数据库遇到的问题
1. 2008 年左右，网站、论坛、社交网络开始高速发展，传统的关系型数据库在存储及处理数据的时候受到了很大的挑战 ，其中主要体现在以下几点：
    - 难以应付每秒上万次的高并发数据写入；
    - 查询上亿量级数据的速度极其缓慢；
    - 分库、分表形成的子库到达一定规模后难以进一步扩展；
    - 分库、分表 的规则可能会因为需求变更而发生变更；
    - 修改表结构困难；
2. 在很多 互联网应用场景下，对数据联表的查询需求不是那么强烈，也并不需要在数据写入后立刻读取，但对数据的读取和并发写入速度有非常高的要求，在这样的情况下，非关系型数据库得到高速的发展；

## 什么是 NoSQL 数据库？
1. MongoDB 就是这样一款非关系型的数据库，什么叫非关系型？就是把数据直接放进一个大仓库，不标号、不连线、单纯的堆起来；传统数据库由于受到各种关系的累赘，各种数据形式的束缚，难以处理海量数据以及超高并发的业务场景；
2. 为了解决上述问题，必须有一款自废武功，以求在更高层次上突破瓶颈的数据库系统，摈弃了固有模式的 MongoDB 才能应对 Facebook 上亿比特的海量数据；
3. NoSQL(NoSQL = Not Only SQL )，意即"不仅仅是SQL"；
4. 在现代的计算系统上每天网络上都会产生庞大的数据量，这些数据有很大一部分是由关系数据库管理系统（RDBMS）来处理；
5. NoSQL 是一项全新的数据库革命性运动，早期就有人提出，发展至 2009 年趋势越发高涨，NoSQL 的拥护者们提倡运用非关系型的数据存储，相对于铺天盖地的关系型数据库运用，这一概念无疑是一种全新的思维的注入；

## NoSQL 数据库有哪些特点？
1. 可弹性扩展；
2. BASE 特性；
3. 大数据量、高性能；
4. 灵活的数据模型；
5. 高可用；

## NoSQL 数据库有哪些种类？
1. 键值数据库
    - 这类数据库主要是使用数据结构中的键 Key 来查找特定的数据 Value，优点：在存储时不采用任何模式，因此极易添加数据；
    - 这类数据库具有极高的读写性能，用于处理大量数据的高访问负载比较合适；
    - 键值对数据库适合大量数据的高访问及写入负载场景，例如日志系统；
    - 主要代表是 Redis、Flare；
2. 文档型数据库
    - 这类数据库满足了海量数据的存储和访问需求，同时对字段要求不严格，可以随意增加、删除、修改字段，且不需要预先定义表结构，所以适用于各种网络应用；
    - 主要代表是 MongoDB、CouchDB；
3. 列存储型数据库
    - 主要代表是 Cassandra 、Hbase；
    - 这类数据库查找速度快，可扩展性强，适合用作分布式文件存储系统；
4. 图数据库
    - 主要代表是 InfoGrid 、Neo4J；
    - 这类数据库利用“图结构”的相关算法来存储实体之间的关系信息，适合用于构建社交网络和推荐系统的关系图谱；


## NoSQL 与 RDB 该怎么选择？
1. NoSQL 并不能完全取代 关系型数据库，NoSQL 主要被用来处理大量且多元数据的存储及运算问题，在这样的特性差异下，这里提供以下几点作为判断依据：
    - 数据模型的关联性要求：NoSQL 适合模型关联性比较低的应用，如果需要多表关联，则更适合用 RDB；如果对象实体关联少，则更适合用 NoSQL 数据库，其中 MongoDB 可以支持复杂度相对高的数据结构，能够将相关联的数据以文档的方式嵌入，从而减少数据之间的关联操作；
    - 数据库的性能要求：如果数据量多切访问速度至关重要，那么使用 NoSQL 数据库可能是比较合适的，NoSQL 数据库能通过数据的分布存储大幅地提供存储性能；
    - 数据的一致性要求：NoSQL 数据库有一个缺点：其在事务处理与一致性方面无法与 RDB 相提并论；因此，NoSQL 数据库很难同时满足强一致性与高并发性，如果应用对性能有高要求，则 NoSQL 数据库只能做到数据最终一致；
    - 数据的可用性要求：考虑到数据不可用可能会造成风险，NoSQL 数据库提供了强大的数据可用性（在一些需要快速反馈信息给使用者的应用中，响应延迟也算某种程度的高可用）；
2. 一个项目并非只选择一种数据库，可以将其拆开设计，将需要 RDB 特性的放到 RDB 中管理，而其它数据放到 NoSQL 中管理；
