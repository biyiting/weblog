---
title: webpack 的配置文件
categories:
  - 工程化
  - webpack5
tags:
  - webpack
abbrlink: '42918826'
date: 2022-10-10 14:33:34
---
## [npm 简化 npx 打包命令](https://webpack.docschina.org/api/cli/#env)
1. 使用 npx 打包：npx weppack --config webpack.config.js 使用 webpack.config.js 配置文件打包；
2. 使用 npm 打包：npm run build
    ```JSON
    "scripts": {
      /*  windows 不支持 NODE_ENV = development 的设置方式，设置 cross-env 解决 */
      "build": "cross-env NODE_ENV=production webpack --config webpack/prod.config.js"
    },
    ```


## 配置文件常用配置项介绍
1. mode：开发模式
    - development：开发环境，不会对打包生成的文件进行代码压缩和性能优化，打包速度快；
    - production：生产环境，会对打包生成的文件进行代码压缩和性能优化，打包速度很慢，会开启 debug，打印详细的错误信息；
2. devtool： 用于配置 source map 代码映射；
3. entry：打包的入口文件
    ```JS
    /*  当 entry 是字符串时：表示只有一个要打包的模块 */
    entry:"./app/one.js"
    ```
    ```JS
    /*  当 entry 是数组时：表示将多个模块打包成一个模块，如果这些模块之间不存在依赖，数组中值的顺序没有要求，如果存在依赖，则要将依赖性最高的模块放在最后面 */
    entry:["./app/two.js", "./app/three.js"]
    ```
    ```JS
    /*  当 entry 是一个键值对形式的对象时，分别打包成多个模块时，包名就是键名 */
    entry: {
      main: "./app/one.js",
      subject: "./app/two.js"
    }
    ```
4. output：配置打包的结果
    ```JS
    output: {
      filename: 'bundle.js', // 定义输出文件名
      path: path.join(__dirname, 'dist'), // 定义输出文件路径
      publicPath: 'dist/', // 基础路径：表示项目根目录下的 dist
    },
    ```
5. module：定义一系列 loader，webpack 只能打包 js 和 json，loader 让 webpack 可以去处理其他类型的文件；
6. plugins：插件用于增强 webpack 自动化能力；
7. --resolve：影响对模块的解析
    - alias：配置解析模块路径的别名，优点是简写路径，缺点是没有路径提示；
    - extensions：配置省略文件路径的后缀名，按顺序解析后缀名；
    - fallback：webpack5 不再自动填充 node.js 核心模块，如果确认需要 node polyfill, 设置 resolve.fallback 安装对应依赖
    - ......
