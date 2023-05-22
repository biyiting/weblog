---
title: 内置模块之 VM
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 2214fd6c
date: 2022-09-16 12:35:30
---

## 内置模块之 VM
### vm 模块是 Nodejs 内部核心模块
1. Nodejs 底层的 require 实现用到了这个模块
2. 它的核心作用是可以创建一个独立运行代码的沙箱环境，所谓 "沙箱" 可以理解为 "独立"、"封闭"；
3. 此处不讨论 vm 模块 API 的使用语法和细节，主要了解如何运用 vm 模块为实现模块的加载做准备，也就是怎么通过 vm 把 A 模块中的内容，放在 B 模块中执行；

### 演示模块化实现方案
>创建一个 test.txt 文件（为了演示运行的是模块内容，而不是 js 文件，这里使用的 .txt）
#### 方法 1 - eval
>使用 eval 运行 JS 代码（没有独立的作用域）
```JS
// test.txt 开始
var age = 18
// test.txt 结束

const fs = require('fs')
let content = fs.readFileSync('test.txt', 'utf-8')

eval(content)
// let age = 20
// content 和当前作用域下已经有了相同名称的 age 变量，这个脚本就会报错：
// SyntaxError: Identifier 'age' has already been declared
// Nodejs 中加载的每个模块都拥有独立的作用域，所以 eval 显然不适合
```
#### 方法 2 - new Function
>new Function 虽然能创建独立作用域，不过需要手动指定作用域内需要的外部变量，当需要传入的变量增多，处理起来就相对麻烦了；一般用于模板引擎；
```JS
let age = 20

// new Function
// 最后一个参数是函数体内容的字符串
// 前面的参数是函数接收的形参名称，可以分别传入，也可以用逗号拼接在一起
const fn = new Function('age', 'return age + 1')
console.log(fn(age)) // 21
```
#### 方法 3 - vm 模块
1. vm.runInThisContext(code) 会在当前全局变量的上下文，为运行的代码创建一个与当前作用域隔离的沙箱环境，环境中只能访问全局变量，无法访问当前作用域中的变量；
    ```JS
    // test.txt 开始
    var age = 18
    // test.txt 结束
          
    const fs = require('fs')
    const vm = require('vm')
    
    let content = fs.readFileSync('test.txt', 'utf-8')
    let age = 20
    
    vm.runInThisContext(content)
    console.log(age) // 20
    ```
2. 沙箱环境在当前全局变量的上下文，可以访问全局变量 gloabl，全局上下文中 var 声明的变量会添加到全局变量 global 中；
    ```JS
    // test.txt 开始
    var age = 18
    // test.txt 结束
          
    const fs = require('fs')
    const vm = require('vm')
    
    let content = fs.readFileSync('test.txt', 'utf-8')
    let age = 20
    
    vm.runInThisContext(content)
    console.log(age) // 20
    console.log(global.age) // 18
    ```
3. let 声明的变量就不会添加到全局对象，Nodejs 中 module、exports、require 等都是使用 let 声明的；
    ```JS
    // test.txt 开始
    let age = 18
    // test.txt 结束
    
    const fs = require('fs')
    const vm = require('vm')
    
    let content = fs.readFileSync('test.txt', 'utf-8')
    let age = 20
    
    vm.runInThisContext(content)
    console.log(age) // 20
    console.log(global.age) // undefined
    ```

### 总结
1. vm.runInThisContext(code) 创建的沙箱环境保证代码不会与加载模块的外部作用域中的变量发生冲突；
2. 既解决了可以执行外部读取到的其它模块的内容，同时还把模块中的作用域与外部作用域进行了隔离，避免同名变量冲突；

## 手写 ejs 模板引擎

### 核心逻辑
1. with(obj)：执行 with 函数，obj 为执行上下文；
2. new Function()；将字符串执行；
3. 字符串拼接；
4. 正则表达式；
### 整理流程
1. 读取模板 index.html；
2. 将模板转成 js 字符串，并利用正则将模板中的 <%= %>、<% %> 全部去掉；
3. 利用 new Function 形成一个沙箱环境，让 with 在沙箱中执行字符串代码；
### 模板 index.html 代码
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <%arr.forEach((item)=>{%>
        <li><%=item%></li>
    <%})%>
</body>
</html>
```
### 利用 with、new Function、正则，将模板 html 转成下面的字符串并执行
```JS
'let str = ""
with (obj) {
    str += `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    `
    arr.forEach((item) => {
        str += `<li>${item}></li>`
    })
    str += `
</body>
</html>`
    return str
} '
```
### 实现代码
```JS
let fs = require('fs');
let path = require('path');
let str = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

function render(str, obj) {
    let head = 'let str = ""\r\nwith(obj){\r\n';
    head += 'str+= `'
    let tail = '`\r\n return str}'

    // + 原子符号
    // ? 号的作用 
    // () 分组
    // 把 <%= %> 全部去掉
    str = str.replace(/<%=(.+?)%>/g, ($0, $1) => '${' + $1 + '}')
    // 把 <% %> 全部去掉
    let content = str.replace(/<%(.+?)%>/g, ($0, $1) => '`\r\n' + $1 + '\r\nstr+=`');
    
    let fn = new Function('obj', head + content + tail);
    return fn(obj); // 或者这样写 return fn.call(null, obj);
}
let newStr = render(str, { arr: [1, 2, 3] });
console.log(newStr)
```
### 模板转成 html 展示
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <li>1</li>

    <li>2</li>

    <li>3</li>
</body>
</html>
```