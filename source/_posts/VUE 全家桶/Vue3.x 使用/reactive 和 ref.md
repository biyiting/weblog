---
title: reactive 和 ref
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: '41139438'
date: 2022-10-05 21:16:51
---

## reactive
>可以把「引用类型数据」转成响应式的；
1. 缺点：
    - reactive 返回的对象不能解构，解构后的属性不是响应式的；
    - 可以使用 toRef/toRefs 把属性转成响应式的；
2. 示例代码：
    ```HTML
    <script>
    import { reactive } from "vue";
    export default {
      setup() {
        const state = reactive({
          name: "tom",
          age: 25,
        });
    
        return { state };
      },
    };
    </script>
    ```


## ref
>可以把「基本数据类型」数据转成响应式的；
1. 一般用来定义一个基本类型的响应式数据：
    - 如果用 ref（对象/数组）, 内部会自动将「对象/数组」转换为 reactive 的代理对象；
    - ref 内部: 通过给 value 属性添加 getter/setter 来实现对数据的劫持；
2. 如何获取 ref 包装的值：
    - js 中操作数据: `属性.value`；
    - 模板中操作数据: `{{ 属性 }}`；
3. 示例代码：
    ```HTML
    <script>
    import { ref } from "vue";
    export default {
      setup() {
        const count = ref(1);
    
        console.log(count);
    
        return { count };
      },
    };
    </script>
    ```

## reactive 对比 ref
1. ref 可以把「基本数据类型」数据转换成响应式对象，reactive 可以把「引用数据类型」数据转成响应式；
2. ref 返回的对象，重新赋值成对象也是响应式的，reactive 返回的对象，重新赋值丢失响应式；
3. ref 返回的对象结构后还是响应式的，reactive 返回的对象解构后不是响应式的；


## 面试题

### Vue3 为什么用 Proxy 替代 defineProperty？
1. JS 中做属性拦截常见的方式有三种：defineProperty、getter/setter、Proxy；
2. Vue2 中使用 defineProperty 的原因是，2013 年时只能用这种方式，由于该 API 存在一些局限性，比如：
    - 对于数组的拦截有问题，为此 vue 需要专门为数组响应式做一套实现；无法监听原生数组，需要特殊处理，重写覆盖 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse' 的原生方法；
    - 另外不能拦截那些新增、删除属性，需要使用 vue.set, vue.delete；
    - 最后 defineProperty 方案在初始化时需要深度递归遍历待处理的对象才能对它进行完全拦截，明显增加了初始化的时间；
3. 以上两点在 Proxy 出现之后迎刃而解，不仅可以对数组实现拦截，还能对 Map、Set 实现拦截：另外 Proxy 的拦截也是懒处理行为，如果用户没有访问嵌套对象，那么也不会实施拦截，这就让初始化的速度和内存占用都改善了；
4. 当然 Proxy 是有兼容性问题的，IE 完全不支持，所以如果需要 IE 兼容就不合适；

### ref 定义数组和 reactive 定义数组的区别？
1. ref 定义数组
    - 初始化数组
      ```JS
      const arr = ref([1，2，3])
      
      watch(arr.value, () => { // 这个时候通过直接修改和利用数组的方法修改都可以监测到
        console.log('数组变化了')
      })
      const pushArray = () => emptyArray.value.splice(0, 0, 19)
      const changeArrayItem = () => emptyArray.value[0] = 10
      ```
    - 未初始化数组
      ```JS
      const arr = ref([])
      
      // 必须是深度监听，这种写法不仅可以监听数组本身的变化，也可以监听数组元素的变化
      watch( 
        arr,
        () => {
          console.log('空数组变化了')
        },
        {
          deep: true
        }
      )
      const pushArray = () => arr.value.splice(0, 0, { value: 12 })
      const changeArrayItem = () => arr.value[0] = { value: 32 }
      
      onMounted(() => arr.value = [{ value: 5 }, { value: 2 }, { value: 3 }, { value: 4 }]
      ```
2. reactive 定义数组
    - 问题：arr = newArr 这一步使得 arr 失去了响应式的效果
      ```js
      let arr = reactive([])
      
      function change() {
        let newArr = [1, 2, 3]
        arr = newArr
      }
      ```
    - 解决：使用 ref 定义、使用 push 方法、数组外层嵌套一个对象
      ```js
      // 方法一：使用 ref
      let arr = ref([])
      function change() {
        let newArr = [1, 2, 3]
        arr.value = newArr
      }
      
      // 方法二：使用 push 方法
      let arr = reactive([])
      function change() {
        let newArr = [1, 2, 3]
        arr.push(...newArr)
      }
      
      // 方法三：外层嵌套一个对象
      let arr = reactive({ list: [] })
      function change() {
        let newArr = [1, 2, 3]
        arr.list = newArr
      }
      ```