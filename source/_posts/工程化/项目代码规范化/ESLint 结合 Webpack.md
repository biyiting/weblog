---
title: ESLint 结合 Webpack
categories:
  - 工程化
  - 项目代码规范化
tags:
  - eslint
  - git hooks
abbrlink: 28e24d7f
date: 2021-11-15 08:34:34
---
> - webpack 集成 eslint 并不是以插件的方式来完成的，而是通过 loader 机制
> - 初始化 eslint 配置文件 `yarn eslint --init`

## 配置 webpack.config.js 中的 rules
```JS
{
  test: /\.js$/,
  exclude: /node_modules/, // 不校验这个目录
  use: {
    loader: 'eslint-loader',
    options: {
      fix: true
    }
  },
  // 通过 enforce: "pre"
  // 设置匹配到 js 文件优先执行这个 loader， 通过 options 中的 fix， 设置自动处理代码风格问题
  // 正常执行 webpack 打包就会触发 eslint 检测代码， 如此就能在 webpack 中使用 eslint 检测代码问题了
  enforce: "pre"
}
```

## 配置 .eslintrc.js
```JS
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    // 需要在plugins中配置"react"才可以使用这些规则
    "react/jsx-uses-react": 2, // 这里用数字2 代替error，这个规则的作用就是用来避免React定义了却没有使用的报错
    "react/jsx-uses-vars": 2 // 解决App从未使用的报错
  },
  // plugins是一个数组，在其中可以直接指定使用一些插件，使用eslint-plugin-react插件
  plugins: [
    "react" // 因为这里的插件名会去掉eslint-plugin的前缀，配置之后其中的所有规则都可以使用了 
  ]
}
```