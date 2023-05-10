<template>
  <div class="my-collapse" :class="[border ? 'show-border' : '']">
    <div class="collapse-head" :class="[expandable ? 'pointer' : '']" :style="{ height: headHeight + 'px', 'line-height': headHeight + 'px' }">
      <i @click="changExpand" :class="[expand ? 'transf' : '']" class="el-icon-caret-right" v-if="expandable"></i>

      <span @click="changExpand">{{ title }}</span>

      <div class="right-slot">
        <slot name="head-right"></slot>
      </div>
    </div>
    <el-collapse-transition>
      <div class="collapse-content" v-show="expand">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'Collapse Title',
    },
    defaultExpand: {
      type: Boolean,
      default: true,
    },
    headHeight: {
      type: Number,
      default: 40,
    },
    // 是否有展开的功能
    expandable: {
      type: Boolean,
      default: true,
    },
    // 外层的Border
    border: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const expand = ref(props.defaultExpand);
    const changExpand = () => {
      if (props.expandable) {
        expand.value = !expand.value;
      }
    };
    return {
      expand,
      changExpand,
    };
  },
});
</script>

<style scoped lang="less">
.my-collapse {
  width: 100%;
  margin: 0 0 10px 0;
  @collapseHeadHeight: 40px;
  .collapse-head {
    height: @collapseHeadHeight;
    line-height: @collapseHeadHeight;
    font-size: 14px;
    color: #666;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #eff5f9;
    position: relative;
    > i {
      transition: all ease 0.5s;
    }
    > span {
      margin-left: 6px;
      user-select: none;
      font-size: 20px;
      font-weight: 500;
    }

    .transf {
      transform: rotate(90deg);
    }
    &::before {
      display: none;
      background-color: #4ea6ed;
      position: absolute;
      content: '';
      width: 6px;
      height: 100%;
      left: 0;
      top: 0;
    }
    .right-slot {
      position: absolute;
      right: 15px;
      top: 0;
      height: 100%;
    }
  }
  .pointer {
    > i,
    > span {
      cursor: pointer;
    }
  }
  .collapse-content {
    width: 100%;
    height: auto;
  }
}
.show-border {
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
</style>
