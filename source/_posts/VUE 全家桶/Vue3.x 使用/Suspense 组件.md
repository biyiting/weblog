---
title: Suspense 组件
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: f00f8d35
date: 2022-10-06 14:16:51
---
>允许应用程序在等待异步组件时渲染一些后备内容，可以创建一个平滑的用户体验（页面在空白时间展示）

## 示例代码
1. app.vue
    ```HTML
    <template>
      <h2>App父级组件:Suspense组件的使用</h2>
    
      <Suspense>
        <template #default>
          <!--异步组件-->
          <AsyncComponent />
        </template>
    
        <template v-slot:fallback>
          <!--loading的内容：异步组件请求会有白屏，Suspense会出现，异步组件加载完成，Suspense消失-->
          <h2>Loading.....</h2>
        </template>
      </Suspense>
    
    </template>
    <script lang="ts">
    import { defineComponent } from "vue";
    // 引入组件:静态引入和动态引入
    
    // Vue2中的动态引入组件的写法:(在Vue3中这种写法不行)
    // const AsyncComponent = () => import('./AsyncComponent.vue')
    
    // Vue3中的动态引入组件的写法
    // const AsyncComponent = defineAsyncComponent(
    //   () => import('./AsyncComponent.vue')
    // )
    
    // 静态引入组件
    import AsyncComponent from "./asyncComponent.vue";
    export default defineComponent({
      name: "App",
      components: {
        AsyncComponent,
      },
    });
    </script>
    ```
2. asyncComponent.vue
    ```HTML
    <template>
      <h2>AsyncComponent子级组件</h2>
      <h3>{{ msg }}</h3>
    </template>
    <script lang="ts">
    import { defineComponent } from "vue";
    export default defineComponent({
      name: "AsyncComponent",
      setup() {
        // 使用 Suspense 必须要返回一个 primise
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              msg: "what are you no sha lei",
            });
          }, 2000);
        });
        // return {}
      },
    });
    </script>
    ```

## 效果展示
1. 白屏期间展示 Suspense 组件：loading...
    <img src="白屏.jpg" width="auto" height="200px" class="custom-img" title="白屏"/>
2. 异步组件加载出来，Suspense 组件消失
    <img src="异步组件加载.jpg" width="auto" height="200px" class="custom-img" title="异步组件加载"/>