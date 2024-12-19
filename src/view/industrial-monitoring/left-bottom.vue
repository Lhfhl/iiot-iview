
<template>
  <div class="chart-container">
    <chart height="100%" width="100%"
    :xAxisData="timestamps"
    :seriesData="[temperatures,humidities, beam, stive]"
    :seriesNames="['温度', '湿度', '光照', '粉尘']"
    />
  </div>
</template>

<script>
import Chart from '@/components/charts/LineMarker'
import { currentGET } from '../../api/Largescreen/index'

export default {
  name: 'LineChart',
  components: { Chart },
  data() {
    return {
      timestamps: [], // 存储时间部分
      temperatures: [], // 存储温度值
      humidities: [], // 存储湿度值
      stive: [50, 50, 40, 50, 40, 50, 40, 30, 30, 30],
      beam: [50, 40, 50, 40, 50, 40, 30, 30, 30, 60],
      timer: null, // 定时器
    };
  },
  created() {
    this.getData(); // 初始化获取数据
    this.startMonitoring(); // 开启实时监控
  },
  beforeDestroy() {
    this.stopMonitoring(); // 清理定时器
  },
  methods: {
    async getData() {
      try {
        const res = await currentGET("big7");
        console.log("接口返回数据：", res); // 打印调试信息

        // 判断返回是否为数组
        if (res.code === 1) {
          const data = res.data;
          // 提取数据
          this.timestamps = data.map(item => item.timestamp.split(' ')[1]); // 提取时间部分
          this.temperatures = data.map(item => item.temperature); // 提取温度
          this.humidities = data.map(item => item.humidity); // 提取湿度

          // console.log("成功提取数据：", {
          //   timestamps: this.timestamps,
          //   temperatures: this.temperatures,
          //   humidities: this.humidities,
          // });
          console.log("时间数组 (timestamps):", this.timestamps);
          console.log("温度数组 (temperatures):", this.temperatures);
          console.log("湿度数组 (humidities):", this.humidities);
        } else {
          console.error("请求失败，返回数据不是数组：", res);
          this.$Message.warning("请求失败，返回数据格式异常");
        }
      } catch (error) {
        // 捕获请求过程中的错误
        console.error("接口请求错误：", error);
        this.$Message.error("接口请求错误，请检查网络或后端服务！");
      }
    },

    startMonitoring() {
      if (this.timer) return; // 防止重复启动定时器
      this.timer = setInterval(() => {
        this.getData(); // 定时获取数据
      }, 5000); // 每隔 5 秒获取一次数据（可根据需求调整间隔）
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
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
