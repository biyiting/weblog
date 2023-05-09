<template>
  <div class="input-check-view" v-show="!config.hide">
    <div class="title">
      <el-tooltip placement="top" effect="light" v-if="config.tips.length>0" v-model="clickFlag" manual="true">
        <template #content>{{config.tips}}</template>
        <span v-if="config.tips.length>0" class="icon" @click="clickFlag = !clickFlag"/>
      </el-tooltip>
      <span>{{ config.label }}:</span>
    </div>
    <div style="display: flex; margin-top: 10px;">
      <el-input
        :class="{active: activeWidgetVal ==='input'}"
        style="width: 106px;"
        size="small"
        v-model="inputVal"
        :placeholder="config.placeholder"
        clearable
        @focus="inputFocus"
        @change="inputFocus"
      />
      <label :class="{btn:true, active: activeWidgetVal ==='btn'}" @click="noConfigHandel">不配置</label>
    </div>
  </div>
</template>
<script>
import { init } from 'echarts/core';
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
export default defineComponent({
  name: 'CustomInputCheck',
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
        tips: 'aaa',
        label: '请配置 label 名称',
        defaultVal: 20,
      }),
    },
  },
  setup(props, context) {
    const clickFlag = ref(false);
    props.config?.formMap?.value || '';
    const inputVal = ref('');
    const radioVal = ref('不配置');
    const widgetVal = ref('');
    const activeWidgetVal = ref(''); // 组件类型

    // 根据配置初始化属性值
    const initValue = () => {
      if (props.config?.formMap?.value !== '') {
        widgetVal.value = props.config?.formMap?.value;
        if (props.config?.formMap?.value === '不配置') {
          activeWidgetVal.value = 'btn';
        } else if (!isNaN(Number(props.config?.formMap?.value))) {
          inputVal.value = props.config?.formMap?.value;
          activeWidgetVal.value = 'input';
        }
      }
    };
    initValue();


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
      widgetVal,
      () => {
        Object.assign(props.config.formMap, { value: widgetVal.value });

        codeStringEngine(props.config.customValida); // 代码引擎解析字符串代码（组件之间的联动）
      },
      {
        immediate: true,
      }
    );

    const noConfigHandel = () => {
      inputVal.value = '';
      activeWidgetVal.value = 'btn';
      widgetVal.value = radioVal.value;
    };
    const inputFocus = () => {
      activeWidgetVal.value = 'input';
      widgetVal.value = inputVal.value;
    };

    // 每个组件都要有
    const validateFn = () => widgetVal.value !== '';

    return { inputVal, radioVal, activeWidgetVal, validateFn, noConfigHandel, inputFocus ,clickFlag};
  },
});
</script>

<style lang="less" scoped>
.input-check-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
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
  .btn {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgb(220, 223, 230);
    border-radius: 2px 4px 4px 2px;
    padding: 0 35px;
    &:hover {
      border: 1px solid #409eff !important;
    }
  }
  .active {
    border: 1px solid #409eff !important;
  }
}
::v-deep(.el-input--small .el-input__inner) {
  border-radius: 4px 2px 2px 4px !important;
  border-right: none !important;
}
::v-deep(.el-input--small .el-input__inner:hover) {
  border: 0.5px solid #409eff !important;
  border-radius: 4px 2px 2px 4px !important;
}
</style>
