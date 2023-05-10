<template>
  <div class="slider-view">
    <div class="title">
      <el-tooltip placement="top" effect="light" v-if="config.tips.length>0" v-model="clickFlag" manual="true">
        <template #content>{{config.tips}}</template>
        <span v-if="config.tips.length>0" class="icon" @click="clickFlag = !clickFlag"/>
      </el-tooltip>
      <span>{{ config.label }}:</span>
    </div>
    <div style="display: flex;align-items: center;">
      <el-slider
        style="width: 240px;"
        :min="config.min"
        :max="config.max"
        :step="config.step"
        size="small"
        v-model="sliderVal"
      />
      <div style="margin-left:10px">{{sliderVal}}</div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'CustomSlider',
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
        // customValida: {
        //   codeString: `if({name1}*{name2}<250){
        //                 ElMessage.warning('IT柜数量 * IT单柜功率 要小于 250，请重新选择');
        //                 {name1} = '';
        //                 return;
        //   }`,
        // },
        min: 10,
        max: 80,
        step: 2,
        tips: 'aaa',
        label: '请配置 label 名称',
      }),
    },
  },
  setup(props, context) {
    const clickFlag = ref(false);
    const sliderVal = ref('');

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
      content = content.replace(/{{(.+?)}}/g, ($0, $1) => getWidgetValueByName($1));
      content = content.replace(/##(.+?)##/g, ($0, $1) => `getWidgetConfigByName('${$1}')`);

      console.log(content);

      const fn = new Function('ElMessage', 'sliderVal', 'props', 'getWidgetConfigByName', content);
      fn(ElMessage, sliderVal, props, getWidgetConfigByName);
    };

    watch(
      () => props.config?.formMap?.value,
      () => {
        sliderVal.value = props.config?.formMap?.value;
      },
      {
        immediate: true,
      }
    );

    watch(
      sliderVal,
      () => {
        Object.assign(props.config.formMap, { value: sliderVal.value });
        codeStringEngine(props.config.customValida); // 代码引擎解析字符串代码（组件之间的联动）
      },
      {
        immediate: true,
      }
    );

    // 每个组件都要有
    const validateFn = () => sliderVal.value !== '';

    return { sliderVal, validateFn,clickFlag };
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
