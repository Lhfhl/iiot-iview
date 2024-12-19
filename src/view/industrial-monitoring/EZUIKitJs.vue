<template>
  <!-- <div class="video-wrapper">  -->
    <div class="hello-ezuikit-js">
      <div id="video-container" class="video-wrapper"></div>
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
  <!-- </div> -->
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
          "at.a8bbs23t9k56dsj5cn6699un5owkuivf-7i0fxnphq3-0kvxjck-9v9bjzcux",
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
    // capturePicture() {
    //   var capturePicturePromise = player.capturePicture(`${new Date().getTime()}`);
    //   capturePicturePromise.then((data) => {
    //     console.log("promise 获取 数据", data);
    //     // 使用 base64 数据创建 Blob 对象
    //     const base64Data = data.data.base64;
    //     const blob = this.dataURItoBlob(base64Data);

    //     // 创建一个下载链接并触发下载
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = data.data.fileName; // 使用返回的文件名
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url); // 释放URL对象
    //   }).catch((error) => {
    //     console.error('Capture picture error:', error);
    //   });
    // },

    // // 将 data URI 转换为 Blob 对象
    // dataURItoBlob(dataURI) {
    //   // 将 base64 字符串转换为 ArrayBuffer
    //   const byteString = atob(dataURI.split(',')[1]);
    //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   return new Blob([ab], {type: mimeString});
    // },
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
      try {
        if (player) {
          var destroyPromise = player.destroy();
          destroyPromise.then((data) => {
            console.log("promise 获取 数据", data);
          });
          player = null;
        }
      } catch (error) {
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

<style scoped>
.video-wrapper {
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 110%; /* 占满视口宽度 */
  height: 110%; /* 占满视口高度 */
  background-color: black; /* 父容器背景为黑色 */

}

</style>
