<template>
  <div class="chart-container">
    <!-- 蓝色字体标题 -->
    <h3 class="chart-title">网络传输速率</h3>
    <div class="chart-toggle">
      <!-- 按钮切换显示不同的数据组合 -->
      <button @click="showData('GHI')">下行速率</button>
      <button @click="showData('JKL')">上行速率</button>
    </div>
    <div ref="chartContainer" :class="className" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import resize from "./mixins/resize";
require("echarts/theme/macarons");

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    // 接收12个数据值
    dataG: { type: Number, required: true },
    dataH: { type: Number, required: true },
    dataI: { type: Number, required: true },
    dataJ: { type: Number, required: true },
    dataK: { type: Number, required: true },
    dataL: { type: Number, required: true },
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
      timestamps: ["00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00", "00:00:00"], // 新增：横坐标时间点
      updateInterval: 30000, // 每30秒更新一次
      timer: null, // 定时器
      currentDataCombo: "GHI", // 默认展示 GHI 数据
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
        this.chart = echarts.init(chartContainer, "macarons");
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
      // 获取当前时间并格式化
      const now = new Date();
      const formattedTime = `${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      // 更新横坐标时间
      this.timestamps.push(formattedTime);
      if (this.timestamps.length > 7) {
        this.timestamps.shift(); // 如果时间点超过7个，移除最旧的
      }

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
      this.setChartOptions(dataCombo);
    },

    // 设置图表的选项
    setChartOptions(dataCombo) {
      const dataSeries = [];
      const legendData = [];
      const dataMap = {
        G: {
          name: "kctd",
          history: this.dataGHistory,
          itemStyle: {
            normal: {
              color: "#DAA520",
              lineStyle: { color: "#DAA520", width: 2 },
            },
          },
        },
        H: {
          name: "t2",
          history: this.dataHHistory,
          itemStyle: {
            normal: {
              color: "#87CEEB",
              lineStyle: { color: "#87CEEB", width: 2 },
            },
          },
        },
        I: {
          name: "t3",
          history: this.dataIHistory,
          itemStyle: {
            normal: {
              color: "#7B68EE",
              lineStyle: { color: "#7B68EE", width: 2 },
            },
          },
        },
        J: {
          name: "kctd",
          history: this.dataJHistory,
          itemStyle: {
            normal: {
              color: "#00FFFF",
              lineStyle: { color: "#00FFFF", width: 2 },
            },
          },
        },
        K: {
          name: "t2",
          history: this.dataKHistory,
          itemStyle: {
            normal: {
              color: "#BA55D3",
              lineStyle: { color: "#BA55D3", width: 2 },
            },
          },
        },
        L: {
          name: "t3",
          history: this.dataLHistory,
          itemStyle: {
            normal: {
              color: "#7CFC00",
              lineStyle: { color: "#7CFC00", width: 2 },
            },
          },
        },
      };

      // 根据所选数据组合添加数据系列
      for (const char of dataCombo) {
        const { name, history, itemStyle } = dataMap[char];
        legendData.push(name);
        dataSeries.push({
          name,
          itemStyle,
          smooth: true,
          type: "line",
          data: history,
        });
      }

      // 设置图表选项
      this.chart.setOption({
        xAxis: {
          data: this.timestamps, // 使用动态时间点作为横坐标
          boundaryGap: false,
          axisTick: { show: false },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 57,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          padding: [5, 10],
          formatter: (params) => {
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
          axisTick: { show: false },
        },
        legend: {
          data: legendData,
        },
        series: dataSeries,
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  text-align: center;
  margin-bottom: -10px;
}

.chart-title {
  color: #007bff;
  font-size: 24px;
  margin-bottom: 0px;
  margin-top: -10px;
}

.chart-toggle {
  text-align: center;
  margin-bottom: 0px;
}

.chart-toggle button {
  padding: 9px 12px;
  border: none;
  background-color: #007bff;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 3px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 0px;
}

.chart-toggle button:hover {
  background-color: #0056b3;
}
</style>
