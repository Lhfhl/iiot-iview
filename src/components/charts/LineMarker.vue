<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts' // Import ECharts
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
      required: true // Required horizontal axis data
    },
    seriesData: {
      type: Object, // Pass series data as an object
      required: true,
      validator: (value) => Object.keys(value).length > 0 // Ensure at least one dataset exists
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    // Watch for series data changes
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
    setTimeout(() => {
      this.initChart()
    }, 1000) // Initialize the chart after a delay
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
      const seriesTemplate = {
        temperature: {
          areaColor: 'rgba(137, 189, 27, 0.3)',
          lineColor: 'rgb(137,189,27)'
        },
        humidity: {
          areaColor: 'rgba(0, 136, 212, 0.3)',
          lineColor: 'rgb(0,136,212)'
        },
        co2: {
          areaColor: 'rgba(219, 50, 51, 0.3)',
          lineColor: 'rgb(219,50,51)'
        },
        tvoc: {
          areaColor: 'rgba(255, 165, 0, 0.3)',
          lineColor: 'rgb(255,165,0)'
        },
        pm25: {
          areaColor: 'rgba(156, 39, 176, 0.3)', // 紫色渐变
          lineColor: 'rgb(156,39,176)' // 紫色线条
        }
      }

      // Filter out valid series with data
      const validSeries = Object.keys(this.seriesData)
        .filter(
          (key) =>
            this.seriesData[key] &&
            this.seriesData[key].some(
              (value) => value !== null && value !== undefined
            )
        )
        .map((key) => ({
          name: key,
          data: this.seriesData[key],
          ...seriesTemplate[key] // Match styles from template
        }))

      this.chart.setOption({
        backgroundColor: 'rgba(40, 50, 100, 0.1)',
        title: {
          top: 20,
          text: 'Environmental Parameter',
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
          data: validSeries.map((series) => series.name), // Dynamically generate legend based on valid data
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
            data: this.xAxisData // Use passed x-axis data
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
        series: validSeries.map((series) =>
          this.generateSeries(
            series.name,
            series.data,
            series.areaColor,
            series.lineColor
          )
        ) // Generate series for valid data
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
            borderColor: lineColor
              .replace('rgb', 'rgba')
              .replace(')', ',0.2)'),
            borderWidth: 12
          }
        },
        data
      }
    },
    updateChart () {
      if (this.chart) {
        this.setOptions() // Update chart options
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
