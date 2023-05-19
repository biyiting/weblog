---
title: TS 与选项式 API
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: 56eca6a3
date: 2022-10-05 20:00:51
---
## 为组件的 props 标注类型
1. 选项式 API 中对 props 的类型推导需要用  defineComponent() 来包装组件，有了它，Vue 才可以通过  props  以及一些额外的选项，比如  required: true  和  default  来推导出 props 的类型：
2. 然而，这种运行时  props  选项仅支持使用构造函数来作为一个 prop 的类型——没有办法指定多层级对象或函数签名之类的复杂类型；
    ```JS
    import { defineComponent } from 'vue'
    export default defineComponent({
      // 启用了类型推导
      props: {
        name: String,
        id: [Number, String],
        msg: { type: String, required: true },
        metadata: null
      },
      mounted() {
        this.name // 类型：string | undefined
        this.id // 类型：number | string | undefined
        this.msg // 类型：string
        this.metadata // 类型：any
      }
    })
    ```
3. 可以使用  PropType  这个工具类型来标记更复杂的 props 类型；
    ```JS
    import { defineComponent } from 'vue'
    import type { PropType } from 'vue'
    interface Book {
      title: string
      author: string
      year: number
    }
    export default defineComponent({
      props: {
        book: {
          // 提供相对 `Object` 更确定的类型
          type: Object as PropType<Book>,
          required: true
        },
        // 也可以标记函数
        callback: Function as PropType<(id: number) => void>
      },
      mounted() {
        this.book.title // string
        this.book.year // number
        // TS Error: argument of type 'string' is not
        // assignable to parameter of type 'number'
        this.callback?.('123')
      }
    })
    ```