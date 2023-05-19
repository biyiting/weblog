---
title: computed
categories:
  - VUE 全家桶
  - vue3.x 使用
tags:
  - vue
abbrlink: 564cwqw12f7
date: 2022-10-05 22:16:51
---

## 第一种用法：只是完成了读的功能
```HTML
<script>
import { computed, reactive } from 'vue';
export default {
  setup() {
    let per = reactive({
      surname: '勇敢',
      name: '小陈',
    });

    per.fullName = computed(() => {
      return per.surname + '~' + per.name;
    });

    return {
      per,
    };
  },
};
</script>
```


## 第二种用法：完成了读和写的功能
```HTML
<script>
import { computed, reactive } from 'vue';
export default {
  setup() {
    let per = reactive({
      surname: '勇敢',
      name: '小陈',
    });

    per.fullName = computed({
      get() {
        return per.surname + '~' + per.name;
      },
      set(value) {
        var arr = value.split('~');
        per.surname = arr[0];
        per.name = arr[1];
      },
    });

    return {
      per,
    };
  },
};
</script>
```