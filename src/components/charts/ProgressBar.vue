<!-- src/components/ProgressBar.vue -->
<template>
    <el-progress
      :text-inside="true"
      :stroke-width="strokeWidth"
      :percentage="percentage"
      :format="format"
      >
    </el-progress>
  </template>
  
  <script>
  export default {
    props: {
      percentage: {
        type: Number,
        required: true
      },
      strokeWidth: {
        type: Number,
        default: 26
      }
    },
    methods: {
        format(percentage) {
            return percentage === 100 ? '生产完成' : `${percentage}%`;
        },
    }
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加进度条组件的样式 */
  </style>
  