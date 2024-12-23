<template>
  <ScaleScreen
    :width="1920"
    :height="1080"
    class="scale-wrap"
    :selfAdaption="$store.state.setting.isScale"
  >
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <!-- 头部 -->
        <div class="d-flex jc-center title_wrap">
          <div class="zuojuxing"></div>
          <div class="youjuxing"></div>
          <div class="guang"></div>
          <div class="d-flex jc-center">
            <div class="title">
              <span class="title-text">工业产线可视化监控</span>
            </div>
          </div>
          <!-- 导航栏 -->
          <main-nav
            :nav="nav"
            :activeNav="activeNav"
            class="main-nav"
            @update:activeNav="handleNavChange"
          />
          <!-- 时间 -->
          <div class="timers">
            {{ dateYear }} {{ dateWeek }} {{ dateDay }}
            <i
              class="blq-icon-shezhi02"
              style="margin-left: 10px"
              @click="showSetting"
            ></i>
          </div>
        </div>
        <!-- 内容区域 -->
        <router-view></router-view>
      </div>
    </div>
    <Setting ref="setting" />
  </ScaleScreen>
</template>

<script>
import { formatTime } from "../../utils/index.js";
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";
import mainNav from "./mianNav.vue";

export default {
  components: {
    Setting,
    ScaleScreen,
    mainNav,
  },

  data() {
    return {
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      activeNav: this.$route.name || "line-monitoring", // 从路由初始化激活导航项
      nav: [ // 导航数据
        { name: "line-monitoring", link: "", meta: { title: "产线监控" } },
        { name: "ordermanagement", link: "", meta: { title: "订单管理" } },
        { name: "line-customization", link: "", meta: { title: "产线定制" } },
        { name: "modelmanagement", link: "", meta: { title: "模型管理" } },
        { name: "resourcemonitoring", link: "", meta: { title: "资源管理" } },
        { name: "resourcescheduling", link: "", meta: { title: "资源调度" } },
        { name: "safetywarning", link: "", meta: { title: "工业安全预警" } },
      ],
    };
  },
  mounted() {
    this.timeFn(); // 启动时间更新
    this.cancelLoading(); // 模拟加载完成
    this.syncActiveNav(); // 初始化时同步导航状态
  },
  watch: {
    $route(to) {
      this.syncActiveNav(); // 路由变化时同步导航状态
    },
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    syncActiveNav() {
      // 根据当前路由动态更新 activeNav
      const routeName = this.$route.name;
      if (this.nav.some(item => item.name === routeName)) {
        this.activeNav = routeName;
      }
    },
    showSetting() {
      this.$refs.setting.init(); // 打开设置窗口
    },
    timeFn() {
      // 启动定时器，更新时间
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    cancelLoading() {
      // 模拟加载完成
      let timer = setTimeout(() => {
        this.loading = false;
        clearTimeout(timer);
      }, 500);
    },
    handleNavChange(newNav) {
      // 子组件通知父组件激活的导航项
      this.activeNav = newNav;
      this.$router.push({ name: newNav }); // 跳转到对应路由
    },
  },
};
</script>

<style>
@import "./home.css";
body {
  background-color: black; /* 设置背景为黑色 */
}

.full-screen-container {
  position: relative;
  background: -webkit-linear-gradient(left, #081a43, #0a3267, #071f56);
}

.full-screen-container .main-box {
  padding: 0 1%;
}

.full-screen-container .ivu-layout-header .logo {
  position: absolute;
  top: 1%;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  line-height: 2rem;
  z-index: 901;
  background-size: 100%;
  padding: 0 6rem;
  overflow: hidden;
  height: 4rem;
}

.full-screen-container .ivu-layout-header .logo h1 {
  color: #46abdd;
  font-size: 1.6rem;
  display: inline;
  vertical-align: middle;
  padding-left: 0.1rem;
}

.full-screen-container .ivu-layout-header .logo img {
  width: 2rem;
  vertical-align: middle;
}

.full-screen-container .main-nav {
  background: transparent !important;
}

.full-screen-container .main-nav::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: -1; /* 确保遮罩位于底层 */
}
</style>
