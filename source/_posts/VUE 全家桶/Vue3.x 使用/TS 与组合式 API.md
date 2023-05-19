---
title: TS 与组合式 API
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: '683412e2'
date: 2022-10-05 20:16:51
---

## 为组件的 props 标注类型
1. 通过泛型参数来定义 props 的类型
    ```HTML
    <script setup lang="ts">
      interface Props {
        foo: string
        bar?: number
      }
      const props = defineProps<Props>()
    </script>
    ```
2. 使用基于类型的声明时，会失去为 props 声明默认值的能力，这可以通过 withDefaults 编译器宏解决：
    ```HTML
    <script lang="ts">
      export interface Props {
        msg?: string
        labels?: string[]
      }
    
      const props = withDefaults(defineProps<Props>(), {
        msg: 'hello',
        labels: () => ['one', 'two']
      })
    </script>
    ```

## 为组件的 emits 标注类型
> 在 \<script setup> 中，emit 函数的类型标注也可以通过运行时声明或是类型声明进行；
```HTML
<script setup lang="ts">
  // 运行时
  const emit = defineEmits(['change', 'update'])

  // 基于类型
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()
</script>
```

## 为 ref() 标注类型
1. ref 会根据初始化时的值推导其类型：
    ```TS
    import { ref } from 'vue'
    
    // 推导出的类型：Ref<number>
    const year = ref(2020)
    // => TS Error: Type 'string' is not assignable to type 'number'.
    year.value = '2020'
    ```
2. 有时可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 Ref 这个类型：
    ```TS
    import { ref } from 'vue'
    import type { Ref } from 'vue'
    
    const year: Ref<string | number> = ref('2020')
    year.value = 2020 // 成功！
    ```
3. 或者，在调用 ref() 时传入一个泛型参数，来覆盖默认的推导行为：
    ```TS
    import { ref } from 'vue'
    
    // 得到的类型：Ref<string | number>
    const year = ref < string | number > ('2020')
    year.value = 2020 // 成功！
    ```
4. 如果指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含 undefined 的联合类型：
    ```TS
    import { ref } from 'vue'
    
    // 推导得到的类型：Ref<number | undefined>
    const n = ref < number > ()
    ```

## 为 reactive() 标注类型
1. reactive() 也会隐式地从它的参数中推导类型：
    ```TS
    import { reactive } from 'vue'
    
    // 推导得到的类型：{ title: string }
    const book = reactive({ title: 'Vue 3 指引' })
    ```
2. 要显式地标注一个 reactive 变量的类型，可以使用接口：
    ```TS
    import { reactive } from 'vue'
    
    interface Book {
      title: string
      year?: number
    }
    const book: Book = reactive({ title: 'Vue 3 指引' })
    ```

## 为 computed() 标注类型
1. computed() 会自动从其计算函数的返回值上推导出类型：
    ```TS
    import { ref, computed } from 'vue'
    
    const count = ref(0)
    // 推导得到的类型：ComputedRef<number>
    const double = computed(() => count.value * 2)
    // => TS Error: Property 'split' does not exist on type 'number'
    const result = double.value.split('')
    ```
2. 还可以通过泛型参数显式指定类型：
    ```TS
    const double = computed < number > (() => {
      // 若返回值不是 number 类型则会报错
    })
    ```

## 为事件处理函数标注类型
1. 在处理原生 DOM 事件时，应该为传递给事件处理函数的参数正确地标注类型：
    ```HTML
    <template>
      <input type="text" @change="handleChange" />
    </template>
    <script setup lang="ts">
      function handleChange(event) {
        // `event` 隐式地标注为 `any` 类型
        console.log(event.target.value)
      }
    </script>
    ```
2. 显式地为事件处理函数的参数标注类型，此外，可能需要显式地强制转换  event  上的属性：
    ```TS
    function handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
    ```

## 为模板引用标注类型
1. 模板引用需要通过一个显式指定的泛型参数和一个初始值 null 来创建：
    ```HTML
    <template>
      <input ref="el" />
    </template>
    <script setup lang="ts">
      import { ref, onMounted } from 'vue';
      const el = ref<HTMLInputElement | null>(null);
    
      onMounted(() => {
        el.value?.focus();
      });
    </script>
    ```
2. 为了严格的类型安全，有必要在访问  el.value  时使用可选链或类型守卫，这是因为直到组件被挂载前，这个 ref 的值都是初始的  null，并且在由于  v-if  的行为将引用的元素卸载时也可以被设置为 null；
