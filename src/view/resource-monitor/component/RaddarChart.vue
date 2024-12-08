<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons')

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    indicators: {
      type: Array,
      required: true,
      default: () => [
        { name: 'Cpu_kctd', max: 100 },
        { name: 'Cpu_t2', max: 100 },
        { name: 'Cpu_t3', max: 100 },
        { name: 'Memory_kctd', max: 100 },
        { name: 'Memory_t2', max: 100 },
        { name: 'Memory_t3', max: 100 }
      ]
    },
    cpu_kctd: {
      type: Number,
      required: true
    },
    cpu_t2: {
      type: Number,
      required: true
    },
    cpu_t3: {
      type: Number,
      required: true
    },
    memory_kctd: {
      type: Number,
      required: true
    },
    memory_t2: {
      type: Number,
      required: true
    },
    memory_t3: {
      type: Number,
      required: true
    },
    legendData: {
      type: Array,
      required: true,
      default: () => ['负载雷达图']
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.updateChart() // 初始化时更新图表
    },
    updateChart() {
      const seriesData = [
        {
          value: [
            this.cpu_kctd,
            this.cpu_t2,
            this.cpu_t3,
            this.memory_kctd,
            this.memory_t2,
            this.memory_t3
          ],
          name: '负载雷达图'
        }
      ]

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(173, 216, 230, 0.9)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.3)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: this.indicators // 从 props 中接收的动态指标
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.legendData // 从 props 中接收的动态 legend 数据
        },
        series: seriesData.map(item => ({
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [item], // 使用传入的每个 seriesData 项作为数据
          animationDuration: animationDuration
        }))
      })
    }
  },
  watch: {
    // 监听所有相关的 props 数据，当数据发生变化时更新图表
    cpu_kctd() {
      this.updateChart()
    },
    cpu_t2() {
      this.updateChart()
    },
    cpu_t3() {
      this.updateChart()
    },
    memory_kctd() {
      this.updateChart()
    },
    memory_t2() {
      this.updateChart()
    },
    memory_t3() {
      this.updateChart()
    }
  }
}
</script>
