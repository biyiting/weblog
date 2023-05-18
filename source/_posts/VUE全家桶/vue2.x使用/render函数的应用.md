---
title: render函数的应用
categories:
  - VUE全家桶
  - vue2.x使用
tags:
  - vue2
abbrlink: 2e2272c9
date: 2022-09-27 10:46:38
---

## 模板缺陷
1. 模板的最大特点是扩展难度大，不易扩展，可能会造成逻辑冗余；
    ```HTML
    <Level :type="1">哈哈1</Level>
    <Level :type="2">哈哈2</Level>
    <Level :type="3">哈哈3</Level>
    ```
2. Level 组件需要对不同的 type 产生不同的标签；
    ```HTML
    <template>
      <h1 v-if="type==1"><slot></slot></h1>
      <h2 v-else-if="type==2"><slot></slot></h2>
      <h3 v-else-if="type==3"><slot></slot></h3>
    </template>
    <script>
      export default {
        props: {
          type: {
            type: Number
          }
        }
      };
    </script>
    ```

## 使用 Render 函数
>复杂的逻辑变得非常简单
```JS
export default {
  render(h) {
    return h("h" + this.type, {}, this.$slots.default);
  },
  props: {
    type: {
        type: Number
    }
  }
};
```