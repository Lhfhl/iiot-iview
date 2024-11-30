<template>
    <div class="alarm-container" :class="{ 'alarm-active': isAlarmActive }">
      <img :src="getIconSrc" alt="Alarm Icon" class="alarm-icon" />
    </div>
  </template>

<script>
export default {
  name: "AlarmIndicator",
  data() {
    return {
      isAlarmActive: false, // 用于控制报警的布尔变量
    };
  },
  computed: {
    getIconSrc() {
      return this.isAlarmActive ? require('@/assets/icons/warning.svg') : require('@/assets/icons/normal.svg');
    }
  },
  mounted() {
    // 模拟报警激活，可以用真实逻辑替换这里
    setTimeout(() => {
      this.isAlarmActive = fasle;
    }, 1000);
  },
};
</script>

  <style scoped>
  .alarm-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 200px;
    height: 200px;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: relative;
    margin: 20px auto;
  }

  .alarm-icon {
    width: 190px;
    height: 190px;
    margin: 5px 0 ;
    transition: transform 0.5s ease-in-out;
  }

  .alarm-active .alarm-icon {
    animation: alarm-flash 1s infinite alternate;
  }

  @keyframes alarm-flash {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
