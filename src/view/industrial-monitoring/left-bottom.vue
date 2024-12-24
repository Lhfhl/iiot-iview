<template>
  <div class="chart-container">
    <!-- 左侧图表 -->
    <chart
      class="chart-left"
      id="chart-left"
      height="100%"
      width="100%"
      :xAxisData="timestamps"
      :seriesData="{
        // pm25: pm25,
        humidity: humidities,
        temperature: temperatures
      }"
      yAxisUnit="%/℃"
      :seriesNames="['温度', '湿度', 'PM2.5']"
    />

    <!-- 右侧图表 -->
    <chart
      class="chart-right"
      id="chart-right"
      height="100%"
      width="100%"
      :xAxisData="timestamps"
      :seriesData="{
        co2: co2,
        tvoc: tvoc
      }"
      yAxisUnit="ppm/ppb"
      :seriesNames="['二氧化碳', '总挥发性有机物']"
    />
  </div>
</template>

<script>
import Chart from '@/components/charts/LineMarker';
import { currentGET } from '../../api/Largescreen/index';

export default {
  name: 'SplitLineCharts',
  components: { Chart },
  data() {
    return {
      timestamps: [], // 时间轴数据
      temperatures: [], // 温度数据
      humidities: [], // 湿度数据
      pm25: [], // PM2.5数据
      co2: [], // CO2数据
      tvoc: [], // TVOC数据
      timer: null, // 定时器
    };
  },
  created() {
    this.getData(); // 初始化数据
    this.startMonitoring(); // 开启实时监控
  },
  beforeDestroy() {
    this.stopMonitoring(); // 清理定时器
  },
  methods: {
    async getData() {
      try {
        const res = await currentGET('big7');
        if (res.code === 1) {
          const data = res.data;
          // 提取数据
          this.timestamps = data.map(item => item.timestamp.split(' ')[1]); // 提取时间部分
          this.temperatures = data.map(item => item.temperature); // 提取温度
          this.humidities = data.map(item => item.humidity); // 提取湿度
          this.pm25 = data.map(item => item.pm25); // 提取PM2.5
          this.co2 = data.map(item => item.co2); // 提取CO2
          this.tvoc = data.map(item => item.tvoc); // 提取TVOC
        } else {
          console.error('请求失败，返回数据格式异常：', res);
          this.$Message.warning('请求失败，返回数据格式异常');
        }
      } catch (error) {
        console.error('接口请求错误：', error);
        this.$Message.error('接口请求错误，请检查网络或后端服务！');
      }
    },
    startMonitoring() {
      if (this.timer) return; // 防止重复启动定时器
      this.timer = setInterval(() => {
        this.getData(); // 定时获取数据
      }, 5000); // 每隔 5 秒获取一次数据
    },
    stopMonitoring() {
      if (this.timer) {
        clearInterval(this.timer); // 清除定时器
        this.timer = null;
      }
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex; /* 使用 flex 布局 */
  justify-content: space-between; /* 图表左右对齐 */
  width: 100%;
  height: 100%;
}

.chart-left,
.chart-right {
  width: 48%; /* 左右图表各占一半宽度 */
  height: 100%;
}
</style>
