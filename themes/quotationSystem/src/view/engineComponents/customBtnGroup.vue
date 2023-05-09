<template>
  <div class="radio-group-view" v-show="!config.hide">
    <div class="title">
      <el-tooltip placement="top" effect="light" v-if="config.tips.length>0" v-model="clickFlag" manual="true">
        <template #content>{{config.tips}}</template>
        <span v-if="config.tips.length>0" class="icon" @click="clickFlag = !clickFlag"/>
      </el-tooltip>
      <span>{{ config.label }}:</span>
    </div>
    <div style="margin-top: 10px">
      <el-radio-group v-model="radioVal" size="small">
        <el-radio-button
          class="radio-item"
          v-for="item in config.options"
          :key="item.label"
          :label="item.value"
        >{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
export default defineComponent({
  name: 'CustomBtnGroup',
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
        options: [
          { label: '1100', value: '1100' },
          { label: '1200', value: '1200' },
          { label: '1300', value: '1300' },
          { label: '1400', value: '1400' },
          { label: '1500', value: '1500' },
          { label: '1600', value: '1600' },
        ],
      }),
    },
  },
  setup(props, context) {
    const clickFlag = ref(false);
    const radioVal = ref(props.config?.formMap?.value || '');

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
      () => props.config?.formMap?.value,
      () => {
        radioVal.value = props.config?.formMap?.value;
      },
      {
        immediate: true,
      }
    );

    watch(
      radioVal,
      () => {
        Object.assign(props.config.formMap, { value: radioVal.value });

        codeStringEngine(props.config.customValida); // 代码引擎解析字符串代码（组件之间的联动）
      },
      {
        immediate: true,
      }
    );

    // 每个组件都要有
    const validateFn = () => radioVal.value !== '';

    return { radioVal, validateFn ,clickFlag};
  },
});
</script>

<style lang="less" scoped>
.radio-group-view {
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

  .radio-item {
    box-sizing: border-box;
    &:hover {
      border: 0.5px solid #409eff !important;
      border-radius: 4px !important;
    }
  }
}
::v-deep(.el-radio-group > label) {
  margin: 0 5px !important;
}
::v-deep .el-radio-button .el-radio-button__inner {
  border-radius: 4px;
  border: 1px solid rgb(220, 223, 230);
}
::v-deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  border: 1px solid #409eff !important;
  background-color: #fff !important;
  color: #000 !important;
}
</style>
