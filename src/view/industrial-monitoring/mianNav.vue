<script>
export default {
  props: {
    nav: {
      type: Array,
      default: () => [],
    },
    activeNav: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [], // 当前标签列表
    },
  },
  data() {
    return {
      currentActiveNav: this.activeNav, // 当前激活的导航项
    };
  },
  watch: {
    activeNav(newVal) {
      this.currentActiveNav = newVal; // 父组件更新时同步更新
    },
  },
  methods: {
    /**
     * 在新标签页中打开路由
     * @param {String} name 路由名称
     */
    openInNewTab(name) {
      const route = this.$router.resolve({ name }); // 解析路由对应的路径
      window.open(route.href, "_blank"); // 在新标签页中打开路径
    },
  },
};
</script>

<template>
  <ul class="main-nav-item">
    <li
      class="ivu-menu-item"
      v-for="item in nav"
      :key="item.name"
      :class="{ 'ivu-menu-item-active': currentActiveNav === item.name }"
    >
      <!-- 使用 openInNewTab 在新标签页打开 -->
      <a @click.prevent="openInNewTab(item.name)">{{ item.meta.title }}</a>
    </li>
  </ul>
</template>

<style scoped>
/* 样式完全保留不变 */
.main-nav-item {
  height: 4rem;
  width: 7rem;
  line-height: 2rem;
  padding: 0; /* 确保无内边距 */
  margin-top: 1rem; /* 确保无外边距 */
  list-style: none; /* 移除默认列表样式 */
}

.main-nav-item .ivu-menu-item {
  position: absolute;
  color: #fff;
  overflow-y: hidden;
  overflow-x: visible;
  background: url('../../assets/images/nav_bg.png') no-repeat center;
  background-size: 100% 100%;
  border: none;
  padding: 0 3rem;
  font-size: 1.2rem;
}

.main-nav-item .ivu-menu-item:hover,
.main-nav-item .ivu-menu-item.ivu-menu-item-active {
  border-width: 1px;
  color: #fff;
  border: none;
  background: url('../../assets/images/nav_bg_cur.png') no-repeat center;
  background-size: 100% 100%;
  cursor: pointer; /* 设置鼠标样式为小手 */
}

/* 位置设置 */
.main-nav-item .ivu-menu-item:nth-of-type(1) {
  left: 20rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(2) {
  left: 30rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(3) {
  left: 40rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(4) {
  left: 50rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(5) {
  left: 60rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(6) {
  left: 70rem;
}

.main-nav-item .ivu-menu-item:nth-of-type(7) {
  left: 80rem;
}
</style>
