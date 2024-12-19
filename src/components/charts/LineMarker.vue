<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts' // 引入echarts
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    xAxisData: {
      type: Array,
      required: true // 横轴坐标数据 (必须传入)
    },
    seriesData: {
      type: Array,
      required: true, // 四条曲线数据数组
      validator: (value) => value.length === 4 // 需要传入四组数据
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    // 监听数据变化
    seriesData: {
      handler () {
        this.updateChart()
      },
      deep: true
    },
    xAxisData () {
      this.updateChart()
    }
  },
  mounted () {
    // 延迟 1 秒初始化图表
    setTimeout(() => {
      this.initChart()
    }, 1000)
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      this.setOptions()
    },
    setOptions () {
      // 设置 ECharts 配置
      this.chart.setOption({
        backgroundColor: 'rgba(40, 50, 100, 0.1)',
        title: {
          top: 20,
          text: 'Enviromental Parameter',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['温度', '湿度', '光照', '粉尘'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData // 使用父组件传入的横轴数据
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '(Units)',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }
        ],
        series: [
          this.generateSeries('温度', this.seriesData[0], 'rgba(137, 189, 27, 0.3)', 'rgb(137,189,27)'),
          this.generateSeries('湿度', this.seriesData[1], 'rgba(0, 136, 212, 0.3)', 'rgb(0,136,212)'),
          this.generateSeries('光照', this.seriesData[2], 'rgba(219, 50, 51, 0.3)', 'rgb(219,50,51)'),
          this.generateSeries('粉尘', this.seriesData[3], 'rgba(255, 165, 0, 0.3)', 'rgb(255,165,0)')
        ]
      })
    },
    generateSeries (name, data, areaColor, lineColor) {
      return {
        name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: areaColor },
              { offset: 0.8, color: 'rgba(0,0,0,0)' }
            ]),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: lineColor,
            borderColor: lineColor.replace('rgb', 'rgba').replace(')', ',0.2)'),
            borderWidth: 12
          }
        },
        data
      }
    },
    updateChart () {
      if (this.chart) {
        this.setOptions() // 更新图表配置
      }
    }
  }
}
</script>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
