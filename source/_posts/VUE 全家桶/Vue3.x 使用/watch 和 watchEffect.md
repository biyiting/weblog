---
title: watch 和 watchEffect
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: ef5c59f8
date: 2022-10-05 23:16:51
---
## watch
### 参数列表
1. 第一个参数：要监听的数据（获取值的函数、ref 返回的对象、reactive 返回的对象、数组）；
2. 第二个参数：监听到的数据变化后执行的函数，这个函数有两个参数分别是「旧值」和「新值」；
3. 第三个参数：选项对象，deep 和 immediate；
    - 默认初始时不执行回调, 但可以通过配置 immediate 为 true, 来指定初始时立即执行第一次；
    - 通过配置 deep 为 true, 来指定深度监视；

### 监视 ref 所定义的单个响应式数据
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const fullName = ref('张三');

    watch(fullName, (newValue, oldValue) => {
      // 数据发生改变了  张三 李四
      console.log('数据发生改变了', oldValue, newValue);
    });

    return {
      fullName,
    };
  },
};
</script>
```
### 监视 ref 所定义的多个响应式数据
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const fullName = ref('张三');
    const age = ref(20);

    watch([fullName, age], (newValue, oldValue) => {
      // 数据发生改变了  ['张三', 20]  ['李四', 20]
      console.log('数据发生改变了', oldValue, newValue);
    });

    return {
      fullName,
      age,
    };
  },
};
</script>
```
### 监视 reactive 所定义的响应式数据：
>在这种情况下，watch 属性是强制开启深度监视的，无论数据有多少层，只要数据一改变，在 Vue3 中都是能被监视到的；
>但是在 Vue2 中，如果不开启深度监视的话，watch 属性是无法监视到深层次数据的改变的；
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const mankind = reactive({
      name: '张三',
      age: 18,
      family: {
        brother: {
          one: '李四',
        },
      },
    });

    watch(
      mankind,
      (newValue, oldValue) => {
        console.log('数据发生改变了', oldValue, newValue);
      });
        

    return {
      mankind,
    };
  },
};
</script>
```

### 监视 reactive() 所定义的响应式数据中的某一个属性
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const mankind = reactive({
      name: '张三',
      age: 18,
      family: {
        brother: {
          one: '李四',
        },
      },
    });

    watch(
      () => mankind.name,
      (newValue, oldValue) => {
        // 数据发生改变了 张三 张三1
        console.log('数据发生改变了', oldValue, newValue);
      }
    );

    return {
      mankind,
    };
  },
};
</script>
```

### 监视 reactive() 所定义的响应式数据中的多个属性的改变
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const mankind = reactive({
      name: '张三',
      age: 18,
      family: {
        brother: {
          one: '李四',
        },
      },
    });

    watch(
      [
        () => mankind.name,
        () => mankind.age
      ],
      (newValue, oldValue) => {
        // 数据发生改变了  ['张三', 18] ['张三1', 18]
        console.log('数据发生改变了', oldValue, newValue);
      });

    return {
      mankind,
    };
  },
};
</script>
```

### 监视 reactive() 和 ref 定义的响应式数据中的多个属性的改变
```HTML
<script>
import { computed, reactive, watch, ref } from 'vue';
export default {
  setup() {
    const name = ref('王麻子');
    const mankind = reactive({
      name: '张三',
      age: 18,
      family: {
        brother: {
          one: '李四',
        },
      },
    });

    watch(
      [
        () => mankind.name,
        () => mankind.age,
        name
      ],
      (newValue, oldValue) => {
        // 数据发生改变了 ['张三', 18, '王麻子'] ['张三', 18, '王麻子1']
        console.log('数据发生改变了', oldValue, newValue);
      });

    return {
      mankind,
      name
    };
  },
};
</script>
```

## watchEffect
> watch 函数的简化版，接收一个函数作为参数，监听「函数内响应式数据」的变化；
> 与 watch 相似都可以监听一个数据源，但是 watchEffect 会在初始化的时候调用一次，与 watch 的 immediate 类似；
### watchEffect：立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数；
```HTML
<script>
import { ref, watchEffect } from 'vue';
export default {
  setup() {
    const count = ref(0);
    const count2 = ref(0);

    watchEffect(() => {
      console.log(count.value);
      console.log(count2.value);
    });

    setTimeout(() => {
      count.value++;
      count2.value++;
    }, 1000);

    return { count, count2 };
  },
};
</script>
```
### 清除副作用
>onInvalidate  被调用的时机很微妙：它只作用于异步函数，并且只有在如下两种情况下才会被调用：
> 当 effect 函数被重新调用时；
> 当监听器被注销时（如组件被卸载了）；
```HTML
<template>
  <!-- 开发中需要在侦听函数中执行网络请求，但在网络请求还没达到时停止了侦听器，或者侦听器侦听函数被再次执行了，那么上一次的网络请求应该被取消掉这个时候可以清除上一次的副作用 -->
  <div>
    <p>{{name}}</p>
    <p>{{age}}</p>
    <button @click="updataName">改变</button>
  </div>
</template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  setup() {
    const name = ref('why');
    const age = ref(18);

    const stop = watchEffect(onInvalidate => {
      const timer = setTimeout(() => {
        console.log('网络请求成功');
      }, 2000);

      onInvalidate(() => {
        clearTimeout(timer);
      });
      
      console.log('name:', name.value, 'age:', age.value);
    });

    const updataName = () => {
      name.value = 'wangwy';
      age.value++;
    };

    return {
      updataName,
      name,
      age,
    };
  },
};
</script>
```
### 返回值（停止侦听）：
> 副作用是随着组件加载而发生的，那么组件卸载时，就需要清理这些副作用；
> watchEffect 的返回值 StopHandle 依旧是一个函数，就是用在这个时候，可以在 setup 函数里显式调用，也可以在组件被卸载时隐式调用；
```HTML
<script>
import { ref, watchEffect } from 'vue';
export default {
  setup() {
    const stopHandle = watchEffect(() => {
      /* ... */
    });
    // 之后
    stopHandle();
  },
};
</script>
```


## watch 和 watchEffect 异同
1. watchEffect 立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数，watch 侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数；
2. watchEffect(effect) 是一种特殊 watch，传入的函数既是依赖收集的数据源，也是回调函数，如果不关心响应式数据变化前后的值，只是想拿这些数据做些事情，那么 watchEffect 就是我们需要的，watch 更底层，可以接收多种数据源，包括用于依赖收集的 getter 函数，因此它完全可以实现 watchEffect 的功能，同时由于可以指定 getter 函数，依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时会使用 watch；
3. watchEffect 在使用时，传入的函数会立刻执行一次，watch 默认情况下并不会执行回调函数，除非手动设置 immediate 选项；
4. 从实现上来说，watchEffect(fn) 相当于 watch(fn, fn, { immediate: true })