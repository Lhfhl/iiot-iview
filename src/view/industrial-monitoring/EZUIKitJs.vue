<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" style="width: 1000px; height: 600px;"></div>
    <!-- <div>
      <button v-on:click="init">初始化</button>
      <button v-on:click="stop">暂停播放</button>
      <button v-on:click="play">开始播放</button>
      <button v-on:click="openSound">关闭声音</button>
      <button v-on:click="closeSound">开启声音</button>
      <button v-on:click="capturePicture">截图</button>
      <button v-on:click="fullScreen">全屏播放</button>
      <button v-on:click="ezopenStartTalk">开始对讲</button>
      <button v-on:click="ezopenStopTalk">结束对讲</button>
      <button v-on:click="destroy">销毁</button>
    </div> -->
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
import { onUpdated } from 'vue';
var player = null;

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    console.group("mounted 组件挂载完毕状态===============》");
    this.init(); // 在组件挂载时自动初始化监控组件
  },
  beforeUnmount() {
    console.group("beforeUnmount 组件即将销毁状态===============》");
    this.destroy(); // 在组件销毁时销毁监控组件
  },
  methods: {
    init() {
      if (player) {
        this.destroy();
      }
      player = new EZUIKit.EZUIKitPlayer({
        id: "video-container", // 视频容器ID
        accessToken:
          "ra.6dtpf9yr41val58m8l7b02utb3wzozfk-6bh3jck3p8-12d6ux9-xnmtuumco",
        url: "ezopen://open.ys7.com/BC1950677/1.live",
        // validCode: "yzs123456789@",
        // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
        template: "simple",
        plugin: ["talk"], // 加载插件，talk-对讲
      });
      window.player = player;
    },
    play() {
      var playPromise = player.play();
      playPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    stop() {
      var stopPromise = player.stop();
      stopPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    getOSDTime() {
      var getOSDTimePromise = player.getOSDTime();
      getOSDTimePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    capturePicture() {
      var capturePicturePromise = player.capturePicture(
        `${new Date().getTime()}`
      );
      capturePicturePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    openSound() {
      var openSoundPromise = player.openSound();
      openSoundPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    closeSound() {
      var openSoundPromise = player.closeSound();
      openSoundPromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    startSave() {
      var startSavePromise = player.startSave(`${new Date().getTime()}`);
      startSavePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    stopSave() {
      var stopSavePromise = player.stopSave();
      stopSavePromise.then((data) => {
        console.log("promise 获取 数据", data);
      });
    },
    ezopenStartTalk() {
      player.startTalk();
    },
    ezopenStopTalk() {
      player.stopTalk();
    },
    fullScreen() {
      player.fullScreen();
    },
    destroy() {
      try{
        if (player){
          var destroyPromise = player.destroy();
          destroyPromise.then((data) => {
            console.log("promise 获取 数据", data);
          });
          player = null;
        }
      }catch(error){
        console.error("Error while destroying player:", error);
      }
    }
  },
  watch: {
      // 监听路由变化
      '$route'() {
        this.init();
      }
    }
};
</script>
