---
title: AST 语法树
categories:
  - 工程化
  - 工程化基础
tags:
  - 工程化
abbrlink: eecb67bf
date: 2022-09-16 13:20:17
---

## 抽象语法树是什么
1. 通俗的理解抽象地将代码根据 「源代码语法」 生成对应的树状结构；
2. 在 js 中，js 引擎会将代码转换成 AST，解释器根据 AST 生成字节码，提供给计算机；
3. js 还有优化编译器，它可以通过 AST 将代码直接转化为机器码；

## 抽象语法树的应用
1. IDE 工具的提示，语法高亮、代码补全；
2. jsLint、jsHint 对代码的错误/风格检测；
3. webpack、rollup 进行代码打包，确定模块关系；
4. typeScript、jsx 转化为原生的 js；

## AST 解析
1. 示例代码
    ```JS
    let name = "张三"
    ```
2. 通过 [acorn](https://astexplorer.net/) 解析得到的 json：
    ```JSON
    {
      "type": "Program",
      "start": 0,
      "end": 15,
      "body": [
        {
          "type": "VariableDeclaration",
          "start": 0,
          "end": 15,
          "declarations": [
            {
              "type": "VariableDeclarator",
              "start": 4,
              "end": 15,
              "id": {
                "type": "Identifier",
                "start": 4,
                "end": 8,
                "name": "name"
              },
              "init": {
                "type": "Literal",
                "start": 11,
                "end": 15,
                "value": "张三",
                "raw": "\"张三\""
              }
            }
          ],
          "kind": "let"
        }
      ],
      "sourceType": "module"
    }
    ```