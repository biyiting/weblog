---
title: Let、const、var的区别
categories:
  - JS 深度剖析
  - JS 高级
tags:
  - JS高级
abbrlink: f791b54a
date: 2022-09-01 14:00:27
---

## 变量提升
1. 在栈内存（作用域）形成，JS 代码自上而下执行之前，浏览器会把所有带 「VAR」 和 「FUNCTION」 关键字进行提前声明或者定义；
2. 声明（declare）: var 一个 a （默认值是 undefined）、function sum（值是16进制堆内存地址）;
3. 定义（defined）: a = 12 (定义其实就是赋值)；

## 变量提升只发生在当前作用域
1. 加载页面的时候只对全局作用域下的变量进行变量提升，因为此时的函数中存储的都是 代码字符串而已；
2. 全局变量: 在全局作用域下声明的函数或变量（带 「VAR」或「FUNCTION」的才是声明）；
3. 私有变量: 在私有作用域下声明的函数或变量（带 「VAR」或「FUNCTION」的才是声明）；
4. 浏览器很懒，做过的事情不会重复执行第二遍（当代码遇到创建函数代码，直接跳过，因为在变量提升阶段已经 声明并定义了）；
5. ES3/ES5 规范: 只有全局作用域和函数执行的私有作用域（栈内存）,其他花括号不会形成栈内存;
6. 示例代码：
    ```js
    console.log(a);//由于变量提升, a 为默认值 undefined, 没有变量提升会报错(没有定义)
    var a = 1;
    console.log(a);// 1
    ```

## 带 VAR 和不带 VAR 的区别
1. 全局作用域
    - 带 "var"：（本质是变量）
      - 在全局作用域下声明一个变量也相当于给 window 设置了一个属性，属性值为变量值，在变量提升阶段，就已经把变量设置成 window 的属性了（let声明的变量不会给 window 设置该属性）;
      - 映射机制: 全局变量修改 window 属性也修改，反之同样修改；
        ```js
        //  b 带 var
        var a = 12, b = 13;
        
        //  b 不带 var
        var a = b = 12; 
        ```
    - 不带 "var"：（本质是 window 下的属性，a=12 相当于 window.a=12）
2. 私有作用域
    - 带 "var"：私有作用域带 "var"，变量提升阶段，都声明为私有变量，和外界没有任何的关系；
    - 不带 "var"：会向上级作用域查找，查看是否是上级的变量,若不是则一直查找到 window 为止,如果 window 也没有,相当于给 window 设置了一个属性（这种机制:作用域链）；

## 变量提升的几种情况
1. 只对等号左边进行变量提升；
    ```JS
    // 普通函数由于关键字是 "function",所以在变量提升时,进行了声明和定义(赋值)
		// 函数表达式由于关键字是 "var",所以在变量提升时，只进行了声明,默认值为 undefined
		
    sum();// 2
    fn();// fn is not a function
    
    //匿名函数(函数表达式)
    var fn = function () {
        console.log(1);
    }
    //普通函数
    function sum() {
        console.log(2);
    }
    ```
2. 条件判断下的变量提升（在当前作用域下,不管条件是否成立都要进行变量提升）
    - 带 "var" 的还只是声明;
    - 带 "function"：
      - 老版本浏览器渲染机制下，还是声明定义都处理；
        ```js
        //变量提升: 无

        //window.f = 引用地址1
        f = function () {
            return true;
        }

        //window.g = 引用地址2
        g = function () {
            return false;
        }

        ~function () {
            //私有作用域变量提升：function g  => g 是私有变量

            //新版本浏览器：
            //  函数只声明类似 var,则 g 默认值为 undefined
            //  报错 TypeError: g is not a function,下面代码不执行

            //老版本浏览器(IE9、IE10):
            //  对函数声明并定义(赋值),则 g() 返回 true，条件成立
            //  f 向上级作用域寻找，找到 f 被改成 false，则输出 false false

            //[] == ![] ：
            //  叹号的优先级较高，![] 则给对象取反则为 false
            //  等号左边为引用类型，右边为值类型，则左侧需要 toString() 转换为值类型 ''
            //  则 '' == false  =>  0 == 0 ，为 true
            if (g() && [] == ![]) {
                f = function () {
                    return false;
                }
                function g() {
                    return true;
                }
            }
        }();

        console.log(f());//false
        console.log(g());//false
        ```
      - 新版本浏览器中(谷歌 45 之后)，在条件判断中的函数，不管条件是否成立，都只先声明，类似 "var";
        ```js
        //变量提升: fn （此处不考虑老版本浏览器）

        console.log(fn);//输出 undefined

        if (1 === 1) {
            //本应该输出 undefined，但是输出 fn 函数本身
            //当条件成立，进入到判断体中(es6中它是一个块级作用域),第一件事并不是执行
            //代码，而是类似于变量提升，先把 fn 声明和定义了，也就是判断体中代码执行之 
            //前，fn 就已经赋值了
            console.log(fn);
            function fn() {
                console.log('ok');
            }
        }

        //上面判断成立，fn 定义成功，则输出 fn 函数本身，判断不成立则输出 undefined
        console.log(fn);
        ```
3. 变量提升下的重名问题处理：
    - 带 "var" 和 "function" 关键字声明相同的名字，这种也是重名了（其实是一个 fn，只是存储的类型不一样）；
    - 关于重名的处理: 如果名字重复了,不会重新声明,但是会重名定义(赋值),不管是变量提升阶段还是代码执行阶段皆是如此;
      ```js
      fn();//输出 4
      function fn() { console.log(1); }
      fn();//输出 4
      function fn() { console.log(2); }
      fn();//输出 4
      var fn = 100;//fn在此处开始定义(赋值),fn=100;
      fn();//100()报错: TypeError: fn is not a function
      function fn() { console.log(3); }
      fn();
      function fn() { console.log(4); }
      fn();
      ```

## let

## let 与 const 区别

## 面试题
### 第 1 题：输出 0-9
```js
// 第一种
for (var i = 0; i < 10; i++) {
  // 每一轮都生成一个自执行函数，形成全新的执行上下文 EC
  // 并且把每一轮循环的 i 当做实参传给私有 上下文中的私有变量 i(形参变量)
  // 定时器触发执行用到的 i 都是私有 EC 中的保留下来的 i
  // 充分利用闭包的保存机制（闭包有保护和保存 2 个机制）来完成的，这样处理不太好，     
  //循环 多次就会产生多个不销毁的 EC
  ~function (i) {
    setTimeout(function () {
        console.log(i);
    }, 10);
  }(i);
}

// 第二种
// let 存在块级作用域，var 没有
for (let i = 0; i < 10; i++) {
  // 形成了 10 个块级作用域，每个块级作用域中都有一个私有变量 i
  setTimeout(function () {
    console.log(i);
  }, 10);
}
```