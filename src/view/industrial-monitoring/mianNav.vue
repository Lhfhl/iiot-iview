<!-- eslint-disable no-unused-vars -->
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
  },
  data() {
    return {
      currentActiveNav: this.activeNav, // 初始值
    };
  },
  watch: {
    activeNav(newVal) {
      this.currentActiveNav = newVal; // 监听父组件更新
    },
    $route(to) {
      this.currentActiveNav = to.name; // 路由变化时更新
    },
  },
  methods: {
    tolink(name) {
      if (this.currentActiveNav === name) return; // 防止重复点击
      this.currentActiveNav = name;
      this.$emit("update:activeNav", name); // 通知父组件更新
      if (this.$router) {
        this.$router.push({ name }); // 跳转路由
      }
    },
  },
};
</script>

<template>
  <!-- <ElMenu mode="horizontal" :active-name="currentActiveNav" @select="tolink"> -->
    <ul class="main-nav-item">
      <li
        class="ivu-menu-item"
        v-for="item in nav"
        :key="item.name"
        :class="{ 'ivu-menu-item-active': currentActiveNav === item.name }"
      >
        <a @click.prevent="tolink(item.name)">{{ item.meta.title }}</a>
      </li>
    </ul>
  <!-- </ElMenu> -->
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
