---
title: 组件扩展 Composition API
categories:
  - VUE 全家桶
  - Vue3.x 使用
tags:
  - vue
abbrlink: 8c0ce92c
date: 2022-10-06 10:16:51
---
## 使用 Vue3 的组合 API 封装的可复用的功能函数
1. 一定要用 use 开头，这样才能区分出什么是组件，什么是自定义函数；
2. 作用类似于 vue2 中的 mixin 混入技术；
3. 优势: 很清楚复用功能代码的来源, 更清楚易懂；

## 需求：收集用户鼠标点击的页面坐标
1. app.vue
    ```HTML
    <template>
		  <h2>自定义hook函数操作</h2>
		  <h2>x:{{ x }},y:{{ y }}</h2>
		</template>
		<script lang="ts">
		import { defineComponent } from "vue";
		import useMousePosition from "./hooks/useMousePosition";
		export default defineComponent({
		  name: "App",
		  setup() {
		    const { x, y } = useMousePosition();
		    return { x, y };
		  },
		});
		</script>
    ```
2. useMousePosition.vue
    ```js
    import { onBeforeUnmount, onMounted, ref } from "vue";
		export default function() {
		  const x = ref(-1);
		  const y = ref(-1);
		
		  // 点击事件的回调函数
		  const clickHandler = (event: MouseEvent) => {
		    x.value = event.pageX;
		    y.value = event.pageY;
		  };
		
		  // 页面已经加载完毕了,再进行点击的操作
		  // 页面加载完毕的生命周期组合API
		  onMounted(() => {
		    window.addEventListener("click", clickHandler);
		  });
		
		  // 页面卸载之前的生命周期组合API
		  onBeforeUnmount(() => {
		    window.removeEventListener("click", clickHandler);
		  });
		
		  return { x, y };
		}
    ```