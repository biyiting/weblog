---
title: Mono-repo 工程构建（pnpm）
categories:
  - 工程化
  - 工程化基础
tags:
  - 工程化
abbrlink: '52117e12'
date: 2022-09-15 13:25:17
---

## mono-repo 是什么？
1. mono-repo 是把多个项目的所有代码放到一个 git 仓库中进行管理，多个项目中会有共享的代码则可以分包引用；
2. 整个项目就是有 root 管理的 dependencies 加上多个 packages，每个 package 也可以在自己的作用域引入自己的 dependencies；
3. 项目结构如下
    <img src="mono-repo.jpg" width="auto" height="240px" class="lazy-load" title="mono-repo"/>

## 为什么要使用 monorepo
1. 使用 monorepo 可以把原本一个项目的多个模块拆分成多个 packages，在 packages 之间相互引用，也可以单独发布成包，极大地解决了项目之间代码无法重用的痛点；
2. 在项目打包或者编译操作时也可重用一套配置，通吃所有 packages；

## Monorepo 的优势
1. 代码具有更高的可维护性；
2. 可以抽取公共进行代码复用；
3. 可以进行公共依赖的抽取，降低空间占用和开发成本；
4. 可以使用统一的工程配置；

## Monorepo 的劣势
1. 大型项目对版本控制是严峻考验；
2. 打包构建需要专门优化，否则会出现打包时间过长；
3. 权限管理较为困难；

## pnpm 构建 mono-repo

### 第一步：创建 smarty 项目
> 初始化 package `pnpm init`

### 第二步：禁用 npm、yarn
1. pnpm 的 monorepo 项目在 node_modules 以及开发中，项目依赖 pnpm workspace，使用 npm 或 yarn 运行时会出现问题；
2. 具体实现
    - package.json
      ```JSON
      // package.json
      "scripts": {
        "preinstall": "node ./scripts/preinstall.js"
      },
      ```
    - preinstall.js
      ```JS
      if (!/pnpm/.test(process.env.npm_execpath || '')) {
        // 当 install 的时候调用这个脚本
        console.log(`\u001b[33m----------\u001b[39m\n`);
        console.warn(`\u001b[33mThis repository requires using pnpm as the package managerfor scripts to work properly.\u001b[39m\n`);
        console.log(`\u001b[33m----------\u001b[39m\n`);
        process.exit(1);
      }
      ```

### 第三步：建立工作空间
1. 根目录创建 pnpm-workspace.yaml，内容如下
    ```YAML
    packages:
      # all packages in subdirs of packages/ and components/
      # 所有的 packages 都放在 packages 目录下
      - "packages/**"
    ```
2. 这里先创建 2 个包，然后每个都执行  npm init ，假设每个 package 的 name 依次为 smarty-admin、@smarty-admin/utils

### 第四步：安装依赖包
1. 安装三方依赖包
    ```YAML
    # 安装全局共用的包，-w 表示把包安装在 root 下，该包会放置在 <root>/node_modules 下
    pnpm install react react-dom -w
    # 安装在所有 packages 中
    pnpm install react react-dom -w
    # 安装在 @smarty-admin/utils 下，--filter 后面接子 package 的 name 
    pnpm i dayjs -r --filter @smarty-admin/utils
    ```
2. 安装项目依赖包
    - 将 @smarty-admin/utils 安装到 smarty-admin 下
      ```YAML
      # 安装依赖
      pnpm i @smarty-admin/utils -r --filter smarty-admin
      ```
      ```JSON
      // smarty-admin 的 package.json
      {
        "name": "smarty-admin",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
          "@smarty-admin/utils": "workspace:^1.0.0"
        }
      }
      ```
      ```Js
      // smarty-admin 的 index.js
      module.exports = "I am Utils......"
      ```
    - smarty-admin 引入依赖，并执行
      ```js
      const str = require('@smarty-admin/utils')
      // 等价
      // const str = require('../utils')
      
      console.log(str); // I am Utils......
      ```


### <a class="attachment" name="smarty.zip">代码附件下载</a>