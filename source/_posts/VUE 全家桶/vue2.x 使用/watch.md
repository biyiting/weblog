---
title: watch
categories:
  - VUE 全家桶
  - vue2.x 使用
tags:
  - vue2
abbrlink: 500b4a26
date: 2022-09-26 14:46:38
---
> 当数据发生变化时，及时做出响应处理

## 示例代码
```HTML
<template>
  <div div id="app">
    <input type="text" v-model="msg" />
    <input type="text" v-model="obj.name" />
  </div>
</template>

<script>
  const vm = new Vue({
    el: '#app',
    data: {
      msg: 'hello，你好呀！',
      obj: {
        name: '1'
      }
    },
    watch: {
      msg() {
        console.log('msg的值改变啦~')
      },
      obj: {
        deep: true, // 深度监听
        immediate: true, // 页面进来就会立即执行
        handler(oldVal, newVal) {
          console.log('obj的值改变啦~' + oldVal, newVal)
        }
      }
    }
  })
  // 更改msg的值
  vm.msg = 'hello~~~~';
</script>
```