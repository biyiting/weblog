---
title: 在 Node 中操作 MongoDB
categories:
  - Node 全栈开发
  - MongoDB
tags:
  - MongoDB
abbrlink: a9407903
date: 2022-01-14 20:25:24
---

## 连接到 MongoDB
```JS
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017");

async function run() {
  try {
    await client.connect();
    const userDb = client.db('user') // 连接数据库user
    const userCollection = userDb.collection('user') // 连接表user
    console.log("Connected successfully to server");
  } catch (e) {
    console.log('Connect failed')
  } finally {
    await client.close();
  }
}

run()
```

## 创建文档
```JS
// 插入一条数据
const userDocument = {
  name: "Neapolitan pizza",
  shape: "round",
  toppings: ["San Marzano tomatoes", "mozzarella di bufala cheese"],
};
const result = await userCollection.insertOne(userDocument);
console.dir(result.insertedCount);

// 插入多条数据
const userDocument = [
  { name: "Sicilian pizza", shape: "square", pageViews:  20 },
  { name: "New York pizza", shape: "round", pageViews: 30 },
  { name: "Grandma pizza", shape: "square", pageViews: 10 },
];
const result = await userCollection.insertMany(userDocument);
console.dir(result.insertedCount);
```

## 查询文档
```JS
const ret = await userCollection.find({ shape: 'square' })

console.log(await ret.toArray())
```

## 删除文档
```JS
const doc = { pageViews: { $gt: 10, $lt: 50 } };

// 删除符合条件的单个文档
const deleteResult = await userCollection.deleteOne(doc);
console.dir(deleteResult.deletedCount);

// 删除符合条件的多个文档
const deleteManyResult = await userCollection.deleteMany(doc);
console.dir(deleteManyResult.deletedCount);
```

## 修改文档
```JS
const filter = { shape: "round" };
const updateDocument = { $set: { name: "张三" } };

// 更新一个
const result = await userCollection.updateOne(filter, updateDocument);

// 更新多个
const result = await userCollection.updateMany(filter, updateDocument);

// 替换一个
const result = await userCollection.replaceOne(filter, { name: "李四" });
```
