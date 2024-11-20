<template>
  <div>
    <el-card :style="{ height: cardHeight }">
      <el-row style="display: flex; justify-content: center;">
        <!-- 左半部分，用图形表示数据类型 -->
        <el-col :offset="4" :span="12" style="">
          <i :class="iconClass" :style="{ fontSize: iconSize }"></i>
        </el-col>

        <!-- 右半部分，文字和数值 -->
        <el-col :span="12" style="display: flex; flex-direction: column; justify-content: center;">
          <span :style="{ fontSize: '14px', color: '#000000' }">{{ label }}</span> <!-- 文字 -->
          <el-row>
            <span :style="{ fontSize: '20px', fontWeight: 'bold', color: '#333' }">{{ value }}</span> <!-- 数值 -->
            <span :style="{ fontSize: '15px', fontWeight: 'bold', color: '#333', marginLeft:'3px' }">{{ unit }}</span>
            <!-- 单位 -->
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DataCard",
  props: {
    // 数据类型的文字描述
    label: {
      type: String,
      required: true,
    },
    // 数值
    value: {
      type: [Number, String],
      required: true,
    },
    // 图标的类名
    iconClass: {
      type: String,
      default: 'el-icon-s-data', // 默认图标
    },
    // 图标大小
    iconSize: {
      type: String,
      default: '40px', // 默认图标大小
    },
    // 卡片宽度
    cardWidth: {
      type: String,
      default: '300px',
    },
    // 卡片高度
    cardHeight: {
      type: String,
      default: '100px',
    },
    unit: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
/* 自定义样式，如果需要更多的样式，可以添加在这里 */
</style>
