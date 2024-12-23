<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div
    v-if="pageflag"
    class="left_boottom_wrap beautify-scroll-def"
    :class="{ 'overflow-y-auto': !sbtxSwiperFlag }"
  >
    <component :is="components" :data="list" :class-option="defaultOption">
      <ul class="left_boottom">
        <li class="left_boottom_item" v-for="(item, i) in list" :key="i">
          <span class="orderNum doudong">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels1">报错编号：</span>
                <span class="contents zhuyao doudong wangguan">
                  {{ checkEnvironmentStatus(item) === '正常' ? '10001' : '10002' }}
                </span>
              </div>
              <div class="info">
                <span class="labels1">时间：</span>
                <span class="contents" style="font-size: 12px">
                  {{ item.timestamp }}
                </span>
              </div>
            </div>

            <span
              class="types doudong"
              :class="{
                typeRed: checkEnvironmentStatus(item) === '异常',
                typeGreen: checkEnvironmentStatus(item) === '正常',
              }"
            >
              {{ checkEnvironmentStatus(item) }}
            </span>

            <div class="info addresswrap">
              <span class="labels1">报警信息：</span>
              <span class="contents ciyao" style="font-size: 12px">
                {{ checkDetailedEnvironmentStatus(item) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>

  <Reacquire v-else @onclick="getData" style="line-height: 200px" />
</template>

<script>
import { currentGET } from "../../api/Largescreen/index";
import vueSeamlessScroll from "vue-seamless-scroll"; // vue2引入方式
import Kong from "../../components/kong/kong.vue";

export default {
  components: { vueSeamlessScroll, Kong },
  data() {
    return {
      list: [], // 数据列表
      pageflag: true, // 页面加载标志
      components: vueSeamlessScroll,
      defaultOption: {
        singleHeight: 200, // 每条高度
        limitMoveNum: 1, // 每次滚动条目数
        step: 4, // 滚动速度
      },
      timer: null, // 定时器
      lastUpdateTime: Date.now(), // 最近数据更新时间
    };
  },
  computed: {
    sbtxSwiperFlag() {
      const sbtxSwiper = this.$store.state.setting.sbtxSwiper;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.components = sbtxSwiper ? vueSeamlessScroll : Kong;
      return sbtxSwiper;
    },
  },
  created() {
    this.getData(); // 初始化获取数据
    this.startScrollTimer(); // 启动定时器
  },
  beforeDestroy() {
    this.stopScrollTimer(); // 清理定时器
  },
  methods: {
    // 获取数据
    async getData() {
      try {
        const res = await currentGET("big7");
        if (res.code === 1 && Array.isArray(res.data)) {
          const newList = res.data.map((item) => ({
            id: item.id || "未知编号",
            timestamp: item.timestamp || "未知时间",
            temperature: item.temperature,
            humidity: item.humidity,
            co2: item.co2,
            tvoc: item.tvoc,
            pm25: item.pm25,
          }));

          // 检查数据是否有变动
          if (JSON.stringify(this.list) !== JSON.stringify(newList)) {
            this.list = newList; // 更新数据列表
            this.triggerScroll(); // 数据变动时触发滚动
          }
          this.lastUpdateTime = Date.now(); // 更新最近更新时间
        } else {
          console.error("数据格式异常：", res);
        }
      } catch (error) {
        console.error("获取数据失败：", error);
      }
    },

    // 手动触发滚动
    triggerScroll() {
      // 暂停滚动
      this.$refs.scroll.pause();
      // 触发滚动后清零定时器
      this.stopScrollTimer();
      // 重新启动定时器
      setTimeout(() => {
        this.$refs.scroll.start(); // 启动滚动
        this.startScrollTimer(); // 重新启动定时器
      }, 100); // 延迟滚动恢复，确保 UI 更新
    },

    // 定时器逻辑
    startScrollTimer() {
      if (this.timer) return; // 防止重复启动
      this.timer = setInterval(() => {
        // 如果 3 秒未收到新数据，触发滚动
        if (Date.now() - this.lastUpdateTime >= 6000) {
          this.$refs.scroll.start(); // 触发滚动
        }
      }, 1000); // 每隔 1 秒检查
    },
    stopScrollTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    checkEnvironmentStatus(item) {
      const thresholds = {
        temperature: { min: 15, max: 35 },
        humidity: { min: 15, max: 70 },
        co2: { min: 400, max: 1000 },
        tvoc: { min: 0, max: 400 },
        pm25: { min: 0, max: 75 },
      };

      if (
        item.temperature < thresholds.temperature.min || item.temperature > thresholds.temperature.max ||
        item.humidity < thresholds.humidity.min || item.humidity > thresholds.humidity.max ||
        item.co2 < thresholds.co2.min || item.co2 > thresholds.co2.max ||
        item.tvoc < thresholds.tvoc.min || item.tvoc > thresholds.tvoc.max ||
        item.pm25 < thresholds.pm25.min || item.pm25 > thresholds.pm25.max
      ) {
        return "异常";
      } else {
        return "正常";
      }
    },

    checkDetailedEnvironmentStatus(item) {
      const thresholds = {
        temperature: { min: 15, max: 35 },
        humidity: { min: 15, max: 70 },
        co2: { min: 400, max: 1000 },
        tvoc: { min: 0, max: 500 },
        pm25: { min: 0, max: 75 },
      };

      let issues = []; // 用于存储异常的参数

      if (item.temperature < thresholds.temperature.min || item.temperature > thresholds.temperature.max) {
        issues.push("温度");
      }
      if (item.humidity < thresholds.humidity.min || item.humidity > thresholds.humidity.max) {
        issues.push("湿度");
      }
      if (item.co2 < thresholds.co2.min || item.co2 > thresholds.co2.max) {
        issues.push("CO2");
      }
      if (item.tvoc < thresholds.tvoc.min || item.tvoc > thresholds.tvoc.max) {
        issues.push("TVOC");
      }
      if (item.pm25 < thresholds.pm25.min || item.pm25 > thresholds.pm25.max) {
        issues.push("PM2.5");
      }

      return issues.length === 0 ? "无" : `${issues.join("&")} 异常`;
    },
  },
};
</script>

<style  scoped>
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 95%;
}

.doudong {
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;
}

.left_boottom .left_boottom_item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 14px;
  margin: 10px 0;
}

.left_boottom .left_boottom_item .orderNum {
  margin: 0 16px 0 -20px;
}

.left_boottom .left_boottom_item .info {
  margin-left: 10px;
  display: flex;
  align-items: center;
  color: #fff;
}

.left_boottom .left_boottom_item .info .labels {
  /* margin-right: 30px; */
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.labels1 {
  margin-left: 30px;
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.left_boottom .left_boottom_item .info .zhuyao {
  color: #0072ff; /* 替换 $primary-color 变量 */
  font-size: 15px;
}

.left_boottom .left_boottom_item .info .ciyao {
  color: rgba(255, 255, 255, 0.8);
}

.left_boottom .left_boottom_item .info .warning {
  color: #e6a23c;
  font-size: 15px;
}

.left_boottom .left_boottom_item .inner_right {
  position: relative;
  height: 100%;
  width: 550px;
  flex-shrink: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.left_boottom .left_boottom_item .inner_right .dibu {
  position: absolute;
  height: 2px;
  width: 104%;
  background-image: url("../../assets/img/zuo_xuxian.png");
  bottom: -10px;
  left: -2%;
  background-size: cover;
}

.left_boottom .left_boottom_item .inner_right .addresswrap {
  width: 100%;
  display: flex;
  margin-top: 8px;
}

.left_boottom .left_boottom_item .wangguan {
  color: #1890ff;
  font-weight: 900;
  font-size: 15px;
  width: 80px;
  flex-shrink: 0;
}

.left_boottom .left_boottom_item .time {
  font-size: 12px;
  color: #fff;
}

.left_boottom .left_boottom_item .address {
  font-size: 12px;
  cursor: pointer;
}

.left_boottom .left_boottom_item .types {
  width: 30px;
  flex-shrink: 0;
}

.left_boottom .left_boottom_item .typeRed {
  color: #fc1a1a;
}

.left_boottom .left_boottom_item .typeGreen {
  color: #29fc29;
}

</style>
