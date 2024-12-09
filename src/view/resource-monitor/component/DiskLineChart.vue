<template>
    <div class="chart-container">
      <!-- 蓝色字体标题 -->
      <h3 class="chart-title">磁盘读写效率</h3>
      <div class="chart-toggle">
        <!-- 按钮切换显示不同的数据组合 -->
        <button @click="showData('GHI')">读取速度</button>
        <button @click="showData('JKL')">写入速度</button>
      </div>
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
    // 接收12个数据值
    dataG: {
      type: Number,
      required: true
    },
    dataH: {
      type: Number,
      required: true
    },
    dataI: {
      type: Number,
      required: true
    },
    dataJ: {
      type: Number,
      required: true
    },
    dataK: {
      type: Number,
      required: true
    },
    dataL: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      // 每组数据的历史数据数组
      dataGHistory: [0, 0, 0, 0, 0, 0],
      dataHHistory: [0, 0, 0, 0, 0, 0],
      dataIHistory: [0, 0, 0, 0, 0, 0],
      dataJHistory: [0, 0, 0, 0, 0, 0],
      dataKHistory: [0, 0, 0, 0, 0, 0],
      dataLHistory: [0, 0, 0, 0, 0, 0],
      updateInterval: 30000, // 每30秒更新一次
      timer: null, // 定时器
      currentDataCombo: 'GHI' // 默认展示 GHI 数据
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(); // 初始化图表
    });

    // 延迟1秒启动定时器
    setTimeout(() => {
      this.startPeriodicUpdate(); // 启动定时器
      this.updateData(); // 初始化时更新一次数据
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
        this.setChartOptions(this.currentDataCombo); // 根据当前选中的数据展示图表
      }
    },

    // 启动定时更新
    startPeriodicUpdate() {
      this.timer = setInterval(() => {
        this.updateData(); // 每30秒更新一次数据
      }, this.updateInterval);
    },

    // 更新图表数据
    updateData() {
      // 将最新数据添加到对应的历史数据数组
      this.dataGHistory.push(this.dataG);
      this.dataHHistory.push(this.dataH);
      this.dataIHistory.push(this.dataI);
      this.dataJHistory.push(this.dataJ);
      this.dataKHistory.push(this.dataK);
      this.dataLHistory.push(this.dataL);

      // 如果历史数据超出7条，则删除最旧数据
      this.checkAndShiftData(this.dataGHistory);
      this.checkAndShiftData(this.dataHHistory);
      this.checkAndShiftData(this.dataIHistory);
      this.checkAndShiftData(this.dataJHistory);
      this.checkAndShiftData(this.dataKHistory);
      this.checkAndShiftData(this.dataLHistory);

      // 更新图表，保持当前选中的数据集
      this.setChartOptions(this.currentDataCombo);
    },

    // 检查并移除历史数据中超出长度的部分
    checkAndShiftData(dataArray) {
      if (dataArray.length > 7) {
        dataArray.shift();
      }
    },

    // 切换数据展示
    showData(dataCombo) {
      this.currentDataCombo = dataCombo; // 更新当前展示的数据集

      const dataSeries = [];
      const legendData = [];
      const dataMap = {
        G: {
          name: 'kctd',
          history: this.dataGHistory,
          itemStyle: {
            normal: {
              color: '#6A0DAD',
              lineStyle: { color: '#6A0DAD', width: 2 }
            }
          }
        },
        H: {
          name: 't2',
          history: this.dataHHistory,
          itemStyle: {
            normal: {
              color: '#FF4500',
              lineStyle: { color: '#FF4500', width: 2 },
            //   areaStyle: { color: '#f3f8ff' }
            }
          }
        },
        I: {
          name: 't3',
          history: this.dataIHistory,
          itemStyle: {
            normal: {
              color: '#1E90FF',
              lineStyle: { color: '#1E90FF', width: 2 },
            //   areaStyle: { color: '#e0f7ea' }
            }
          }
        },
        J: {
          name: 'kctd',
          history: this.dataJHistory,
          itemStyle: {
            normal: {
              color: '#FFC0CB',
              lineStyle: { color: '#FFC0CB', width: 2 }
            }
          }
        },
        K: {
          name: 't2',
          history: this.dataKHistory,
          itemStyle: {
            normal: {
              color: '#98FB98',
              lineStyle: { color: '#98FB98', width: 2 }
            }
          }
        },
        L: {
          name: 't3',
          history: this.dataLHistory,
          itemStyle: {
            normal: {
              color: '#AFEEEE',
              lineStyle: { color: '#AFEEEE', width: 2 }
            }
          }
        }
      };

        // 根据所选数据组合添加数据系列
      for (const char of dataCombo) {
        const { name, history, itemStyle } = dataMap[char];
        legendData.push(name);
        dataSeries.push({
          name,
          itemStyle,
          smooth: true,
          type: 'line',
          data: history
        });
      }

      // 设置图表选项
      this.chart.setOption({
        xAxis: {
          data: ['节点1', '节点2', '节点3', '节点4', '节点5', '节点6', '节点7'], // X轴固定节点
          boundaryGap: false,
          axisTick: { show: false }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 0,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          padding: [5, 10],
          formatter: (params) => {
            // 顶部“节点n”文字居中
            let tooltipContent = `
    <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">
      ${params[0].axisValue}
    </div>
  `;
            params.forEach((item) => {
              tooltipContent += `
      <div style="display: flex; justify-content: space-between; align-items: center; min-width: 100px;">
        <span style="display: inline-block; vertical-align: middle; margin-right: 10px;">${item.marker}</span>
        <span style="flex: 1; text-align: left;">${item.seriesName}</span>
        <span style="text-align: right; padding-left: 30px;">${item.value.toFixed(2)}MB/s</span>
      </div>
    `;
            });
            return tooltipContent;
          },
        },
        yAxis: {
          axisTick: { show: false }
        },
        legend: {
          data: legendData,
        },
        series: dataSeries
      });
    },

    // 设置图表的选项
    setChartOptions(dataCombo) {
      this.showData(dataCombo);
    }
  }
};
</script>

  <style scoped>
  .chart-container {
    text-align: center;
    margin-bottom: 30px;
  }

  .chart-title {
    color: #007bff; /* 设置标题为蓝色字体 */
    font-size: 24px; /* 设置字体大小 */
    margin-bottom: 10px; /* 设置下外边距 */
  }

  .chart-toggle {
    text-align: center;
    margin-bottom: 20px;
  }

  .chart-toggle button {
    padding: 9px 12px;
    border: none;
    background-color: #007bff; /* 设置按钮背景颜色为蓝色 */
    color: #ffffff; /* 设置按钮文字颜色为白色 */
    border-radius: 4px; /* 添加圆角边框 */
    cursor: pointer;
    margin-top: 0px;
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 0px;
  }

  .chart-toggle button:hover {
    background-color: #0056b3; /* 设置按钮的hover状态颜色 */
  }

  </style>
