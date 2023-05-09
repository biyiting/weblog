<template>
  <div class="pie-container">
    <div
      ref="pieDomRef"
      class="chart-pie"
      :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { EChartsType, EChartsCoreOption } from 'echarts/types/dist/core';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([TitleComponent, TooltipComponent, PieChart, CanvasRenderer, LegendComponent]);

export default defineComponent({
  props: {
    w: {
      type: [Number, String],
      default: 'auto',
    },
    h: {
      type: [Number, String],
      default: 250,
    },
    options: {
      type: Object,
      default: () => ({
        color: ['#5483FF', '#6BA6EA', '#31EDB4'],
        title: {
          text: '--',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#666',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
          textStyle: { fontSize: 12 },
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          top: '45%',
          icon: 'circle',
          textStyle: {
            color: '#666',
            fontSize: 12,
          },
        },
        series: [
          {
            type: 'pie',
            radius: '30%',
            data: [
              { name: '已使用', value: 100 },
              { name: '预布局', value: 100 },
              { name: '未布局', value: 100 },
            ],
          },
        ],
      }),
    },
  },
  setup(props) {
    const chartWidth = computed(() => props.w);
    const chartHeight = computed(() => props.h);
    const optionsRef = computed(() => cloneDeep(props.options));

    let myChart: EChartsType;
    const pieDomRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (pieDomRef.value) {
        myChart = echarts.init(pieDomRef.value);
        myChart.setOption(optionsRef.value);
      }
    });
    watch([chartWidth, chartHeight], ([w, h]) => {
      // console.log('watch => wh: ', w, h);
      if (myChart) myChart.resize({ width: w, height: h });
    });
    watch(
      optionsRef,
      opts => {
        // console.log('watch => opts: ', opts);
        if (myChart) {
          myChart.clear();
          myChart.setOption(opts as EChartsCoreOption);
        }
      },
      { deep: true, immediate: true }
    );

    return { pieDomRef, chartWidth, chartHeight };
  },
});
</script>

<style lang="less" scoped>
.pie-container {
  .chart-pie {
    margin: 0 auto;
  }
}
</style>
