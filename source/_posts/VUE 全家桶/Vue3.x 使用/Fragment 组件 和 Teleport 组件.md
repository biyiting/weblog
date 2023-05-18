---
title: Fragment 组件 和 Teleport 组件
categories:
  - VUE 全家桶
  - Vue3.x 使用
tags:
  - vue
abbrlink: 9202f640
date: 2022-10-06 12:16:51
---

## Fragment 组件(片断)
1. 在 Vue2 中: 组件必须有一个根标签；
2. 在 Vue3 中: 组件可以没有根标签, 内部会将多个标签包含在一个 Fragment 虚拟元素中；
3. 好处: 减少标签层级, 减小内存占用；
4. 示例代码：
    ```HTML
    <template>
      <h2>aaaa</h2>
      <h2>aaaa</h2>
    </template>
    ```

## Teleport 组件(瞬移)
### 问题
>如果嵌套在 Vue app 内的某个组件内部，那么处理嵌套组件的定位、z-index 和样式就会变得很困难；
### 解决
>Teleport 是 Vue 3.0 新增的一个内置组件，主要是为了解决一些特殊场景下模态对话框组件、组件的渲染，Teleport 是一种能够将模板移动到 DOM 中 Vue app 之外的其他位置的技术；

### 示例代码
1. app.vue
    ```HTML
    <template>
      <h2>App父级组件</h2>
      <hr />
      <ModalButton />
    </template>
    <script lang="ts">
    import { defineComponent } from "vue";
    import ModalButton from "./ModalButton.vue";
    export default defineComponent({
      name: "App",
      components: {
        ModalButton,
      },
    });
    </script>
    ```
2. modalButton.vue
    ```HTML
    <template>
      <button @click="modalOpen = true">打开一个对话框</button>
      <!-- 对话框代码：将这个弹窗放到了 body 标签中 -->
      <Teleport to="body">
        <div v-if="modalOpen" class="modal">
          <div>
            这是对话框
            <button @click="modalOpen = false">关闭对话框</button>
          </div>
        </div>
      </Teleport>
    </template>
    <script lang="ts">
    import { defineComponent, ref } from "vue";
    export default defineComponent({
      name: "ModalButton",
      setup() {
        // 控制对话框显示或者隐藏的
        const modalOpen = ref(false);
        return {
          modalOpen,
        };
      },
    });
    </script>
    <style>
    .modal {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .modal div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: white;
      width: 300px;
      height: 300px;
      padding: 5px;
    }
    </style>
    ```
3. 效果展示
    {% asset_img 效果展示.jpg 效果展示 %}