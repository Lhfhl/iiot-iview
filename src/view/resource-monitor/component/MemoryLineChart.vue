<template>
  <div class="chart-container">
    <!-- 蓝色字体标题 -->
    <h3 class="chart-title">Memory负载情况</h3>
    <div ref="chartContainer" :class="className" :style="{height: height, width: width}"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import resize from './mixins/resize';
require('echarts/theme/macarons');

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // 只保留ABC数据
    dataA: {
      type: Number,
      required: true
    },
    dataB: {
      type: Number,
      required: true
    },
    dataC: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      // 只保留ABC的数据历史记录
      dataAHistory: [0, 0, 0, 0, 0, 0],
      dataBHistory: [0, 0, 0, 0, 0, 0],
      dataCHistory: [0, 0, 0, 0, 0, 0],
      timestamps: ['00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00'], // 横坐标时间点
      updateInterval: 30000, // 每30秒更新一次
      timer: null, // 用于存储定时器
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(); // 初始化图表
    });

    // 延迟1秒开始定时器检查数据
    setTimeout(() => {
      this.startPeriodicUpdate(); // 启动定时器
      this.updateData(); // 初始化时立即更新一次数据
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 清除定时器，防止内存泄漏
    }

    if (this.chart) {
      this.chart.dispose(); // 销毁图表实例
      this.chart = null;
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      const chartContainer = this.$refs.chartContainer;
      if (chartContainer) {
        this.chart = echarts.init(chartContainer, 'macarons');
        this.setChartOptions(); // 初始化时显示ABC数据
      }
    },

    // 启动定时更新
    startPeriodicUpdate() {
      this.timer = setInterval(() => {
        this.updateData(); // 每30秒更新一次数据
      }, this.updateInterval);
    },

    // 更新图表的数据
    updateData() {
      // 获取当前时间并格式化
      const now = new Date();
      const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      // 添加时间点到横坐标数组
      this.timestamps.push(formattedTime);
      if (this.timestamps.length > 7) {
        this.timestamps.shift(); // 如果超过7个，移除最旧的时间点
      }

      // 将新数据添加到历史数据数组末尾
      this.dataAHistory.push(this.dataA);
      this.dataBHistory.push(this.dataB);
      this.dataCHistory.push(this.dataC);

      // 对每个历史数据数组进行长度判断，超出7个则移除最旧数据
      this.checkAndShiftData(this.dataAHistory);
      this.checkAndShiftData(this.dataBHistory);
      this.checkAndShiftData(this.dataCHistory);

      // 更新图表
      this.setChartOptions();
    },

    // 检查并移除历史数据数组中超出长度的数据
    checkAndShiftData(dataArray) {
      if (dataArray.length > 7) {
        dataArray.shift();
      }
    },

    // 设置图表的选项
    setChartOptions() {
      const dataSeries = [
        {
          name: 'kctd',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FF8C00',
              lineStyle: { color: '#FF8C00', width: 2 }
            }
          },
          data: this.dataAHistory
        },
        {
          name: 't2',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#9400D3',
              lineStyle: { color: '#9400D3', width: 2 },
              // areaStyle: { color: '#f3f8ff' }
            }
          },
          data: this.dataBHistory
        },
        {
          name: 't3',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#00FFFF',
              lineStyle: { color: '#00FFFF', width: 2 },
              // areaStyle: { color: '#e0f7ea' }
            }
          },
          data: this.dataCHistory
        }
      ];

      this.chart.setOption({
        xAxis: {
          data: this.timestamps, // 使用时间点作为横坐标
          boundaryGap: false,
          axisTick: { show: false }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 30,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          padding: [5, 10],
          formatter: (params) => {
            let tooltipContent = `
              <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">
                ${params[0].axisValue} <!-- 时间点显示在顶部 -->
              </div>
            `;
            params.forEach((item) => {
              tooltipContent += `
                <div style="display: flex; justify-content: space-between; align-items: center; min-width: 100px;">
                  <span style="display: inline-block; vertical-align: middle; margin-right: 10px;">${item.marker}</span>
                  <span style="flex: 1; text-align: left;">${item.seriesName}</span>
                  <span style="text-align: right; padding-left: 30px;">${item.value.toFixed(2)}%</span>
                </div>
              `;
            });
            return tooltipContent;
          }
        },
        yAxis: {
          axisTick: { show: false }
        },
        legend: {
          data: ['kctd', 't2', 't3'],
        },
        series: dataSeries
      });
    }
  }
};
</script>

<style scoped>
.chart-container {
  text-align: center;
  margin-bottom: 0px;
}

.chart-title {
  color: #007bff; /* 设置标题为蓝色字体 */
  font-size: 24px; /* 设置字体大小 */
  margin-bottom: -10px;
  margin-top: -10px;
}

.chart-container div {
  margin-top: 15px; /* 上外边距 */
}
</style>
