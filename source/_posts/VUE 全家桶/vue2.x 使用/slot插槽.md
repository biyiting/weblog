---
title: slot插槽
categories:
  - VUE 全家桶
  - vue2.x 使用
tags:
  - vue2
abbrlink: 4854dd8c
date: 2022-09-27 14:46:38
---

## 什么是插槽
1. VUE 官方文档的解释：Vue 实现了一套内容分发的 API，将 \<slot> 元素作为承载分发内容的出口；
2. 个人理解：slot 的出现是为了父组件可以堂而皇之地在子组件中加入内容；


## 使用插槽
>插槽显不显示、怎样显示是由父组件来控制的，而插槽在哪里显示就由子组件来控制
1. 父组件
    ```HTML
    <template>
      <div class="father">
        <h1>Father的标题</h1>
        <child>我是个萝卜~</child>
      </div>
    </template>
    ```
2. 子组件
    ```HTML
    <template>
      <div class="child">
        <h2>Child的标题</h2>
        <slot>我是一个萝卜坑</slot>
      </div>
    </template>
    ```

## 插槽分类

### 匿名插槽
>匿名插槽就是没有设置 name 属性的插槽，一个组件中只能有一个，作为找不到匹配的内容片段时的备用插槽，匿名插槽只能作为没有 slot 属性的元素的插槽；
1. 父组件
    ```html
    <!-- 父组件 -->
    <template>
      <div class="parent">
        <h1>父组件</h1>
        <child>
          <p>匿名插槽内容</p>
        </child>
      </div>
    </template>
    ```
2. 子组件
    ```html
    <!-- 子组件 -->
    <template>
      <div class="child">
        <h1>子组件</h1>
        <!-- 这是个匿名插槽（没有 name 属性）-->
        <slot></slot>
      </div>
    </template>
    ```

### 具名插槽
> 具有名字的插槽，名字通过属性 name 来定义，一个组件中可以有很多具名插槽，出现在不同的位置；
> 具名插槽的缩写：例如  v-slot:header 可以被重写为 #header；
1. 父组件
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        <child>
          <template #header>
            <h1>我是头header</h1>
          </template>

          <p>我是main的内容111</p>
          <p>我也是main的内容222</p>

          <template v-slot:footer>
            <p>我是footer</p>
          </template>
        </child>
      </div>
    </template>
    ```
2. 子组件
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        <slot name="header"></slot>

        <slot></slot>

        <slot name="footer"></slot>
      </div>
    </template>
    ```

### 作用域插槽
>父组件向 Child 组件新增标签内容，标签中部分内容是 Child 中的数据
1. 父组件
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        <child>
          <!-- 给 head 插槽设置作用域 -->
          <template v-slot:head="{childUser}">
            <p>给 head 插槽设置作用域</p>
            <p>{{ childUser.Name}}</p>
            <p>{{ childUser.Age}}</p>
          </template>

          <!-- 给 匿名 插槽设置作用域 -->
          <template v-slot="{childUser}">
            <p>给 匿名 插槽设置作用域</p>
            <p>{{ childUser.Name}}</p>
            <p>{{ childUser.Age}}</p>
          </template>
        </child>
      </div>
    </template>
    ```
2. 子组件
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        <slot name="head" :childUser="childUser"></slot>
        <slot :childUser="childUser"></slot>
      </div>
    </template>

    <script>
    export default {
      data() {
        return {
          childUser: { Name: 'Tom', Age: 23 },
        };
      },
    };
    </script>
    ```

### 动态插槽名
>动态指令参数也可以用在 v-slot 上，来定义动态的插槽名
1. 父组件
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        <button @click="changeSlotName"></button>
        <child>
          <template v-slot:[dynamicSlotName]>
            <p>{{dynamicSlotName}}</p>
          </template>
        </child>
      </div>
    </template>
    <script>
    import child from './child.vue';
    export default {
      components: {
        child,
      },
      data() {
        return {
          dynamicSlotName: 'header',
        };
      },
      methods: {
        changeSlotName() {
          this.dynamicSlotName = 'footer';
        },
      },
    };
    </script>
    ```
2. 子组件
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        <slot name="header">这是 header</slot>
        <slot name="footer">这是 footer</slot>
      </div>
    </template>
    ```