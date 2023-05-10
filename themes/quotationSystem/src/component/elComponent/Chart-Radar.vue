<template>
  <div class="radar-container">
    <div
      ref="radarDomRef"
      class="chart-radar"
      :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { EChartsType, EChartsCoreOption } from 'echarts/types/dist/core';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([TitleComponent, TooltipComponent, RadarChart, CanvasRenderer]);

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
        title: {
          text: '--',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#666',
          },
        },
        tooltip: {},
        radar: {
          radius: '30%',
          name: {
            textStyle: {
              color: '#666',
            },
          },
          indicator: [
            { name: '--', max: 5 },
            { name: '--', max: 5 },
            { name: '--', max: 5 },
            { name: '--', max: 5 },
            { name: '--', max: 5 },
          ],
          splitArea: {
            show: true,
            areaStyle: { color: ['#fff'] },
          },
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                name: '--',
                symbolSize: 0,
                lineStyle: { color: '#5483FF' },
                areaStyle: { color: '#AAC1FF' },
                value: [3, 2, 2.5, 2, 4],
              },
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
    const radarDomRef = ref<HTMLElement | null>(null);

    // optionsRef.value.series[0].data[0].name = radarTitle.value;

    onMounted(() => {
      if (radarDomRef.value) {
        myChart = echarts.init(radarDomRef.value);
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
    return { radarDomRef, chartWidth, chartHeight };
  },
});
</script>

<style lang="less" scoped>
.radar-container {
  .chart-radar {
    margin: 0 auto;
  }
}
</style>
