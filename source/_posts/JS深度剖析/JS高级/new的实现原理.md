---
title: new的实现原理
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-02 17:50:27
---

## 对象、类、实例的概念
1. 对象：万物皆对象；
2. 类：对象的具体细分；
3. 实例：类中具体的一个事物（拿类中的具体一个实例进行研究，那么当前类别下的其他实例也具备这些特点和特征）；

## 基于构造函数(constructor)创建自定义类
1. 在普通的函数执行的基础上 "new xxx()"，这样就不是普通函数执行了，而是构造函数执行，当前的函数名称为 "类名"，接收的返回结果是当前类的实例；
2. 自己创建的类名，最好第一个字母大写；
3. 这种构造函数设计模式执行，主要用于组件、类库、插件、框架封装，平时一般不这样处理业务逻辑；
    ```JS
    function Fn() { }
    var f = new Fn(); // Fn 是类，f 是实例
    console.log(f);
    ```

## js 创建对象的两种方式
1. 字面量表达式：`var obj  =  {}；`
2. 构造函数方式：`var obj  =  new  Object()；`

## 基本类型、数据类型 基于两种不同的方式创建出来的值是不一样的
1. 基于字面量方式创建的值是基本类型值；
2. 基于构造函数创建出来的值是引用数据类型；
    ```JS
    var num1 = 12; // 12
    var num2 = new Number(12); // Number {12}
    console.log(typeof num1); // number
    console.log(typeof num2); // object
    ```

## 普通函数执行步骤
1. 形成一个全新的执行上下文；
2. 形成一个 AO 变量对象；
    - 形参赋值；
    - 变量提升；
3. 初始化作用域链；
4. 代码自上而下执行；

## 构造函数执行机制(new Fn())
1. 形成一个全新的执行上下文；
2. 形成一个 AO 变量对象；
    - 形参赋值；
    - 变量提升；
3. 初始化作用域链；
4. 「新」默认创建一个对象，而这个对象就是当前类的实例；
5. 「新」声明其 this 指向，让其指向这个新创建的实例；
6. 代码自上而下执行；
7. 「新」不论其是否写 return，都会把新创建的实例返回，若客户自己返回引用值，则以自己返回的为主，否则返回创建的实例；
    ```JS
    function func() {
      // let obj = {};  // 这个对象就是实例对象
      // this -> obj

      let x = 100;
      this.num = x + 100; // 相当于给创建的实例对象新增一个 num 属性

      // return { x: 200 }; // 用户自己返回内容，如果是一个引用类型值，则会把默认返回的实例覆盖掉
    }
    
    let f = new func();
    console.log(f); // f 是 func 这个类的实例 {num:200}
    
    let f2 = new func();
    console.log(f === f2); // false，每一次 new 出来都是一个新的实例对象（新的堆内存）
    ```

## 构造函数中的细节问题
1. 构造函数不写 return，浏览器会默认返回创建的实例；
2. 如果写了 return：
    - return 是一个基本值：返回的依然是类的实例,没有受到影响；
    - return 是一个引用值：此时收到的结果就不在是当前的实例了；
3. 在构造函数执行的时候，如果不需要传参，则可以省略小括号（还是创建实例）；

## 引用数据类型判断
1. instanceof：判断某个对象是否由某个构造函数构建（通过 \_\_proto\_\_ 一层层向上找，直到找到或找不到）；
2. hasOwnProperty：检测当前属性是否为对象的私有属性（只在实例上查找）；
3. in：检测当前对象是否存在某个属性（在实例和原型上查找）；

## 面试题

### 第一题：Object.create() 内部原理
1. 实现代码：
    ```JS
    function Animal(kind) {
      this.kind = kind;
    }
    function Dog(name) {
      this.name = name;
    }
    
    // Object.create() 的实现
    let _create = function (Classfy) {
      function Fn() { }
      Fn.prototype = Classfy.prototype;
      return new Fn();
    }
    
    // 测试
    Dog.prototype = _create(Animal);
    let dog = new Dog('花花');
    console.log(dog.__proto__.__proto__ === Animal.prototype); // true
    console.log(dog.__proto__ === Dog.prototype); // true
    ```
2. 图解：
    {% asset_img Object.create内部原理.jpg Object.create内部原理 %}

### 第二题：内置类 new 的实现（阿里）
```JS
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function () {
  console.log('wangwang');
}
Dog.prototype.sayName = function () {
  console.log('my name is ' + this.name);
}

/**
 * @param {*} Func 操作的那个类
 * @param  {...any} args new 的时候传入的实参集合
 * @return 实例 或者 自己返回的对象
 */
function _new(Func, ...args) {
  // 1.「新」默认创建一个对象，而这个对象就是当前类的实例
  // 2.「新」声明其 this 指向，让其指向这个新创建的实例
  // 3.「新」不论其是否写 return，都会把新创建的实例返回，若客户自己返回引用值，则以自己返回的为主，否则返回创建的实例

  // let obj = {};
  // obj.__proto__ == Func.prototype;//=>IE大部分浏览器不支持直接操作__proto__
  // 等价于
  // let objInstance = Object.create(Func.prototype)
  let objInstance = Object.create(Func.prototype);

  // 也会把类当做普通函数执行
  // 执行的时候要保证函数中的 this 指向创建的实例
  let result = Func.call(objInstance, ...args);

  // 若客户自己返回引用值，则以自己返回的为主，否则返回创建的实例
  if ((result !== null && typeof result === 'object') || typeof result === 'function') {
    return result;
  }
  
  return objInstance;
}

let sanmao = _new(Dog, '三毛');
sanmao.sayName();
sanmao.bark();
console.log(sanmao instanceof Dog);
```

