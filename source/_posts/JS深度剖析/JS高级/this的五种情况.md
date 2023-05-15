---
title: this的五种情况
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
abbrlink: 239a8ade
date: 2022-09-05 11:38:26
---

## 第一种：事件绑定

1. 给元素的某个事件行为绑定方法，事件触发，方法执行，此时方法中的 this 一般都是当前元素本身；
2. 示例代码：
   ```JS
   // DOM0
   btn.onclick = function anonymous() {
     console.log(this); // 元素
   };
   ```
   ```JS
   // => DOM2：不兼容IE6 7 8
   btn.addEventListener('click', function anonymous() {
     console.log(this);  // 元素
   }, false);
   btn.attachEvent('onclick', function anonymous() {
     // IE8 浏览器中的 DOM2 事件绑定
     console.log(this); // window
   });
   ```
   ```JS
   function fn() {
     console.log(this);
   }
   // fn.bind(window)首先会返回一个匿名函数 AM,把 AM 绑定给事件
   // 点击触发执行 AM，AM 中的 this 是元素，但是会在 AM 中执行 fn，fn中的 this 是预先指定的 window
   btn.onclick = fn.bind(window);
   ```

## 第二种：普通函数执行

1. 普通函数执行，它里面的 this 是谁，取决于方法执行前面是否有“点”，有的话，“点”前面是谁 this 就是谁，没有 this 则指向 window（严格模式下是 undefinde）；
2. 示例代码：

   ```JS
   function fn() {
     console.log(this);
   }

   let obj = { name: 'OBJ', fn: fn };

   fn();
   obj.fn();

   // hasOwnProperty 方法中的 this 为 obj
   console.log(obj.hasOwnProperty('name')); // true
   // hasOwnProperty 方法中的 this 为 obj.__proto__(Object.prototype)
   console.log(obj.__proto__.hasOwnProperty('name')); // false
   //<=> obj.hasOwnProperty('name')
   console.log(Object.prototype.hasOwnProperty.call(obj, 'name'));

   /*
    * hasOwnProperty:用来检测某个属性名是否属于当前对象的私有属性
    * in是用来检测是否为其属性（不论私有还是公有）
    *
    * Object.prototype.hasOwnProperty=function hasOwnProperty(){}
    */
   console.log(obj.hasOwnProperty('name')); //=>true
   console.log(obj.hasOwnProperty('toString')); //=>false
   console.log('toString' in obj); //=>true
   ```

## 第三种：构造函数执行，函数中的 this 是当前类的实例

1. 构造函数执行（new xxx），函数中的 this 是当前类的实例；
2. 示例代码：
   ```JS
   function Fn() {
     console.log(this);
     // this.xxx = xxx 是给当前实例设置私有属性
   }
   let f = new Fn;
   ```

## 第四种：箭头函数

1. 箭头函数中没有自身的 this，所用到的 this 都是其上下文中的 this；
2. 箭头函数没有的东西很多：
   - 没有 prototype（也就是没有构造器），所以不能被 new 执行；
   - 没有 arguments 实参集合（可以基于...args 剩余运算符获取）；
3. 示例代码：

   ```JS
   let obj = {
     name: 'OBJ',
     fn: function () {
       // console.log(this); //=>obj
       let _this = this;
       return function () {
         // console.log(this); //=>window
         _this.name = "旺旺";
       };
     }
   };

   let ff = obj.fn();
   ff();
   ```

   ```JS
   let obj = {
     name: 'OBJ',
     fn: function () {
       // console.log(this); //=>obj
       return () => {
         console.log(this); //=>obj
       };
     }
   };

   let ff = obj.fn();
   ff();
   ```

   ```JS
   let obj = {
     name: 'OBJ',
     fn: function () {
       setTimeout(_ => {
         // console.log(this); //=>obj
         this.name = "旺旺";
       }, 1000);
     }
   };
   obj.fn();
   ```

## 第五种：call、apply、bind

1. 基于 call/apply/bind 可以改变函数中 this 的指向（强行改变），call、apply、bind 是 Function.prototype 上的方法
2. func.call(context, 10, 20)：context 为改变的 this 指向（非严格模式下，传递 null/undefined 指向的也是 window）

   ```JS
   Function.prototype.call = function call(context = window, ...args) {
     context === null ? context = window : null;

     //=> 此处 this 为 apply 前的函数，也就是调用 apply 的函数
     //=> 把函数赋值给需要指定 this 的对象 context
     context.$fn = this;
     let result = context.$fn(...args); // 这时函数执行 this 就变成了 context

     delete context.$fn;
     return result;
   }
   ```

3. func.apply([context], [10, 20])：context 为改变的 this 指向（非严格模式下，传递 null/undefined 指向的也是 window）

   ```JS
   Function.prototype.apply = function apply(context = window, args) {
     context === null ? context = window : null;

     //=> 此处 this 为 apply 前的函数，也就是调用 apply 的函数
     //=>把函数赋值给需要指定 this 的对象 context
     context.$fn = this;
     let result = context.$fn(...args); // 这时函数执行 this 就变成了 context

     delete context.$fn;
     return result;
   }
   ```

4. bind：call/apply 都是改变 this 的同时直接把函数执行了，而 bind 不是立即执行函数，属于预先改变 this 和传递一些内容（柯理化）；

   ```JS
   // es5 版本
   Function.prototype.bind = function bind(context) {
     context = context || window;
     // 获取传递的实参集合
     var args = [].slice.call(arguments, 1);
     var _this = this;

     // 需要最终执行的函数
     return function anonymous() {
       // 此函数的参数
       var amArg = [].slice.call(arguments, 0);
       _this.apply(context, args.concat(amArg));
     };
   }

   // es6 版本
   Function.prototype.bind = function bind(context = window, ...args) {
     // 经过测试：apply 的性能不如 call（3 个参数以上）
     return (...amArg) => this.call(context, ...args.concat(...amArg));
   }
   ```

   ```JS
   // es5 版本：bind 之后的函数以构造函数的方式执行，可以获取原有类的原型
   Function.prototype.bind = function bind(context) {
     context = context || window;
     // 获取传递的实参集合
     var args = [].slice.call(arguments, 1);
     var _this = this;
     function Fn() { }; // Object.create 原理

     // 需要最终执行的函数
     function Anonymous() { // this
       // 此函数的参数
       var amArg = [].slice.call(arguments, 0);
       // 如果是构造函数方式执行，this 为 Anonymous 的实例
       _this.apply(this instanceof Anonymous ? this : context, args.concat(amArg));
     };

     // 构造函数执行，继承 Anonymous 的原型上的方法
     Fn.prototype = this.prototype;
     Anonymous.prototype = new Fn();

     // 或者
     // let instance = Object.create(this.prototype);
     // Anonymous.prototype = instance;

     // 或者 Anonymous.prototype = this.prototype; （不建议）

     return Anonymous;
   }


   // 测试
   function Cat() {
     this.say = '说话';
     console.log(this);
   }
   let obj = { name: '花花' };
   Cat.prototype.flag = '哺乳类';
   let bindCat = Cat.bind(obj, '猫'); // 返回一个函数（高阶函数）

   // 第一种方式执行：普通函数执行
   bindCat();
   // this => {name: '花花', say: '说话'}
   // obj => {name: '花花', say: '说话'}

   // 第二种方式执行：构造函数执行
   let instance = new bindCat(9); // new 的方式执行 bindCat
   console.log(instance.flag); // 哺乳类
   ```

## 面试题

### 第 1 题：（阿里）
```JS
function fn1() {
  console.log(1);
}
function fn2() {
  console.log(2);
}

// fn2.$fn = fn1；
// fn2.$fn() => fn2.fn1()；this 指向 fn2，执行 fn1，输出 1
fn1.call(fn2); // 1

// 把 fn1.call 看成 AF0，AF0.call(fn2)
// fn2.$fn() => fn2.AF0()； fn1.call 和 fn1.call.call 都是同一个 call 函数
// 则 AF0 可以看成 call 函数，即 fn2.call 执行，this 为 window，输出 2
fn1.call.call(fn2); // 2

// 同上
Function.prototype.call.call(fn2); // 2
```

### 第 2 题：闭包造成内存泄漏举例
1. 意外的全局变量；
2. 未被清空的计时器或回调函数；
3. 脱离 DOM 的引用；
4. 未被销毁的事件监听；