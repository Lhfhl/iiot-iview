<template>
  <ul class="user_Overview" v-if="pageflag">
    <li class="user_Overview-item" style="color: #00fdfa">
      <div class="user_Overview_nums allnum">
        <img class="icon1" src="@/assets/icons/tem.svg" alt="温度图标" />
        <!-- <dv-digital-flop :config="config" style="width: auto; height: 100%;" /> -->
      </div>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;温度&nbsp;&nbsp;&nbsp;</p>
      <div class="user_Overview_nums1 allnum1">
        <dv-digital-flop :config="config" style="width: auto; height: 100%;" />
      </div>
    </li>
    <hr />
    <li class="user_Overview-item" style="color: #07f7a8">
      <div class="user_Overview_nums humidity">
        <img class="icon" src="@/assets/icons/humidity.svg" alt="湿度图标" />
        <!-- <dv-digital-flop :config="humidityconfig" style="width: auto; height: 100%;" /> -->
      </div>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;湿度&nbsp;&nbsp;&nbsp;</p>
      <div class="user_Overview_nums1 allnum1">
        <dv-digital-flop :config="humidityconfig" style="width: auto; height: 100%;" />
      </div>
    </li>
    <hr />
    <li class="user_Overview-item" style="color: #e3b337">
      <div class="user_Overview_nums dust">
        <img class="icon" src="@/assets/icons/dust.svg" alt="粉尘图标" />
      </div>
      <p>粉尘情况</p>
      <div class="user_Overview_nums1 allnum1">
        <dv-digital-flop :config="dustconfig" style="width: auto; height: 100%;" />
      </div>
    </li>
    <hr />
    <li class="user_Overview-item" style="color: #f5023d">
      <div class="user_Overview_nums beam">
        <img class="icon" src="@/assets/icons/beam.svg" alt="光照图标" />
      </div>
      <p>光照情况</p>
      <div class="user_Overview_nums1 allnum1">
        <dv-digital-flop :config="beamconfig" style="width: auto; height: 100%;" />
      </div>
    </li>
  </ul>
  <Reacquire v-else @onclick="getData" line-height="200px">
    重新获取
  </Reacquire>
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
        humidityNum: 0,
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
        if (res.success) {
          this.userOverview = res.data;
          this.humidityconfig = {
            ...this.humidityconfig,
            number: [res.data.humidityNum]
          }
          this.config = {
            ...this.config,
            number: [res.data.temperatureNum]
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
  list-style: none;
  padding: 0;
  margin: 0;
  width: 500px;
}

.user_Overview hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
  width: 100%;
}

.user_Overview li {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 30px;
}

.user_Overview li:first-child {
  margin-top: 17px;
}

.user_Overview li p {
  margin: 0;
  margin-left: 20px;
  font-size: 16px;
  color: #fff;
}

.user_Overview li .user_Overview_nums {
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 22px;
  position: relative;
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user_Overview li .user_Overview_nums img.icon {
  position: absolute;
  width: 40px; /* 图标大小 */
  height: 40px;
  z-index: 1; /* 确保图标显示在圆圈内 */
}

.user_Overview li .user_Overview_nums img.icon1 {
  position: absolute;
  width: 48px; /* 图标大小 */
  height: 48px;
  z-index: 1; /* 确保图标显示在圆圈内 */
}

.user_Overview li .user_Overview_nums .dv-digital-flop {
  margin-left: 70px; /* 数据距离图标右移 */
  z-index: 2; /* 确保数据显示在图标右侧 */
}

.user_Overview li .user_Overview_nums.allnum::before {
  content: '';
  background-image: url("../../assets/img/left_top_lan.png");
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0; /* 确保背景圆圈在底层 */
}

.user_Overview li .user_Overview_nums.humidity::before {
  content: '';
  background-image: url("../../assets/img/left_top_lv.png");
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.user_Overview li .user_Overview_nums.dust::before {
  content: '';
  background-image: url("../../assets/img/left_top_huang.png");
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.user_Overview li .user_Overview_nums.beam::before {
  content: '';
  background-image: url("../../assets/img/left_top_hong.png");
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.user_Overview li .user_Overview_nums1 {
  width: 200px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 22px;
  position: relative;
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user_Overview li .user_Overview_nums.allnum1::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0; /* 确保背景圆圈在底层 */
}
</style>
