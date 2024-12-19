<template>
  <div class="progress-container">
    <div class="progress-box">
      <h3>先车后铣</h3>
      <div class="nodes">
        <template v-for="(node, index) in process1">
          <!-- 节点 -->
          <div
            class="node"
            :key="'process1-node-' + index"
            :class="{ active: progress1 >= index + 1 }"
          >
            <span>{{ node }}</span>
          </div>
          <!-- 自定义箭头图标 -->
          <div
            v-if="index < process1.length - 1"
            class="arrow"
            :key="'process1-arrow-' + index"
          >
            <img
              src="@/assets/icons/arrowhead.svg"
              alt="arrow"
            />
          </div>
        </template>
      </div>
    </div>

    <div class="progress-box">
      <h3>先铣后车</h3>
      <div class="nodes">
        <template v-for="(node, index) in process2">
          <!-- 节点 -->
          <div
            class="node"
            :key="'process2-node-' + index"
            :class="{ active: progress2 >= index + 1 }"
          >
            <span>{{ node }}</span>
          </div>
          <!-- 自定义箭头图标 -->
          <div
            v-if="index < process2.length - 1"
            class="arrow"
            :key="'process2-arrow-' + index"
          >
            <img
              src="@/assets/icons/arrowhead.svg"
              alt="arrow"
              :class="{ active: progress2 > index + 1 }"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 节点数据
const process1 = ref(["订单出库", "车床加工", "铣床加工", "视觉检测", "组装"]);
const process2 = ref(["订单出库", "铣床加工", "车床加工", "视觉检测", "组装"]);

// 模拟后端传来的进度数据
const progress1 = ref(0); // 先车后铣，保持常暗
const progress2 = ref(0); // 先铣后车，动态变化

let intervalId = null;

// 自动更新进度
const startProgress = () => {
  intervalId = setInterval(() => {
    if (progress2.value < process2.value.length) {
      progress2.value++;
    } else {
      progress2.value = 0; // 重置进度
    }
  }, 5000); // 每5秒更新一次进度
};

// 生命周期钩子
onMounted(() => {
  startProgress();
});

onUnmounted(() => {
  clearInterval(intervalId); // 清除定时器
});
</script>

<style scoped>
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  font-family: Arial, sans-serif;
  background: linear-gradient(to bottom, #0d1b2a, #1b263b, #415a77); /* 蓝黑渐变背景 */
  border-radius: 10px;
}

.progress-box {
  border: 1px solid #2b3a5a;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.5);
  background-color: #1b263b;
}

h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #a6c4e0;
  font-weight: bold;
}

.nodes {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node {
  width: 120px;
  height: 50px;
  border: 2px solid #3a506b;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1e3a5f;
  color: #9bb1d6;
  font-weight: bold;
  transition: all 0.5s ease-in-out;
}

.node.active {
  background-color: #0077b6;
  color: #e0f7fa;
  border-color: #0077b6;
  box-shadow: 0px 0px 12px rgba(0, 119, 182, 0.8);
}

.arrow img {
  width: 30px;
  height: 30px;
  filter: brightness(0.6) sepia(1) hue-rotate(160deg) saturate(5); /* 蓝色调 */
  transition: all 0.5s ease-in-out;
}

.arrow img.active {
  filter: brightness(1) saturate(2);
  transform: scale(1.1); /* 箭头点亮时放大 */
}
</style>
