<template>
  <div class="slider-view" v-show="!config.hide">
    <div class="title">
      <el-tooltip placement="top" effect="light" v-if="config.tips.length>0" v-model="clickFlag" manual="true">
        <template #content>{{config.tips}}</template>
        <span v-if="config.tips.length>0" class="icon" @click="clickFlag = !clickFlag"/>
      </el-tooltip>
      <span>{{ config.label }}:</span>
    </div>
    <el-input-number
      style="margin: 10px 0;"
      size="small"
      v-model="number"
      :min="config.min"
      :step="config.step"
      :max="config.max"
      :precision="config.precision"
    />
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
export default defineComponent({
  name: 'CustomNumberInput',
  props: {
    id: String,
    parentWidgets: Array,
    config: {
      type: Object,
      default: () => ({
        formMap: {
          name: '',
          value: '',
        },
        precision: 1,
        step: 0.1,
        min: 0,
        max: 1,
        tips: 'aaa',
        label: '请配置 label 名称',
        defaultVal: 20,
      }),
    },
  },
  setup(props, context) {
    const clickFlag = ref(false);
    const number = ref(props.config?.formMap?.value || props.config?.min || 1);

    const getWidgetConfigByName = name => {
      let allWidgetList = props.parentWidgets.map(it => it.widgetList).flat(Infinity);
      return allWidgetList.find(it => it.config.formMap.name === name);
    };

    const getWidgetValueByName = name => {
      return getWidgetConfigByName(name).config.formMap.value;
    };

    // 字符串代码引擎
    const codeStringEngine = rule => {
      if (!rule) return; // 没有配置
      console.log(props.config.customValida);

      let content = props.config.customValida.codeString;

      // 替换 {name1} 成为name1的值
      // $0, $1=> {name1} name1
      content = content.replace(/{{(.+?)}}/g, ($0, $1) => `'${getWidgetValueByName($1)}'`);
      content = content.replace(/##(.+?)##/g, ($0, $1) => `getWidgetConfigByName('${$1}')`);

      console.log(content);

      const fn = new Function('radioVal', 'props', 'getWidgetConfigByName', content);
      fn(radioVal, props, getWidgetConfigByName);
    };

    watch(
      number,
      () => {
        Object.assign(props.config.formMap, { value: number.value });

        codeStringEngine(props.config.customValida); // 代码引擎解析字符串代码（组件之间的联动）
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.config?.formMap?.value,
      () => {
        number.value = props.config?.formMap?.value;
      },
      {
        immediate: true,
      }
    );

    // 每个组件都要有
    const validateFn = () => number.value !== '';

    return { number, validateFn ,clickFlag};
  },
});
</script>

<style lang="less" scoped>
.slider-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 14px;
    font-weight: 500;
  }
  .icon {
    background-image: url('../../assets/icons/questionIcon.svg');
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    vertical-align: bottom;
    margin-right: 5px;
  }
}
</style>
