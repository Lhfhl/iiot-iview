<template>
  <div class="centermap">
    <div class="mapwrap">
      <!-- <dv-border-box-13> -->
        <!-- 其他内容可以添加在这里 -->
        <EZUIKitJs class="EZUIKitJs"> </EZUIKitJs>
        <!-- 替换为您需要引用的内容 -->
        <!-- <div id="custom-map-container" style="width: 100%; height: 100%;"></div> -->
      <!-- </dv-border-box-13> -->
    </div>
  </div>
</template>

<script>
import EZUIKitJs from "@/view/industrial-monitoring/EZUIKitJs.vue"

export default {

  components: {
    EZUIKitJs,
  },

  data() {
    return {
      maptitle: "产线实时监控",
    };
  },
  methods: {
    returnToNational() {
      console.log("");
      // 如果需要自定义行为，可以在这里处理
    },
  },
};
</script>

<style  scoped>
.centermap {
  /* margin-bottom: 30px; */
  /* /* width: 560px; */
  width: 100%;
  height: 100%;
}

.centermap .maptitle {
  /* height: 60px; */
  display: flex;
  justify-content: center;
  /* padding-top: 10px; */
  /* box-sizing: border-box; */
}

.centermap .maptitle .titletext {
  font-size: 28px;
  font-weight: 900;
  /* letter-spacing: 6px; */
  /* background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%); */
  /* background-clip: text; */
  /* -webkit-background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
  /* margin: 0 10px; */
}

/* .centermap .maptitle .zuo {
  background: url("../../assets/img/xiezuo.png") no-repeat;
}

.centermap .maptitle .you {
  background: url("../../assets/img/xieyou.png") no-repeat;
} */

.mapwrap {
    /* height: 548px; */
    height: 100%;
    width: 100%;
    /* padding: 0 0 10px 0; */
    /* box-sizing: border-box;
    position: relative; */
}

.EZUIKitJs {
    position: absolute;
    /* right: 2.3%;
    top: 5%; */
    width: 90%;
    height: 85%;
    /* border: 1px solid #00eded; */
    /* border-radius: 10px; */
    /* color: #00f7f6; */
    text-align: center;
    /* line-height: 26px;
    letter-spacing: 6px;
    cursor: pointer; */
    /* box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
    0 0 6px rgba(0, 237, 237, 0.4); */
}
</style>
