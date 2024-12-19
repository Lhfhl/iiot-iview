<template>
  <ul class="user_Overview" v-if="pageflag">
    <li class="user_Overview-item" style="color: #00fdfa">
      <div class="user_Overview_nums allnum">
        <img class="icon1" src="@/assets/icons/tem.svg" alt="温度图标" />
        <p class="label-text">温度</p>
        <div class="number-text">
          <dv-digital-flop :config="config" style="width: auto; height: 100%;" />
        </div>
      </div>
    </li>
    <li class="user_Overview-item" style="color: #07f7a8">
      <div class="user_Overview_nums humidity">
        <img class="icon" src="@/assets/icons/humidity.svg" alt="湿度图标" />
        <p class="label-text">湿度</p>
        <div class="number-text">
          <dv-digital-flop :config="humidityconfig" style="width: auto; height: 100%;" />
        </div>
      </div>
    </li>
    <li class="user_Overview-item" style="color: #e3b337">
      <div class="user_Overview_nums dust">
        <img class="icon" src="@/assets/icons/dust.svg" alt="粉尘图标" />
        <p class="label-text">粉尘</p>
        <div class="number-text">
          <dv-digital-flop :config="dustconfig" style="width: auto; height: 100%;" />
        </div>
      </div>
    </li>
    <li class="user_Overview-item" style="color: #f5023d">
      <div class="user_Overview_nums beam">
        <img class="icon" src="@/assets/icons/beam.svg" alt="光照图标" />
        <p class="label-text">光照</p>
        <div class="number-text">
          <dv-digital-flop :config="beamconfig" style="width: auto; height: 100%;" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { currentGET } from '../../api/Largescreen/index'
let style = {
  fontSize: 24
}
export default {
  data() {
    return {
      options: {},
      userOverview: {
        alarmNum: 0,
        dustNum: 0,
        humidity: 0, // 标记
        temperatureNum: 0,
      },
      pageflag: true,
      timer: null,
      config: {
        number: [0],
        content: '{nt}',
        style: {
          ...style,
          // stroke: "#00fdfa",
          fill: "#00fdfa",
        },
      },
      humidityconfig: {
        number: [0],
        content: '{nt}',
        style: {
          ...style,
          // stroke: "#07f7a8",
          fill: "#07f7a8",
        },
      },
      dustconfig: {
        number: [0],
        content: '{nt}',
        style: {
          ...style,
          // stroke: "#e3b337",
          fill: "#e3b337",
        },
      },
      beamconfig: {
        number: [0],
        content: '{nt}',
        style: {
          ...style,
          // stroke: "#f5023d",
          fill: "#f5023d",
        },
      }

    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {
    this.getData()
  },
  mounted() {
  },
  beforeDestroy() {
    this.clearData()
  },
  methods: {
    clearData() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    getData() {
      this.pageflag = true;
      currentGET("big2").then((res) => {
        // console.log('接口返回数据：', res);
        if (!this.timer) {
          console.log("环境参数", res);
        }
        if (res.code) {
          this.userOverview = res.data;
          this.humidityconfig = {
            ...this.humidityconfig,
            number: [res.data.humidity]// 标记
          }
          this.config = {
            ...this.config,
            number: [res.data.temperature]
          }
          this.dustconfig = {
            ...this.dustconfig,
            number: [res.data.dustNum]
          }
          this.beamconfig = {
            ...this.beamconfig,
            number: [res.data.beamNum]
          }
          this.switper()
        } else {
          this.pageflag = false;
          this.$Message.warning(res.msg);
        }
      });
    },
    // 轮询
    switper() {
      if (this.timer) {
        return
      }
      let looper = (a) => {
        this.getData()
      };
      this.timer = setInterval(looper, this.$store.state.setting.echartsAutoTime);
    },
  },
};
</script>
<style scoped>
.user_Overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px; /* 四部分之间的间距 */
  padding: 0;
  margin: 0;
  width: 100%;
}

.user_Overview-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user_Overview_nums {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
}

.user_Overview_nums img.icon,
.user_Overview_nums img.icon1 {
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 1; /* 图标显示在背景上 */
}

.user_Overview_nums::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.allnum::before {
  background-image: url("../../assets/img/left_top_lan.png");
}

.humidity::before {
  background-image: url("../../assets/img/left_top_lv.png");
}

.dust::before {
  background-image: url("../../assets/img/left_top_huang.png");
}

.beam::before {
  background-image: url("../../assets/img/left_top_hong.png");
}

.label-text {
  position: absolute;
  top: -15px;
  right: -60px;
  font-size: 14px;
  color: inherit;
}

.number-text {
  position: absolute;
  bottom: -20px;
  right: -60px;
  font-size: 18px;
  color: inherit;
}
</style>
