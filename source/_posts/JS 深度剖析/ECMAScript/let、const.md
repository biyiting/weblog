---
title: let、const
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: '57897401'
date: 2023-01-29 09:50:32
---

## let
1. let 关键字用来声明变量，使用 let 声明的变量有几个特点
    - 不允许重复声明；
    - 块级作用域；
    - 不存在变量提升；
    - 不影响作用域链；
2. 演示代码
    - let 声明的成员只会在所声明的块中生效
      ```JS
      if (true) {
        let foo = 'zce'
        console.log(foo)
      }

      console.log(foo); // 报错
      ```
    - let 和 var 在 for 循环中的表现
      ```JS
      // 里外循环公用了一个 i
      for (var i = 0; i < 3; i++) {
        for (var i = 0; i < 3; i++) {
          console.log(i)
        }
        console.log('内层结束 i = ' + i)
      }
      // 0
      // 1
      // 2
      // 内层结束 i = 3
      ```
      ```JS
      for (var i = 0; i < 3; i++) {
        for (let i = 0; i < 3; i++) {
          console.log(i)
        }
        console.log('内层结束 i = ' + i)
      }
      // 0
      // 1
      // 2
      // 内层结束 i = 0
      // 0
      // 1
      // 2
      // 内层结束 i = 1
      // 0
      // 1
      // 2
      // 内层结束 i = 2
      ```
    - let 应用场景：循环绑定事件，事件处理函数中获取正确索引
      ```JS
      // 利用闭包 
      var elements = [{}, {}, {}]

      for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = (function (i) {
          return function () {
            console.log(i)
          }
        })(i)
      }

      elements[0].onclick() // 0 
      ```
      ```JS
      // let  
      var elements = [{}, {}, {}]

      for (let i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
          console.log(i)
        }
      }

      elements[0].onclick() // 0 
      ```
    - for 循环会产生两层作用域
      ```JS
      for (let i = 0; i < 3; i++) {
          let i = 'foo'
          console.log(i)
      }
      // foo
      // foo
      // foo
      ```
    - let 修复了变量声明提升现象
      ```JS
      // 变量提升
      console.log(foo)
      // undefined
      var foo = 'zce'

      // let 修复变量提升，则报错
      console.log(foo)

      let foo = 'zce'
      ```
## const
1. const 关键字用来声明常量，const 声明有以下特点：
    - 声明必须赋初始值；
    - 标识符一般为大写；
    - 不允许重复声明；
    - 值不允许修改；
    - 块级作用域；
2. 演示代码：
    - 恒量声明过后不允许重新赋值
      ```JS
      const name = 'zce'
      name = 'jack'
      ```
      {% asset_img 重新赋值.jpg 重新赋值 %}
    - 恒量要求声明同时赋值
      ```JS
      const name
      name = 'zce'
      ```
      {% asset_img 同时赋值.jpg 同时赋值 %}
    - 恒量只是要求内层指向不允许被修改
      ```JS
      const obj = {}
      obj.name = 'zce'

      obj = {}
      ```
      {% asset_img 不允许被修改.jpg 不允许被修改 %}
3. 使用：尽量全部变量都是用 const 声明，需要改变值的用 let 声明；