<template>
  <div class="bar-container">
    <div
      ref="barDomRef"
      class="chart-bar"
      :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { EChartsType, EChartsCoreOption } from 'echarts/types/dist/core';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([TitleComponent, TooltipComponent, BarChart, CanvasRenderer, GridComponent]);

export default defineComponent({
  props: {
    w: {
      type: [Number, String],
      default: 'auto'
    },
    h: {
      type: [Number, String],
      default: 250,
    },
    options: {
      type: Object,
      default: () => ({
        color: ['#5483FF'],
        title: {
          text: '--',
          top: '10',
          left: '10',
          textStyle: {
            fontSize: 16,
            color: '#666',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}',
          axisPointer: { type: 'none' },
          textStyle: { fontSize: 12 },
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisTick: { show: false, alignWithLabel: true },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: '--',
            type: 'bar',
            barWidth: '35%',
            label: {
              show: true,
              position: 'top',
              color: '#5483FF',
            },
            data: [10, 52, 200, 334, 380, 330, 220],
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
    const barDomRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (barDomRef.value) {
        myChart = echarts.init(barDomRef.value);
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
        // !!! Note: 采用监听 options 的方式更新图表。使得图表渲染和业务解耦，方便上层根据业务传不同的 options
        // console.log('watch => opts: ', opts);
        if (myChart) {
          myChart.clear();
          myChart.setOption(opts as EChartsCoreOption);
        }
      },
      { deep: true, immediate: true }
    );

    return { barDomRef, chartWidth, chartHeight };
  },
});
</script>

<style lang="less" scoped>
.bar-container {
  .chart-bar {
    margin: 0 auto;
  }
}
</style>
