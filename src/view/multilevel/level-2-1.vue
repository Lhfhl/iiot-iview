<template>
  <div>
    <el-card style="display: flex; align-items: center;">
      <el-row style="width: 100%; display: flex; align-items: center;">
        <!-- 左半部分，用图形表示数据类型 -->
        <el-col :span="8" style="display: flex; justify-content: center; align-items: center;">
          <i class="el-icon-s-data" style="font-size: 40px; color: #409EFF;"></i> <!-- 可以替换成其他图标 -->
        </el-col>

        <!-- 右半部分，文字和数值 -->
        <el-col :span="16" style="display: flex; flex-direction: column; justify-content: center; margin-left: 10px;">
          <span style="font-size: 14px; color: #999;">数据类型</span>  <!-- 文字 -->
          <span style="font-size: 20px; font-weight: bold; color: #333;">12345</span> <!-- 数值 -->
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DataCard"
};
</script>

<style scoped>
/* 自定义样式，如果需要更多的样式，可以添加在这里 */
</style>
