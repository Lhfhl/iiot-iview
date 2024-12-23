<template>
    <div slot="body" style="height:100%; width:100%;">
        <div style="height:100%;">
            <iframe :src="flowSrc" style="height:100%; width:100%;margin:0;border:0;"> </iframe>
        </div>
    </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default {
  data() {
    return {
      flowSrc: null,
      messages: [], // 存储收到的消息
      message: '', // 输入框中的消息
      stompClient: null // stomp客户端
    }
  },
  created() {
    this.preview();
    this.connect(); // 页面创建时建立WebSocket连接
  },
  methods: {
    preview() {
      this.flowSrc = 'http://10.112.196.200:1880'; // 直接给flowSrc赋值链接
    },
    connect() {
      // 创建SockJS连接并初始化STOMP客户端
      const socket = new SockJS('/nodeRedLineVideo'); // WebSocket服务端地址
      this.stompClient = Stomp.over(socket);

      // 连接到WebSocket服务器
      this.stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // 订阅"/topic/messages"频道，收到消息后更新消息列表
        this.stompClient.subscribe('/topic/messages', message => {
          // this.messages.push(message.body); // 将接收到的消息添加到列表中
          console.log('收到消息: ' + message.body); // 这里可以在前端显示消息
          // 判断消息内容，若为"流程完毕"，则打开新的标签页
          if (message.body === '流程完毕') {
            // 打开新的浏览器标签页并加载指定页面
            window.open('/line-video/line-video', '_blank', 'width=600,height=400');
          }
        });
      });
    },
  }
}
</script>
