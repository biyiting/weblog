---
title: filters
categories:
  - VUE全家桶
  - vue2.x使用
tags:
  - vue2
abbrlink: 7877678d
date: 2022-09-26 10:46:38
---
## vue 过滤器种类
1. 全局过滤器
    ```HTML
    <template>
      <div>
        <p>{{ msg | msgFormat }}</p>
      </div>
    </template>
    <script>
      Vue.filter('msgFormat', function (msg) {
        return '---' + msg + '---'
      })
      export default {
        data() {
          return {
            msg: 'aaa'
          }
        }
      }
    </script>
    ```
2. 局部过滤器
    ```HTML
    <template>
      <div>
        <p>{{ msg | msgFormat }}</p>
      </div>
    </template>
    <script>
      export default {
        data() {
          return {
            msg: 'aaa'
          }
        },
        filters: {
          msgFormat(msg) {
            return '---' + msg + '---'
          }
        }
      }
    </script>
    ```

## 使用场景
>处理 $、￥、时间...；

## 注意
1. 当「局部」和「全局」两个名称相同的过滤器存在时，局部过滤器优先于全局过滤器被调用；
2. 一个表达式可以使用多个过滤器，过滤器之间需要用管道符 "|" 隔开，其执行顺序从左往右；
3. 过滤器应为纯​​函数，并且不应依赖于 this 上下文；