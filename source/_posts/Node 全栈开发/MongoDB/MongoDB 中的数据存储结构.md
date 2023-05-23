---
title: MongoDB 中的数据存储结构
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: e2777285
date: 2022-01-14 09:31:24
---
## 由于 MongoDB 是文档型数据库，其中存储的数据就是熟悉的 JSON 格式数据
1. 可以把 MongoDB 数据库想象为一个超级大对象；
2. 对象里面有不同的集合；
3. 集合中有不同的文档；

## 示例代码
```JSON
{
  // 数据库 Database
  "京东": {
    // 集合 Collection，对应关系型数据库中的 Table
    "用户": [
      // 文档 Document，对应关系型数据库中的 Row
      {
        // 数据字段 Field，对应关系数据库中的 Column
        "id": 1,
        "username": "张三",
        "password": "123"
      },
      {
        "id": 2,
        "username": "李四",
        "password": "456"
      }
      // ...
    ],
    "商品": [
      {
        "id": 1,
        "name": "iPhone Pro Max",
        "price": 100
      },
      {
        "id": 2,
        "name": "iPad Pro",
        "price": 80
      }
    ],
    "订单": []
    // ...
  },

  // 数据库
  "淘宝": {}
  // ...
}
```