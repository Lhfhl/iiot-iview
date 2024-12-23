<template>
  <div class="hello-ezuikit-js">
    <!-- 视频播放容器 -->
    <div id="video-container" class="video-wrapper"></div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";

// 定义播放器实例
var player = null;

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    console.group("mounted 组件挂载完毕状态===============》");
    this.init(); // 在组件挂载时自动初始化监控组件
    window.addEventListener("resize", this.resizeVideo); // 监听窗口大小变化，调整视频区域大小
  },
  beforeUnmount() {
    console.group("beforeUnmount 组件即将销毁状态===============》");
    this.destroy(); // 在组件销毁时销毁监控组件
    window.removeEventListener("resize", this.resizeVideo); // 组件销毁时移除窗口大小变化监听
  },
  methods: {
    /**
     * 初始化视频播放器
     * @description 初始化 EZUIKit 播放器实例
     */
    init() {
      if (player) {
        this.destroy(); // 如果已有播放器实例，先销毁
      }
      player = new EZUIKit.EZUIKitPlayer({
        id: "video-container", // 视频容器ID
        accessToken:
          "at.cd9j675512bdxacx3fozc1zzcrfkdlor-7lk2a9tsjg-19axihe-hgflpy1lc",
        url: "ezopen://open.ys7.com/BC1950677/1.live",
        // validCode: "yzs123456789@",
        // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
        template: "simple",
        plugin: ["talk"], // 加载插件，talk-对讲
      });
      window.player = player; // 将播放器实例挂载到全局，便于调试
      this.resizeVideo(); // 初始化后调整视频区域大小
    },
    /**
     * 播放视频
     */
    play() {
      var playPromise = player.play();
      playPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 暂停播放
     */
    stop() {
      var stopPromise = player.stop();
      stopPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 获取当前播放的 OSD 时间
     */
    getOSDTime() {
      var getOSDTimePromise = player.getOSDTime();
      getOSDTimePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 截图
     */
    capturePicture() {
      var capturePicturePromise = player.capturePicture(
        `${new Date().getTime()}`
      );
      capturePicturePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 开启声音
     */
    openSound() {
      var openSoundPromise = player.openSound();
      openSoundPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 关闭声音
     */
    closeSound() {
      var openSoundPromise = player.closeSound();
      openSoundPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    /**
     * 全屏播放
     */
    fullScreen() {
      player.fullScreen();
    },
    /**
     * 销毁播放器实例
     */
    destroy() {
      try {
        if (player) {
          var destroyPromise = player.destroy();
          destroyPromise.then((data) => {
            console.log("promise 获取 数据", data);
          });
          player = null; // 销毁后清空实例
        }
      } catch (error) {
        console.error("Error while destroying player:", error);
      }
    },
    /**
     * 动态调整视频区域大小
     * @description 根据窗口大小调整视频区域宽高
     */
    resizeVideo() {
      const videoContainer = document.getElementById("video-container");
      if (videoContainer) {
        videoContainer.style.width = "100%";
        videoContainer.style.height = "100%";
      }
    },
  },
  watch: {
    // 监听路由变化，重新初始化播放器
    "$route"() {
      this.init();
    }
  }
};
</script>

<style scoped>
.video-wrapper {
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 宽度占满父容器 */
  height: 100%; /* 高度占满父容器 */
  background-color: black; /* 父容器背景为黑色 */
}
</style>
