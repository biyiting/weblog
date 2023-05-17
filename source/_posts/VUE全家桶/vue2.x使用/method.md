---
title: method
categories:
  - VUE全家桶
  - vue2.x使用
tags:
  - vue2
abbrlink: 5e593a60
date: 2022-09-25 20:46:38
---

## method 的注意事项
1. data 中的属性和 method 中的属性不能重名；
2. method 中的函数中的 this 是当前实例；
3. method 中的方法会在原型作用域中去寻找，所以 method 不能定义箭头函数；


## 示例代码
```HTML
<template>
  <div>
    <!-- 输出 event对象 -->
    <buttom @click='fn'></button>

    <!-- 输出 undefined -->
    <buttom @click='fn()'></button>

    <!-- 输出 123 和 事件对象 -->
    <buttom @click='fn(123,$event)'></button>
  </div>
</template>

<script type="text/javascript">
const vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'A',
    lastName: 'B',
    fullName2: 'A-B',
  },
  method: {
    fn(...arg) {
      // 此处的 this 是当前实例
      console.log(arg);
    },
  },
});
</script>
```