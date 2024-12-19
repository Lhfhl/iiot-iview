<template>
    <div v-if="pageflag" class="right_center_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !sbtxSwiperFlag }">
      <component :is="components" :data="list" :class-option="defaultOption">
        <ul class="right_center ">
          <li class="right_center_item" v-for="(item, i) in list" :key="i">
            <span class="orderNum">{{ i + 1 }}</span>
            <div class="inner_right">
              <div class="dibu"></div>
              <div class="flex">
                <div class="info">
                  <span class="labels ">设备ID：</span>
                  <span class="contents zhuyao"> {{ item.gatewayno }}</span>
                </div>
                <div class="info">
                  <span class="labels">型号：</span>
                  <span class="contents "> {{ item.terminalno }}</span>
                </div>
                <div class="info">
                  <span class="labels1">订单号：</span>
                  <span class="contents warning"> {{ item.value | montionFilter }}</span>
                </div>
              </div>

              <div class="flex">

                <div class="info">
                  <span class="labels"> 产线地址：</span>
                  <span class="contents ciyao" style="font-size:12px"> {{ item.provinceName }}/{{ item.cityName }}/{{ item.countyName }}</span>
                </div>
                <div class="info time">
                  <span class="labels1">时间：</span>
                  <span class="contents" style="font-size:12px"> {{ item.createtime }}</span>
                </div>

              </div>
              <div class="flex">

                <div class="info">
                  <span class="labels">订单内容：</span>
                  <span class="contents ciyao" :class="{ warning: item.detail }"> {{ item.detail || '无'
                  }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </component>
    </div>
    <Reacquire v-else @onclick="getData" style="line-height:200px" />

  </template>

<script>
import { currentGET } from "../../api/Largescreen/index";
import vueSeamlessScroll from 'vue-seamless-scroll' // vue2引入方式
import Kong from "../../components/kong/kong.vue";
export default {
  components: { vueSeamlessScroll, Kong },

  data() {
    return {
      list: [],
      pageflag: true,
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
        limitMoveNum: 3,
        singleHeight: 250,
        step: 0,
      }

    };
  },
  computed: {
    sbtxSwiperFlag() {
      let ssyjSwiper = this.$store.state.setting.ssyjSwiper
      if (ssyjSwiper) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.components = vueSeamlessScroll
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.components = Kong
      }
      return ssyjSwiper
    }
  },
  created() {
    this.getData()
  },

  mounted() { },
  methods: {
    getData() {
      this.pageflag = true
      // this.pageflag =false
      currentGET('big5', { limitNum: 50 }).then(res => {
        console.log('生产信息', res);
        if (res.success) {
          this.list = res.data.list
          let timer = setTimeout(() => {
            clearTimeout(timer)
            this.defaultOption.step = this.$store.state.setting.defaultOption.step
          }, this.$store.state.setting.defaultOption.waitTime);
        } else {
          this.pageflag = false
          this.$Message.warning(res.msg)
        }
      })
    },

  },
};
</script>
  <style scoped>
  .right_center {
    width: 100%;
    height: 100%;
}

.right_center .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    padding: 10px;
    font-size: 14px;
    color: #fff;
}

.right_center .right_center_item .orderNum {
    margin: 0 20px 0 -20px;
}

.right_center .right_center_item .inner_right {
    position: relative;
    height: 100%;
    width: 550px;
    flex-shrink: 0;
    line-height: 1.5;
}

.right_center .right_center_item .inner_right .dibu {
    position: absolute;
    height: 2px;
    width: 104%;
    background-image: url("../../assets/img/zuo_xuxian.png");
    bottom: -12px;
    left: -2%;
    background-size: cover;
}

.right_center .right_center_item .info {
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.right_center .right_center_item .info .labels {
    margin-left: 20px;
    flex-shrink: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.labels1 {
    margin-left: 50px;
    flex-shrink: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.right_center .right_center_item .info .zhuyao {
    color: var(--primary-color);
    font-size: 15px;
}

.right_center .right_center_item .info .ciyao {
    color: rgba(255, 255, 255, 0.8);
}

.right_center .right_center_item .info .warning {
    color: #E6A23C;
    font-size: 15px;
}

.right_center_wrap {
    overflow: hidden;
    width: 100%;
    height: 250px;
}

.overflow-y-auto {
    overflow-y: auto;
}

  </style>
