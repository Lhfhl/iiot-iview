<template>
  <div class="order-table" >
    <!-- 表格 -->
    <el-card>
      <el-table
      :data="orders"
      style="width: 100%"
      border
      :header-cell-style="{background:'#eef1f6',color:'#606266','font-weight': 'bold'}">
        <!-- 订单号 -->
        <el-table-column
          prop="orderNumber"
          label="订单号"
          align="center">
          <template #default="{ row }">
            <span style="font-size: 12px;">{{ row.orderNumber }}</span>
          </template>
        </el-table-column>

        <!-- 下单时间 -->
        <el-table-column
          prop="orderTime"
          label="下单时间"
          align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.orderTime) }}</span>
          </template>
        </el-table-column>

        <!-- 模型名称 -->
        <el-table-column
          prop="modelName"
          label="模型名称"
          align="center">
          <template #default="{ row }">
            <span>{{ row.modelName }}</span>
          </template>
        </el-table-column>

        <!-- 生产进度 -->
        <el-table-column
          label="生产进度"
          align="center">
          <template #default="{ row }">
            <progress-bar
              :percentage="progress[row.orderNumber] || 0"
              :format="format"
              class="custom-progress">
            </progress-bar>
          </template>
        </el-table-column>

        <!-- 操作按钮 -->
        <el-table-column
          label="操作"
          align="center">
          <template #default="{ row }">
            <el-button
              @click="stopProduction(row.orderNumber)"
              type="danger"
              size="large">
              停产
            </el-button>
            <!-- <el-button
              v-else
              type="success"
              size="large">
              确定
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import ProgressBar from '@/components/charts/ProgressBar.vue'; // 导入进度条组件

export default {
  components: {
    ProgressBar // 注册进度条组件
  },
  data() {
    return {
      orders: [], // 存储订单信息的数组
      progress: {}, // 存储每个订单的进度
      intervalId: null // 存储定时器ID
    };
  },
  created() {
    // 在组件创建时获取订单信息
    this.fetchOrders();
  },
  mounted(){
      // 设置每5分钟刷新一次进度条
      this.intervalId = setInterval(() => {
        this.updateProgress();
      }, 300000); // 5分钟 = 300000毫秒
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    clearInterval(this.intervalId);
  },
  methods: {
    updateProgress() {
      this.orders.forEach(order => {
        if (this.progress[order.orderNumber] <= 100) { // 检查当前进度是否已达到100%
          const new_progress = this.calculateProgress(order.orderTime);
          this.$set(this.progress, order.orderNumber, new_progress);
          this.$forceUpdate(); // 确保在 DOM 更新后强制渲染
        }
      });
    },
    format(percentage) {
      return percentage === 100 ? '生产完成' : `${percentage}%`;
    },
    async fetchOrders() {
      try {
        this.orders = [];
        this.progress = {}; // 重置进度
        const response = await axios.get('/api/admin/order/order/getAll');
        response.data.data.forEach(order => {
          this.orders.push(order);
          console.log(order.orderTime)
          this.progress[order.orderNumber] = this.calculateProgress(order.orderTime); // 初始化进度
        });
      } catch (error) {
        console.error('获取订单信息失败', error);
        this.$message.error('获取订单信息失败，请稍后重试');
      }
    },
    async stopProduction(orderNumber) {
      try {
        // 发起请求停止生产
        await axios.get(`/api/admin/order/order/stop/${orderNumber}`);
        this.$message({
          message: '停止生产成功',
          type: 'success'
        });
        console.log('停产成功');
        // 刷新订单信息
        this.fetchOrders();
      } catch (error) {
        this.$message.error({
          message: '停止生产失败',
        });
        console.error('停产失败', error);
        // 可以添加失败提示
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
    calculateProgress(orderTime) {
      const now = new Date();
      const orderDate = new Date(orderTime[0], orderTime[1] - 1, orderTime[2], orderTime[3], orderTime[4], orderTime[5]); // 根据你的日期时间格式化
      console.log(orderTime)
      console.log(orderDate)
      const diffInMinutes = (now - orderDate) / 1000 / 60; // 计算时间差（分钟）
      console.log("calculateProgress"+diffInMinutes)
      const progress = Math.min(100, Math.floor(diffInMinutes / 5 + 1) * 10); // 加一代表初始进度为10%，每5分钟增加10%的进度
      return progress;
    },

  }
};
</script>

<style scoped>
  .order-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .order-table th, .order-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .order-table th {
    background-color: #f5f5f5;
  }
  
  .order-table button {
    padding: 6px 12px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .order-table button:hover {
    background-color: #0056b3;
  }
  th{
    font-size: 1.6em;
  }

  .custom-progress >>> .el-progress-bar__innerText {
    color: #FFFF99 !important; /* 强制调整进度条内的文字颜色 */
    font-size: 16px; /* 调整字体大小 */
  }
</style>
  