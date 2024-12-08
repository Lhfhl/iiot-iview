<template>
  <div class="chart-toggle">
    <button @click="showData('ABC')">网络下行速率</button>
    <button @click="showData('DEF')">网络上行速率</button>
    <button @click="showData('GHI')">磁盘读取速度</button>
    <button @click="showData('JKL')">磁盘写入速度</button>
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
    // 新增接收12个单一数值
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
    },
    dataD: {
      type: Number,
      required: true
    },
    dataE: {
      type: Number,
      required: true
    },
    dataF: {
      type: Number,
      required: true
    },
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
      // 新增对应12个数据的历史数据数组
      dataAHistory: [0, 0, 0, 0, 0, 0],
      dataBHistory: [0, 0, 0, 0, 0, 0],
      dataCHistory: [0, 0, 0, 0, 0, 0],
      dataDHistory: [0, 0, 0, 0, 0, 0],
      dataEHistory: [0, 0, 0, 0, 0, 0],
      dataFHistory: [0, 0, 0, 0, 0, 0],
      dataGHistory: [0, 0, 0, 0, 0, 0],
      dataHHistory: [0, 0, 0, 0, 0, 0],
      dataIHistory: [0, 0, 0, 0, 0, 0],
      dataJHistory: [0, 0, 0, 0, 0, 0],
      dataKHistory: [0, 0, 0, 0, 0, 0],
      dataLHistory: [0, 0, 0, 0, 0, 0],
      updateInterval: 30000, // 每30秒更新一次
      timer: null, // 用于存储定时器
      currentDataCombo: 'ABC' // 默认展示 ABC 数据
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
        this.setChartOptions(this.currentDataCombo); // 初始化时根据currentDataCombo展示数据
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
      // 分别将12个最新的数据添加到对应的历史数据数组末尾
      this.dataAHistory.push(this.dataA);
      this.dataBHistory.push(this.dataB);
      this.dataCHistory.push(this.dataC);
      this.dataDHistory.push(this.dataD);
      this.dataEHistory.push(this.dataE);
      this.dataFHistory.push(this.dataF);
      this.dataGHistory.push(this.dataG);
      this.dataHHistory.push(this.dataH);
      this.dataIHistory.push(this.dataI);
      this.dataJHistory.push(this.dataJ);
      this.dataKHistory.push(this.dataK);
      this.dataLHistory.push(this.dataL);

      // 对每个历史数据数组进行长度判断，超出7个则移除最旧数据
      this.checkAndShiftData(this.dataAHistory);
      this.checkAndShiftData(this.dataBHistory);
      this.checkAndShiftData(this.dataCHistory);
      this.checkAndShiftData(this.dataDHistory);
      this.checkAndShiftData(this.dataEHistory);
      this.checkAndShiftData(this.dataFHistory);
      this.checkAndShiftData(this.dataGHistory);
      this.checkAndShiftData(this.dataHHistory);
      this.checkAndShiftData(this.dataIHistory);
      this.checkAndShiftData(this.dataJHistory);
      this.checkAndShiftData(this.dataKHistory);
      this.checkAndShiftData(this.dataLHistory);

      // 更新图表，保持当前选中的数据集
      this.setChartOptions(this.currentDataCombo);
    },

    // 检查并移除历史数据数组中超出长度的数据
    checkAndShiftData(dataArray) {
      if (dataArray.length > 7) {
        dataArray.shift();
      }
    },

    // 根据传入的字符组合展示相应的数据
    showData(dataCombo) {
      this.currentDataCombo = dataCombo; // 更新当前数据集

      const dataSeries = [];
      const legendData = [];
      const dataMap = {
        A: {
          name: 'ktcd',
          history: this.dataAHistory,
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: { color: '#FF005A', width: 2 }
            }
          }
        },
        B: {
          name: 't2',
          history: this.dataBHistory,
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: { color: '#3888fa', width: 2 },
              areaStyle: { color: '#f3f8ff' }
            }
          }
        },
        C: {
          name: 't3',
          history: this.dataCHistory,
          itemStyle: {
            normal: {
              color: '#00C853',
              lineStyle: { color: '#00C853', width: 2 },
              areaStyle: { color: '#e0f7ea' }
            }
          }
        },
        D: {
          name: 'ktcd',
          history: this.dataDHistory,
          itemStyle: {
            normal: {
              color: '#FF8C00',
              lineStyle: { color: '#FF8C00', width: 2 }
            }
          }
        },
        E: {
          name: 't2',
          history: this.dataEHistory,
          itemStyle: {
            normal: {
              color: '#9400D3',
              lineStyle: { color: '#9400D3', width: 2 }
            }
          }
        },
        F: {
          name: 't3',
          history: this.dataFHistory,
          itemStyle: {
            normal: {
              color: '#00FFFF',
              lineStyle: { color: '#00FFFF', width: 2 }
            }
          }
        },
        G: {
          name: 'ktcd',
          history: this.dataGHistory,
          itemStyle: {
            normal: {
              color: '#800080',
              lineStyle: { color: '#800080', width: 2 }
            }
          }
        },
        H: {
          name: 't2',
          history: this.dataHHistory,
          itemStyle: {
            normal: {
              color: '#FF1493',
              lineStyle: { color: '#FF1493', width: 2 }
            }
          }
        },
        I: {
          name: 't3',
          history: this.dataIHistory,
          itemStyle: {
            normal: {
              color: '#228B22',
              lineStyle: { color: '#228B22', width: 2 }
            }
          }
        },
        J: {
          name: 'ktcd',
          history: this.dataJHistory,
          itemStyle: {
            normal: {
              color: '#DAA520',
              lineStyle: { color: '#DAA520', width: 2 }
            }
          }
        },
        K: {
          name: 't2',
          history: this.dataKHistory,
          itemStyle: {
            normal: {
              color: '#87CEEB',
              lineStyle: { color: '#87CEEB', width: 2 }
            }
          }
        },
        L: {
          name: 't3',
          history: this.dataLHistory,
          itemStyle: {
            normal: {
              color: '#7B68EE',
              lineStyle: { color: '#7B68EE', width: 2 }
            }
          }
        }
      };

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

      this.chart.setOption({
        xAxis: {
          data: ['节点1', '节点2', '节点3', '节点4', '节点5', '节点6', '节点7'], // X轴数据固定顺序
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
          padding: [5, 10]
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
.chart-toggle {
  text-align: center;
  margin-bottom: 60px;
}

.chart-toggle button {
    padding: 9px 12px;
    border: none;
    background-color: #007bff; /* 设置按钮背景颜色为蓝色 */
    color: #ffffff; /* 设置按钮文字颜色为白色 */
    border-radius: 4px; /* 添加圆角边框 */
    cursor: pointer;
    margin-top: 20px;    /* 上外边距 */
    margin-right: 5px;  /* 右外边距 */
    margin-bottom:30px; /* 下外边距 */
    margin-left: 5px;   /* 左外边距 */
    transition: background-color 0.3s ease; /* 添加过渡效果 */
}
</style>
