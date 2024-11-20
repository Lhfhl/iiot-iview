<template>
  <div ref="chart" style="height: 300px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TemperatureChart',
  data() {
    return {
      chart: null,
      actualData: [],
      predictedData: [],
      timeData: [],
      fetchInterval: null, // 保存定时器 ID
    };
  },
  mounted() {
    this.initChart();
    this.fetchData();
    this.fetchInterval = setInterval(this.fetchData, 45 * 60 * 1000); // 每 45 分钟刷新一次
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval); // 清除定时器
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.setChartOptions();
    },
    calculateFontSize() {
      const baseSize = 14; // 基准大小
      const vw = window.innerWidth;
      return (vw * baseSize) / 1920; // 根据视口宽度计算字体大小
    },
    setChartOptions() {
      const fontSize = this.calculateFontSize();
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
              fontSize,
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.timeData,
          axisLabel: {
            fontSize,
            formatter: function (value) {
              // 假设时间格式为 'YYYY-MM-DD HH:mm:ss'
              // 只显示小时和分钟
              const date = new Date(value);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              return `${hours}:${minutes}`;
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize,
          },
        },
        series: [
          {
            name: '实际温度',
            type: 'line',
            data: this.actualData,
            label: {
              fontSize,
            },
          },
          {
            name: '预测温度',
            type: 'line',
            data: this.predictedData,
            label: {
              fontSize,
            },
          },
        ],
      });
    },
    async fetchData() {
      try {
      const actualResponse = await fetch('/schedulerfront/curtem');
      const actualData = await actualResponse.json();
      const predictedResponse = await fetch('/schedulerfront/pretem');
      const predictedData = await predictedResponse.json();

      const timeData = [];
      const actualTempData = [];
      const predictedTempData = {};

      // 处理实际温度数据
      Object.keys(actualData).forEach((timestamp) => {
        timeData.push(timestamp);
        actualTempData.push(actualData[timestamp]);
      });
      // 处理预测温度数据
      Object.keys(predictedData).forEach((timestamp) => {
        timeData.push(timestamp);
        predictedTempData[timestamp] = Number(predictedData[timestamp].replace(/[\[\]]/g, ''));
      });

      const combinedData = timeData.map((time) => ({
        time,
        actual: actualData[time] || null,
        predicted: predictedTempData[time] || null,
      }));
      
      this.timeData = combinedData.map((entry) => entry.time);
      this.actualData = combinedData.map((entry) => entry.actual);
      this.predictedData = combinedData.map((entry) => entry.predicted);
      // console.log("刷新了一次")
      this.updateChart();
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
    },
    updateChart() {
      this.chart.setOption({
        xAxis: {
          data: this.timeData,
        },
        series: [
          {
            name: '实际温度',
            data: this.actualData,
          },
          {
            name: '预测温度',
            data: this.predictedData,
          },
        ],
      });
    },
    handleResize() {
      this.chart.resize();
      this.setChartOptions();
    },
  },
};
</script>

<style scoped>
</style>
