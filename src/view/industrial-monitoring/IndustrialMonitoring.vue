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
    <!-- <div class="contetn_left">
      <div class="pagetab">
        <div class="item">实时监测</div>

      </div>
      <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop/>

      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item1" title="环境参数">
        <LeftCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="设备提醒"
        style="padding: 0 10px 16px 10px"
      >
        <LeftBottom />
      </ItemWrap>
    </div> -->
    <div class="contetn_center">
      <CenterMap class="contetn_center_top" />
      <ItemWrap class="contetn_center-bottom" title="生产安排">
        <LeftBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警指示"
        style=" margin-top: 0px "
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="订单信息"
        style="padding: 0 10px 16px 10px; margin-top: -90px "
      >
        <RightCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="数据统计图 "
        style=" margin-top: -90px "
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
/* 主容器设置 Flex 布局 */
.contents {
  display: flex; /* 横向排列 */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* 中间部分，靠左，占 5/8 */
.contents .contetn_center {
  flex: 5; /* 占比 5 */
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: space-around; /* 均匀分布内容 */
  padding: 16px; /* 内边距 */
  box-sizing: border-box;
}

/* 右侧部分，占 3/8 */
.contents .contetn_right {
  flex: 3; /* 占比 3 */
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap:0;
  justify-content: space-around; /* 均匀分布内容 */
  padding: 16px; /* 内边距 */
  box-sizing: border-box;
}

/* 每个模块的样式 */
.contetn_lr-item {
  height: 300px; /* 设置高度 */
  background: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  border: 0px solid #0072FF;
  color: #fff;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  /* margin-top: 200px; */
}

.contetn_center_top {
  height: 315px; /* 上部高度 */
}

.contetn_center-bottom {
  height: 315px; /* 下部高度 */
  margin-top: 200px;
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
