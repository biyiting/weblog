---
title: class类
categories:
  - JS 深度剖析
  - ECMAScript
tags:
  - es6
abbrlink: 7ec024ea
date: 2023-01-31 10:55:32
---
## class 类
1. ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板；
2. 通过 class 关键字，可以定义类；
3. ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已；

## 知识点
1. class 声明类；
2. constructor 定义构造函数初始化；
3. extends 继承父类；
4. super 调用父级构造方法；
5. static 定义静态方法和属性；
6. 父类方法可以重写；

## 示例代码
```JS
// 父类
class Phone {
  // 构造方法
  constructor(brand, color, price) {
    this.brand = brand;
    this.color = color;
    this.price = price;
  }

  //对象方法
  call() {
    console.log('我可以打电话!!!')
  }
}


// 子类
class SmartPhone extends Phone {
  constructor(brand, color, price, screen, pixel) {
    super(brand, color, price);
    this.screen = screen;
    this.pixel = pixel;
  }

  // 子类方法
  photo() {
    console.log('我可以拍照!!');
  }
  playGame() {
    console.log('我可以玩游戏!!');
  }

  // 方法重写
  call() {
    console.log('我可以进行视频通话!!');
  }

  // 静态方法
  static run() {
    console.log('我可以运行程序')
  }
  static connect() {
    console.log('我可以建立连接')
  }
}


// 实例化对象
const Nokia = new Phone('诺基亚', '灰色', 230);
const iPhone6s = new SmartPhone('苹果', '白色', 6088, '4.7inch', '500w');
// 调用子类方法
iPhone6s.playGame();  // 我可以玩游戏!!
// 调用重写方法
iPhone6s.call();  // 我可以进行视频通话!!
// 调用静态方法
SmartPhone.run(); // 我可以运行程序
```