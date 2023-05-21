---
title: webpack 的安装
categories:
  - 工程化
  - webpack5
tags:
  - webpack
abbrlink: 448f3abc
date: 2022-10-10 13:23:34
---
## 构建工程
> npm init -y （-y 是 yes 的意思，在 init 的时候省去了敲回车的步骤，生成的默认的 package.json）生成 package.json；

## webpack 的全局安装
```YAML
# 全局安装 webpack 及其命令行工具 webpack-cli，安装的版本是最新稳定版本
npm install webpack webpack-cli webpack-dev-server -g

# 全局安装 指定版本，可以在安装的包名后面加上 @x.x.x 这种形式的版本号
npm install webpack@4.43.0 webpack-cli@3.3.12 webpack-dev-server -g
```

## webpack 的局部安装
```YAML
# 局部安装 --save--dev 等价于 -D
npm install webpack webpack-cli –D 

# 局部安装 指定版本
npm install webpack@4.43.0 webpack-cli@3.3.12 -D
```

## npx 简介
1. 安装：Node 安装后自带 npm 模块，可以直接使用 npx 命令，如果不能使用，就要手动安装一下 npm install -g npx；
2. npx 想要解决的主要问题，就是调用项目内部安装的模块：
    - 如果使用 webpack，只能在项目脚本的 package.json 中的 scripts 字段里面， 如果想在命令行下调用，必须像 node_modules/.bin/webpack -v 这样；
    - npx 可以让项目内部安装的模块用起来更方便，只要像 npx webpack -v 这样调用就行了；
3. npx 的原理很简单，就是运行的时候，会到 node_modules/.bin 路径和环境变量 $PATH 里面，检查命令是否存在，由于 npx 会检查环境变量 $PATH，所以系统命令也可以调用；
    - 在项目根目录下面，执行 npx webpack -v，显示的 node_modules/ 下的 webpack 版本号；
    - 在其它路径下面，执行 npx webpack -v，显示的全局的 webpack 版本号；


## npx 和 npm 的区别
1. npx 侧重于执行命令的，执行某个模块命令，虽然会自动安装模块，但是重在执行某个命令；
2. npm 侧重于安装或者卸载某个模块的，重在安装，并不具备执行某个模块的功能；

## 查看当前项目 webpack 版本
```YAML
npx webpack -v
# 两个等价
node_modules/.bin/webpack -v
```

## 查看版本号
```YAML
npm info webpack version

# 这个会打印出 webpack 所有信息
npm info webpack
```
