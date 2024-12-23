<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ maptitle }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <dv-border-box-13 style="padding: 0px;">
        <div class="EZUIKitJs-container">
          <EZUIKitJs ref="EZUIKitJs" class="EZUIKitJs" />
        </div>
      </dv-border-box-13>
    </div>
  </div>
</template>

<script>
import EZUIKitJs from "@/view/industrial-monitoring/EZUIKitJs.vue";

export default {
  components: {
    EZUIKitJs,
  },
  data() {
    return {
      maptitle: "产线实时监控", // 标题
    };
  },
  mounted() {
    // 强制初始化视频区域尺寸
    this.resizeVideo();
    window.addEventListener("resize", this.resizeVideo);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeVideo);
  },
  methods: {
    resizeVideo() {
      const videoContainer = this.$refs.EZUIKitJs?.$el.querySelector("#video-container");
      const parent = this.$refs.EZUIKitJs?.$el.parentNode;

      if (videoContainer && parent) {
        videoContainer.style.width = `${parent.clientWidth}px`;
        videoContainer.style.height = `${parent.clientHeight}px`;
      }
    },
  },
};
</script>

<style scoped>
.centermap {
  margin-bottom: 0px;
}

.centermap .maptitle {
  height: 60px;
  display: flex;
  justify-content: center;
  padding-top: 0px;
  box-sizing: border-box;
}

.centermap .maptitle .titletext {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 6px;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 10px;
}

.centermap .maptitle .zuo,
.centermap .maptitle .you {
  background-size: 100% 100%;
  width: 29px;
  height: 20px;
  margin-top: 8px;
}

.centermap .maptitle .zuo {
  background: url("../../assets/img/xiezuo.png") no-repeat;
}

.centermap .maptitle .you {
  background: url("../../assets/img/xieyou.png") no-repeat;
}

.mapwrap {
  margin-top: -25px;
  padding-top: 0;
  height: 568px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.EZUIKitJs-container {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 988px;
  height: 530px;
  border: 1px solid #00eded;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5), 0 0 6px rgba(0, 237, 237, 0.4);
}

.EZUIKitJs {
  width: 100%;
  height: 100%;
}
</style>
