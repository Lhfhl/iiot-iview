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
                <span class="labels ">ID：</span>
                <span class="contents zhuyao"> {{item.id}}</span>
              </div>
              <div class="info">
                <span class="labels">完成时间：</span>
                <span class="contents "> {{item.completeTime === null || item.completeTime === undefined ? 'null' : item.completeTime }}</span>
              </div>
              <div class="info">
                <span class="labels1">模型名称：</span>
                <span class="contents warning"> {{ item.modelName }}</span>
              </div>
            </div>

            <div class="flex">

              <div class="info">
                <span class="labels"> 产线地址：</span>
                <span class="contents ciyao" style="font-size:12px"> 北京市大兴区仪综所</span>
              </div>
              <div class="info time">
                <span class="labels1">时间：</span>
                <span class="contents" style="font-size:12px"> {{ formatDateTime(item.orderTime) }}</span>
              </div>

            </div>
            <div class="flex">

              <div class="info">
                <span class="labels">订单号：</span>
                <span class="contents ciyao" :class="{ warning: item.detail }"> {{ item.orderNumber || '无'
                }}</span>
              </div>
            </div>
            <!-- <div class="dibu"></div> -->
          </div>
        </li>

        <li class="right_center_item" v-if="list.length > 0" :key="'virtual-item'">
    <span class="orderNum"></span>
    <div class="inner_right">
      <div class="dibu"></div>
      <!-- 添加第一项的内容 -->
    </div>
  </li>

      </ul>
    </component>
  </div>
  <Reacquire v-else @onclick="getData" style="line-height:200px" />

</template>

<!-- <script>
import axios from 'axios';
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
created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.pageflag = true;
        this.list = []; // 清空列表数据

        // 调用后端接口获取数据
        const response = await axios.get('/api/admin/order/order/getAll');
        console.log('接口返回数据：', response.data);
        if (response.data && Array.isArray(response.data)) {
          this.list = response.data.map(order => ({
            id: order.id, // ID
            orderNumber: order.orderNumber, // 订单号
            status: order.status, // 状态
            modelName: order.modelName, // 模型名称
            orderTime: order.orderTime, // 时间数组
          }));
        } else {
          console.error('接口数据格式错误：', response.data);
          this.pageflag = false;
          this.$message.warning('接口返回数据格式错误');
        }
      } catch (error) {
        console.error('数据获取失败：', error);
        this.pageflag = false; // 显示失败状态
        this.$message.error('获取数据失败，请稍后重试');
      }
    },
  },
  formatDateTime(dateTimeArray) {
      if (!dateTimeArray || dateTimeArray.length !== 6) return ''; // 如果时间数组为空或长度不为6，则返回空字符串
      const year = dateTimeArray[0];
      const month = String(dateTimeArray[1]).padStart(2, '0');
      const day = String(dateTimeArray[2]).padStart(2, '0');
      const hours = String(dateTimeArray[3]).padStart(2, '0');
      const minutes = String(dateTimeArray[4]).padStart(2, '0');
      const seconds = String(dateTimeArray[5]).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
};

</script> -->

<script>
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll"; // vue2 引入方式
import Kong from "../../components/kong/kong.vue";

export default {
  components: { vueSeamlessScroll, Kong },

  data() {
    return {
      list: [], // 滚动数据列表
      pageflag: true, // 页面加载标志
      autoScrollTimer: null, // 自动滚动定时器
      defaultOption: {
        limitMoveNum: 1, // 每次滚动的条目数
        singleHeight: 250, // 每条数据的高度
        waitTime: 3000, // 每条滚动间隔时间 (3s)
        step: 3, // 滚动速度
        hoverStop: true, // 鼠标悬停时停止滚动
      },
    };
  },
  computed: {
    sbtxSwiperFlag() {
      const ssyjSwiper = this.$store.state.setting.ssyjSwiper;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.components = ssyjSwiper ? vueSeamlessScroll : Kong;
      return ssyjSwiper;
    },
  },
  created() {
    this.getData(); // 获取数据
    this.startAutoScroll(); // 启动自动滚动
  },
  destroyed() {
    clearInterval(this.autoScrollTimer); // 清除滚动定时器
  },
  watch: {
    list(newList, oldList) {
      if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
        this.resetAutoScroll(); // 数据变动时重置滚动逻辑
      }
    },
  },
  methods: {
    async getData() {
      try {
        this.pageflag = true;
        const response = await axios.get('/api/admin/order/order/getAll');
        console.log('接口返回数据：', response.data);

        // 确保数据是数组
        if (response.data && Array.isArray(response.data)) {
          this.list = response.data.map(item => ({
            id: item.id || '未知',
            orderNumber: item.orderNumber || '无',
            status: item.status || '未知状态',
            modelName: item.modelName || '无',
            orderTime: item.orderTime || [], // 确保 orderTime 是数组
          }));
        } else {
          console.error('数据格式错误：', response.data);
          this.pageflag = false;
        }
      } catch (error) {
        console.error('数据获取失败：', error);
        this.pageflag = false;
      }
    },
    formatDateTime(dateTimeArray) {
      if (!dateTimeArray || dateTimeArray.length !== 6) return ''; // 如果时间数组为空或长度不为6，则返回空字符串
      const year = dateTimeArray[0];
      const month = String(dateTimeArray[1]).padStart(2, '0');
      const day = String(dateTimeArray[2]).padStart(2, '0');
      const hours = String(dateTimeArray[3]).padStart(2, '0');
      const minutes = String(dateTimeArray[4]).padStart(2, '0');
      const seconds = String(dateTimeArray[5]).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    startAutoScroll() {
      // 每隔 5 秒触发滚动
      this.autoScrollTimer = setInterval(() => {
        if (this.list.length > 0) {
          this.triggerScroll(); // 触发滚动
        }
      }, 5000); // 每隔 5 秒
    },
    resetAutoScroll() {
      // 数据更新后重置滚动定时器
      clearInterval(this.autoScrollTimer);
      this.startAutoScroll();
    },
    triggerScroll() {
      // vueSeamlessScroll 会根据数据变化自动滚动，这里不需要手动操作 DOM
      // console.log("触发滚动行为");
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

.dibu {
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
