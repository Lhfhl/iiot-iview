<!-- <template>
  <div>
    <el-card style="width: 100%; height: 100%;display: flex; flex-direction: column;">
      <el-row :gutter="150" style="height: 100%;">
        <el-col :offset="1" :span="16" style="height: 100%;">
          <div style="height: 100%;">
            <EZUIKitJs style="width: 100%; height: 100%;"></EZUIKitJs>
          </div>
        </el-col>

        <el-col :span="6" style="display: flex; flex-direction: column;height: 100%; margin-top: 40px;">
          <data-card label="温度" :value="25" icon-class="iconfont icon-wendu" icon-size="50px" class="card-item"
            unit="℃" />

          <data-card label="湿度" :value="25" icon-class="iconfont icon-humidity" icon-size="50px" class="card-item"
            unit="%" />

          <data-card label="二氧化碳" :value="25" icon-class="iconfont icon-eryanghuatan" icon-size="50px" class="card-item"
            unit="ppm" />

          <data-card label="二氧化硫" :value="25" icon-class="iconfont icon-eryanghualiu" icon-size="50px" class="card-item"
            unit="ppm" />

          <data-card label="噪音" :value="25" icon-class="iconfont icon-zaoyin" icon-size="50px" class="card-item"
            unit="dB" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import EZUIKitJs from "@/view/industrial-monitoring/EZUIKitJs.vue";
import DataCard from "@/view/industrial-monitoring/DataCard.vue";

export default {
  components: {
    EZUIKitJs,
    DataCard
  },
}

</script>

<style scoped>
.card-item {
  margin-bottom: 5px;
}
</style> -->

<template>
  <div class="contents">
    <div class="contetn_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->

      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop/>

      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item1" title="环境参数">
        <LeftCenter />
      </ItemWrap>
      <!-- <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="设备提醒"
        style="padding: 0 10px 16px 10px"
      >
        <LeftBottom />
      </ItemWrap> -->
    </div>
    <div class="contetn_center">
      <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="生产安排">
        <CenterBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警指示"
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="订单信息"
        style="padding: 0 10px 16px 10px"
      >
        <RightCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="数据统计图 "
      >
        <RightBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<script>
import LeftTop from './left-top.vue'
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
import ItemWrap from '../../components/item-wrap/item-wrap.vue'
import "./css/index.css"

export default {
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    CenterMap,
    RightTop,
    RightCenter,
    RightBottom,
    CenterBottom,
    ItemWrap,
  },
  data() {
    return {

    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {
  },

  mounted() {},
  methods: {

  },
};
</script>
<style scoped>
/* 内容 */
.contents .contetn_left,
.contents .contetn_right {
  width: 540px;
  box-sizing: border-box;
  /* padding: 16px 0; */
}

.contents .contetn_center {
  width: 720px;
}

/* 左右两侧三个块 */
.contents .contetn_lr-item {
  height: 310px;
}

.contents .contetn_lr-item1 {
  height: 620px;
}

.contents .contetn_center_top {
  width: 100%;
}

/* 中间 */
.contents .contetn_center {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.contents .contetn_center-bottom {
  height: 315px;
}

/* 左边和右边结构一样 */
.contents .contetn_left,
.contents .contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
}

@keyframes rotating {
  0% {
    -webkit-transform: rotate(0) scale(1);
    transform: rotate(0) scale(1);
  }
  50% {
    -webkit-transform: rotate(180deg) scale(1.1);
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    -webkit-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
  }
}

</style>
