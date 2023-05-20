---
title: Babel 编译器
categories:
  - 工程化
  - 工程化基础
tags:
  - 工程化
abbrlink: e69ca711
date: 2022-09-16 14:20:17
---

## 什么是 Babel
1. Babel 是一个 JavaScript 编译器
2. Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中；
3. 下面列出的是 Babel 能为你做的事情：
    - 语法转换；
    - 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过引入第三方 polyfill 模块，例如 core-js)；
    - 源码转换 (codemods)；
4. 注意：Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码；

## 安装 Babel-CLI 工具
`	npm install --global babel-cli`

## 插件 Plugin
1. 通过将插件（或预设）应用到配置文件来启用 Babel 的代码转换；
2. 使用插件
    ```JS
    // 如果插件在npm上，可以传入插件的名称，Babel 会检查它是否安装在node_modules. 
    {
      "plugins": ["babel-plugin-myPlugin", "@babel/plugin-transform-runtime"]
    }

    // 可以指定插件的相对/绝对路径
    {
      "plugins": ["./node_modules/asdf/plugin"]
    }
    ```

## 预设 Presets
>Babel 的预设（preset）可以被看作是一组 Babel 插件和/或  options  配置的可共享模块；
1. 官方提供的预设：
    - @babel/preset-env 用于编译 ES2015+ 语法
    - @babel/preset-typescript 用于 TypeScript
    - @babel/preset-react 用于 React
    - @babel/preset-flow  用于  Flow
2. 使用预设：
    ```JS
    // 如果预设在npm上，可以传入预设的名称，Babel 将检查它是否node_modules已经安装
    {
      "presets": ["babel-preset-myPreset", "@babel/preset-env"]
    }
    
    // 还可以指定预设的相对或绝对路径
    {
      "presets": ["./myProject/myPreset"]
    }
    ```

## 垫片 polyfill
>用于实现浏览器并不支持的原生 API 的代码