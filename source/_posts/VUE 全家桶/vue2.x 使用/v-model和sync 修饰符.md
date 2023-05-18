---
title: v-model 和 sync 修饰符
categories:
  - VUE 全家桶
  - vue2.x 使用
tags:
  - vue2
abbrlink: f44acef0
date: 2022-09-25 19:46:38
---

## v-model 的本质
1. v-model 的本质上来说就是一个语法糖；
2. 示例代码：
    ```HTML
    <!-- 目前写法 -->
    <input v-model="val" type="text"/>
    
    <!-- 实质上的完整写法 -->
    <input :value="val" @input="val=$event.target.value" />
    ```

## v-model 双向绑定以及它的实现原理
1. vue 中双向绑定是一个指令 v-model，可以绑定一个动态值到视图，同时视图中变化能改变该值，v-model是语法糖，默认情况下相当于 :value 和 @input；
2. 使用 v-model 可以减少大量繁琐的事件处理代码，提高开发效率，还可以结合 .lazy、.number、.trim 对 v-model 的行为做进一步的限制,通常在表单项上使用 v-model，还可以在自定义组件中使用；
3. 原生的表单项可以直接使用 v-model，自定义组件上如果要使用它需要在组件内绑定 value 并处理输入事件；
4. 做过测试，输出包含 v-model 模板的组件渲染函数，发现它会被转换为 value 属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，这说明神奇魔法实际上是 vue 的编译器完成的；
    - input 为 text 类型，事件为 input 事件；
    - input 为 checkbox 等其他类型，事件为 change 事件；
5. 示例代码：
    ```HTML
    <div id="demo">
        <input type="text" v-model="foo">
        <input type="checkbox" v-model="bar">
        <select v-model="baz">
            <option value="vue">vue</option>
            <option value="react">react</option>
        </select>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <script>
        // 创建实例
        const app = new Vue({
            el: '#demo',
            data: {
                foo: 'foo',
                bar: true,
                baz: 'react'
            }
        });
        console.log(app.$options.render);
    </script>
    ```
    ```JS
    // <input type="text" v-model="foo">
    _c('input', {
        directives: [{ name: "model", rawName: "v-model", value: (foo), expression: "foo" }],
        attrs: { "type": "text" },
        domProps: { "value": (foo) },
        on: {
            "input": function ($event) {
                if ($event.target.composing) return;
                foo = $event.target.value
            }
        }
    })
    ```
    ```JS
    // <input type="checkbox" v-model="bar">
    _c('input', {
        directives: [{ name: "model", rawName: "v-model", value: (bar), expression: "bar" }],
        attrs: { "type": "checkbox" },
        domProps: {
            "checked": Array.isArray(bar) ? _i(bar, null) > -1 : (bar)
        },
        on: {
            "change": function ($event) {
                var $$a = bar, $$el = $event.target, $$c = $$el.checked ? (true) : (false);
                if (Array.isArray($$a)) {
                    var $$v = null, $$i = _i($$a, $$v);
                    if ($$el.checked) { $$i < 0 && (bar = $$a.concat([$$v])) }
                    else {
                        $$i > -1 && (bar = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
                    }
                } else {
                    bar = $$c
                }
            }
        }
    })
    ```
    ```JS
    // <select v-model="baz">
    //     <option value="vue">vue</option>
    //     <option value="react">react</option>
    // </select>
    _c('select', {
        directives: [{ name: "model", rawName: "v-model", value: (baz), expression: "baz" }],
        on: {
            "change": function ($event) {
                var $$selectedVal = Array.prototype.filter.call(
                    $event.target.options,
                    function (o) { return o.selected }
                ).map(
                    function (o) {
                        var val = "_value" in o ? o._value : o.value;
                        return val
                    }
                );
                baz = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
            }
        }
    }, [
        _c('option', { attrs: { "value": "vue" } }, [_v("vue")]), _v(" "),
        _c('option', { attrs: { "value": "react" } }, [_v("react")])
    ])
    ```

## 利用 v-model 实现父子组件属性的双向绑定
1. 父传子：在子组件上使用 v-model，子组件 props 接收的值必须是 value，写成其他名字将无法使用；
2. 子传父：在子组件上定义一个自定义的事件，通过在子组件中使用 $emit('自定义事件名',值) 的方法将值传入父组件；
3. 一般情况下的父向子传值，子组件中是不能直接修改的，直接修改这个值控制台会报错；
4. 示例代码：
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        <son v-model="num" @input="val=>num=val" />
      </div>
    </template>
    <script>
    import son from "./son.vue";
    export default {
      components: {
        son,
      },
      data() {
        return {
          num: 100,
        };
      },
    };
    </script>
    ```
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        我是son组件里面接收到的值: {{ value }}
        <button @click="$emit('input', value + 1)">点我value+1</button>
      </div>
    </template>
    <script>
    export default {
      props: {
        value: {
          type: Number,
          required: true,
        },
      },
    };
    </script>
    ```

## 自定义组件使用 v-model 想要改变事件名或者属性名该怎么做
1. vue3 语法糖自定义组件使用 v-model；
2. 默认情况下，组件上的 v-model 使用 modelValue 作为 prop 和 update:modelValue 作为事件，可以通过向 v-model 传递参数来修改这些名称；
3. 可实现多个属性的双向数据绑定；
4. 示例代码：
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        {{ bookTitle }}-------{{ name }}
        <son v-model:title="bookTitle" v-model:name="name"></son>
      </div>
    </template>
    <script setup>
    import Son from './son';
    import { ref } from 'vue';
    const bookTitle = ref('hello vue3');
    const name = ref('张三');
    </script>
    ```
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        <input type="text" :value="title" @input="emits('update:title', $event.target.value)" />
        <input type="text" :value="name" @input="emits('update:name', $event.target.value)" />
      </div>
    </template>
    <script setup>
    import { defineProps, defineEmits } from 'vue';
    const emits = defineEmits(['update:title', 'update:name']);
    defineProps({
      name: {
        type: String,
      },
      title: String,
    });
    </script>
    ```

## 利用 sync 实现父子组件属性的双向绑定（vue3 中废除）
1. 相比较与 v-model 来说，sync 修饰符就简单很多了；
2. .sync 修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值；
3. 示例代码：
    ```HTML
    <!-- 父组件 -->
    <template>
      <div>
        {{ bookTitle }}-------{{ name }}
        <son :title.sync="bookTitle" :name.sync="name"></son>
        <!-- 等价于
            <son 
                :title="num" @update:title="val=>num=val" 
                :name="num2" @update:name="val=>num2=val">
            </son> -->
      </div>
    </template>
    <script>
    import Son from "./son.vue";
    export default {
      components: {
        Son,
      },
      data() {
        return {
          name: "张三",
          bookTitle: "hello vue2",
        };
      },
    };
    </script>
    ```
    ```HTML
    <!-- 子组件 -->
    <template>
      <div>
        <input type="text" :value="sonTitle" @input="$emit('update:title', $event.target.value)"/>
        <input type="text" :value="sonName" @input="$emit('update:name', $event.target.value)"/>
      </div>
    </template>
    <script>
    export default {
      props: {
        name: String,
        bookTitle: String,
      },
      data() {
        return {
          sonTitle: "",
          sonName: "",
        };
      },
    };
    </script>
    ```

## v-model 和 sync 修饰符有什么区别
1. 相同点：都是语法糖，都可以实现父子组件中的数据的双向通信；
2. 区别点：
    - 格式不同；
    - 双绑属性个数不同：
      - vue2 中 v-model 只能实现一个，属性名必须是 value，vue3 中可以实现多个属性，名字事件可自定义；
      - vue2 中 .sync 可以有多个，vue3 废除；
