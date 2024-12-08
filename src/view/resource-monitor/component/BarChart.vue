<template>
  <div :class="className" :style="{ height: height, width: width }">
    <!-- 画面切换按钮 -->
    <div class="chart-toggle">
      <button @click="toggleView('a')">cpu负载</button>
      <button @click="toggleView('b')">memory负载</button>
    </div>
    <!-- 图表容器 -->
    <div ref="chart" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons')

const animationDuration = 1000
const updateInterval = 30000 // 每30秒更新一次数据

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
    // 父组件传入的原始数据 A、B、C
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
    // 父组件传入的新增数据 D、E、F
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
    }
  },
  data() {
    return {
      chart: null,
      nodeNames: ['检测节点1', '检测节点2', '检测节点3', '检测节点4', '检测节点5', '检测节点6', '检测节点7'],
      currentDataA: [], // 用来存储历史数据A
      currentDataB: [], // 用来存储历史数据B
      currentDataC: [], // 用来存储历史数据C
      currentDataD: [], // 用来存储新增数据D
      currentDataE: [], // 用来存储新增数据E
      currentDataF: [], // 用来存储新增数据F
      timer: null, // 用来存储定时器
      lastUpdateTime: Date.now(), // 记录最后一次更新的时间
      view: 'a' // 当前展示的画面，'a' 为原始数据，'b' 为新增数据
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart() // 确保图表初始化
    })

    // 延迟1秒开始检查，避免加载时的数据被记录
    setTimeout(() => {
      this.startPeriodicCheck(); // 启动定时器
      this.recordData(); // 延迟1秒后立即更新一次数据
    }, 200);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }

    if (this.timer) {
      clearInterval(this.timer); // 清除定时器，防止内存泄漏
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.updateChart() // 初始化后立即更新图表
    },

    // 更新图表
    updateChart() {
      const dataToDisplayA = this.view === 'a' ? this.currentDataA : this.currentDataD;
      const dataToDisplayB = this.view === 'a' ? this.currentDataB : this.currentDataE;
      const dataToDisplayC = this.view === 'a' ? this.currentDataC : this.currentDataF;

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 坐标轴指示器，坐标轴触发有效
          },
          formatter: function (params) {
            let result = '';
            params.forEach(item => {
              // 只在 tooltip 中显示数据带有 "%" 的形式
              result += `${item.seriesName}: ${item.data} % <br>`; // 加上百分号
            });
            return result;
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.nodeNames, // 动态生成检测节点
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: 'kctd',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: dataToDisplayA, // 展示 A 画面或者 D 画面数据
            animationDuration
          },
          {
            name: 't2',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: dataToDisplayB, // 展示 B 画面或者 E 画面数据
            animationDuration
          },
          {
            name: 't3',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: dataToDisplayC, // 展示 C 画面或者 F 画面数据
            animationDuration
          }
        ]
      });
    },

    // 开始定期检查数据变化
    startPeriodicCheck() {
      this.timer = setInterval(() => {
        this.recordData(); // 每30秒记录一次数据
      }, updateInterval);
    },

    // 每次定期调用此方法更新数据
    recordData() {
      // 如果图表中没有数据，则立即更新
      if (this.currentDataA.length === 0 && this.currentDataB.length === 0 && this.currentDataC.length === 0) {
        this.lastUpdateTime = Date.now(); // 立即更新时间
      } else {
        // 如果自上次更新时间已超过30秒，则更新数据
        if (Date.now() - this.lastUpdateTime >= updateInterval) {
          this.lastUpdateTime = Date.now(); // 更新最后一次更新时间
        } else {
          return; // 如果还没到更新间隔，退出
        }
      }

      // 将数据向前移动一位，并且记录最新的数字数据
      if (this.currentDataA.length >= 7) {
        this.currentDataA.shift(); // 移除最旧的数据
      }
      if (this.currentDataB.length >= 7) {
        this.currentDataB.shift(); // 移除最旧的数据
      }
      if (this.currentDataC.length >= 7) {
        this.currentDataC.shift(); // 移除最旧的数据
      }
      if (this.currentDataD.length >= 7) {
        this.currentDataD.shift(); // 移除最旧的数据
      }
      if (this.currentDataE.length >= 7) {
        this.currentDataE.shift(); // 移除最旧的数据
      }
      if (this.currentDataF.length >= 7) {
        this.currentDataF.shift(); // 移除最旧的数据
      }

      // 将父组件传递的当前数据推送到对应的数据数组
      this.currentDataA.push(this.dataA);
      this.currentDataB.push(this.dataB);
      this.currentDataC.push(this.dataC);
      this.currentDataD.push(this.dataD);
      this.currentDataE.push(this.dataE);
      this.currentDataF.push(this.dataF);

      // 更新图表
      this.updateChart();
    },

    // 切换显示画面
    toggleView(view) {
      this.view = view; // 切换展示画面
      this.updateChart(); // 更新图表显示
    }
  }
}
</script>

<style scoped>
.chart-toggle {
  text-align: center;
  margin-bottom: 20px;
}

.chart-toggle button {
    padding: 6px 12px;
    border: none;
    background-color: #007bff; /* 设置按钮背景颜色为蓝色 */
    color: #ffffff; /* 设置按钮文字颜色为白色 */
    border-radius: 4px; /* 添加圆角边框 */
    cursor: pointer;
    margin-top: 1px;    /* 上外边距 */
    margin-right: 5px;  /* 右外边距 */
    margin-bottom:0px; /* 下外边距 */
    margin-left: 5px;   /* 左外边距 */
    transition: background-color 0.3s ease; /* 添加过渡效果 */
}
</style>
