---
title: 完全搞懂 this 指向(测试)
categories:
  - Hexo
tags:
  - js
date: 2023-04-26 12:26:35
---

在此感谢 coderwhy 老师，嘿嘿

> this 是 JavaScript 中的一个关键字，但是又一个相对比较特别的关键字，不像 function、var、for、if 这些关键字一样，可以很清楚的搞清楚它到底是如何使用的。
> this 会在执行上下文中绑定一个对象，但是是根据什么条件绑定的呢？在不同的执行条件下会绑定不同的对象，这也是让人捉摸不定的地方。
> 这一次，我们一起来彻底搞定 this 到底是如何绑定的吧！

## 理解 this
### 为什么使用 this
在常见的编程语言中，几乎都有 this 这个关键字（Objective-C 中使用的是 self），但是 JavaScript 中的 this 和常见的面向对象语言中的 this 不太一样：
- 常见面向对象的编程语言中，比如 Java、C++、Swift、Dart 等等一系列语言中，this 通常只会出现在`类的方法`中。
- 也就是你需要有一个类，类中的方法（特别是实例方法）中，this 代表的是当前调用对象。
- 但是 JavaScript 中的 this 更加灵活，无论是它出现的位置还是它代表的含义。

使用 this 有什么意义呢？下面的代码中，我们通过对象字面量创建出来一个对象，当我们调用对象的方法时，希望将对象的名称一起进行打印。

如果没有 this，那么我们的代码会是下面的写法：
- 在方法中，为了能够获取到 name 名称，必须通过 obj 的引用（变量名称）来获取。
- 但是这样做有一个很大的弊端：如果我将 obj 的名称换成了 info，那么所有的方法中的 obj 都需要换成 info。
``` javaScript
var obj = {
  name: "安知鱼",
  running: function () {
    console.log(obj.name + " running");
  },
  eating: function () {
    console.log(obj.name + " eating");
  },
  studying: function () {
    console.log(obj.name + " studying");
  },
};
```