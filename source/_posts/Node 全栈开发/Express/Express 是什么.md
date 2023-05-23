---
title: Express 是什么
categories:
  - Node 全栈开发
  - Express
tags:
  - express
abbrlink: d204b02b
date: 2022-01-25 10:22:02
---
## Express 是什么
1. Express 是一个快速、简单、极简的 Nodejs web 应用开发框架; 通过它可以轻松的构建各种 web 应用，例如:
    - 接口服务;
    - 传统的 web 网站; 
    - 开发工具集成等; 
    - ......
2. Express 本身是极简的，仅仅提供了 web 开发的基础功能，但是它通过中间件的方式集成了许许多多的外部插件来处理 HTTP 请求：
    - body-parser：解析 HTTP 请求体；
    - compression：压缩 HTTP 响应；
    - cookie-parser：解析 cookie 数据；
    - cors：处理跨域资源请求；
    - morgan：HTTP 请求日志记录；
    - ......

3. Express 特性：
    - 简单易学；
    - 丰富的基础 API 支持，以及常见的 HTTP 辅助程序，例如重定向、缓存等；
    - 强大的路由功能；
    - 灵活的中间件；
    - 高性能；
    - 非常稳定（它的源代码几乎百分百的测试覆盖率）；
    - 视图系统支持 14 个以上的主流模版引擎；
    - ......

4. Express 应用场景：
    - 传统的 Web 网站：
    - 接口服务；
    - 服务端渲染中间层；
    - 开发工具：
    - .......


## 基础用法
1. 通过该案例创建一个简单的 CRUD 接口服务，从而掌握 Express 的基本用法；
2. 实现对任务清单的 CRUD 接口服务：
    - 查询任务列表：get /todos；
    - 根据 ID 查询单个任务：get /todos/:id；
    - 添加任务：post /todos；
    - 修改任务：patch /todos/:id；
    - 删除任务：delete /todos/:id；
3. 示例代码
    - db.json
      ```JSON
      {
        "todos": [
          {
            "title": "吃饭",
            "id": 1
          },
          {
            "title": "睡觉",
            "id": 3
          }
        ],
        "users": []
      }
      ```
    - db.js
      ```JS
      const fs = require('fs')
      const { promisify } = require('util')
      const path = require('path')
      
      const readFile = promisify(fs.readFile)
      const writeFile = promisify(fs.writeFile)
      const dbPath = path.join(__dirname, './db.json')
      
      exports.getDb = async () => {
        const data = await readFile(dbPath, 'utf8')
        return JSON.parse(data)
      }
      
      exports.saveDb = async db => {
        const data = JSON.stringify(db, null, '  ')
        await writeFile(dbPath, data)
      }
      ```
    - app.js
      ```JS
      // express 是一个函数，调用一个函数创建一个应用
		  // 没有 ctx 对象，主要靠的是原生的 req 和 res
      const express = require('express')
      const fs = require('fs')
      const { getDb, saveDb } = require('./db')
      const app = express()
      
      // 配置解析表单请求体：application/json
      app.use(express.json())
      // 解析表单请求体：application/x-www-form-urlencoded
      app.use(express.urlencoded())
      
      app.get('/todos', async (req, res) => {
        try {
          const db = await getDb()
          res.status(200).json(db.todos)
        } catch (err) {
          res.status(500).json({
            error: err.message
          })
        }
      })
      
      app.get('/todos/:id', async (req, res) => {
        try {
          const db = await getDb()
        
          const todo = db.todos.find(todo => todo.id === Number.parseInt(req.params.id))
          if (!todo) {
            return res.status(404).end()
          }
          res.status(200).json(todo)
        } catch (err) {
          res.status(500).json({
            error: err.message
          })
        }
      })
      
      app.post('/todos', async (req, res) => {
        try {
          // 1. 获取客户端请求体参数
          const todo = req.body
          // 2. 数据验证
          if (!todo.title) {
            return res.status(422).json({
              error: 'The field title is required.'
            })
          }
          // 3. 数据验证通过，把数据存储到 db 中
          const db = await getDb()
          const lastTodo = db.todos[db.todos.length - 1]
          todo.id = lastTodo ? lastTodo.id + 1 : 1
          db.todos.push(todo)
          await saveDb(db)
          // 4. 发送响应
          res.status(201).json(todo)
        } catch (err) {
          res.status(500).json({
            error: err.message
          })
        }
      })
      
      app.patch('/todos/:id', async (req, res) => {
        try {
          // 1. 获取表单数据
          const todo = req.body
          
          // 2. 查找到要修改的任务项
          const db = await getDb()
          const ret = db.todos.find(todo => todo.id === Number.parseInt(req.params.id))
          if (!ret) {
            return res.status(404).end()
          }
          Object.assign(ret, todo)
          await saveDb(db)
          res.status(200).json(ret)
        } catch (err) {
          res.status(500).json({
            error: err.message
          })
        }
      })
      
      app.delete('/todos/:id', async (req, res) => {
        try {
          const todoId = Number.parseInt(req.params.id)
          const db = await getDb()
          const index = db.todos.findIndex(todo => todo.id === todoId)
          if (index === -1) {
            return res.status(404).end()
          }
          db.todos.splice(index, 1)
          await saveDb(db)
          res.status(204).end()
        } catch (err) {
          res.status(500).json({
            error: err.message
          })
        }
      })
      
      app.listen(3000, () => { console.log(`Server running at http://localhost:3000/`) })
      ```
4. <a class="attachment" name="express-demo.zip">代码附件下载</a>
