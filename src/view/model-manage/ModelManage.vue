<template>
    <div>
      <!-- 按钮区域 -->
      <el-card>
        <div style="margin-bottom: 15px;">
          <button class="btn" @click="resetProductionLine" >产线复位</button>
          <button class="btn" @click="stopResetProductionLine" >停止产线复位</button>
        </div>

      <!-- 模型展示区域 -->

        <el-table v-if="showTable" border :data="models" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266','font-weight': 'bold'}">
          <el-table-column prop="id" label="ID" align="center" width="150">
            <template #default="{ row }">
              <span style="">{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="模型名称" align="center">
            <template #default="{ row }">
              <span style="">{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="300">
            <template #default="{ row }">
              <el-button
                type="primary"
                @click="viewModel(row.id)"
                size="medium"
                style=" margin-right: 10px;"
                class="btn"
              >
                查看模型详情
              </el-button>
              <el-button
                type="success"
                @click="startProduction(row.id)"
                size="medium"
                class="btn"
              >
                开始生产
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
  const axios = require('axios');
  export default {
    data() {
      return {
        //“模型”数据
        showTable: false,
        models : [],  //全部模型信息
        modelInfo: {}, // 初始化模型信息对象
        lineDetail: [],
      };
    },
    created() {
      this.fetchModels();
    },
    methods: {
        async fetchModels() {   //获取全部模型信息
          try {
            const response = await axios.get('/api/admin/model/getAll');
            response.data.data.forEach(model => {
              this.models.push(model);
            });
            this.showTable = true; // 设置条件为true，显示table
          } catch (error) {
            console.error('获取模型列表失败', error);
            // 添加失败提示，例如使用 Element UI 的 Message 组件
            this.$message.error('获取模型列表失败，请稍后重试');
          }
        },
        
        async viewModel(id) {   //查看模型详情
        try {
          const url = `/api/admin/model/getById?id=${id}`;
          const response = await axios.get(url);
          this.modelInfo = response.data.data; // 将获取到的数据保存到组件数据中
          //分割产线字符串
          this.lineDetail = this.splitLineDetails();
          this.$router.push({ name: 'modeldetail', query:{ id } });
        } catch (error) {
            console.error('获取模型信息失败', error);
            // 添加失败提示，例如使用 Element UI 的 Message 组件
            this.$message.error('获取模型信息失败，请稍后重试');
        }
        },

        async startProduction(id) {   // 开始生产
            try {
              // 发起请求开始生产
              await axios.get(`/api/admin/order/order/${id}`);
              console.log('开始生产成功');
              // 添加成功提示，例如使用 Element UI 的 Message 组件
              this.$message.success('开始生产成功');
              // 导航到订单管理页面
              this.$router.push({ name: 'ordermanagement' });
            } catch (error) {
              console.error('开始生产失败', error);
              // 添加失败提示，例如使用 Element UI 的 Message 组件
              this.$message.error('开始生产失败，请稍后重试');
            }
        },
        
        async resetProductionLine() {
        try {
            // 发起请求产线复位
            await axios.get('/api/admin/line/reset');
            console.log('产线复位成功');
            // 添加成功提示，例如使用 Element UI 的 Message 组件
            this.$message.success('产线复位成功');
          } catch (error) {
            console.error('产线复位失败', error);
            // 添加失败提示，例如使用 Element UI 的 Message 组件
            this.$message.error('产线复位失败，请稍后重试');
          }
        },

        async stopResetProductionLine() {
          try {
              // 发起请求停止产线复位
              await axios.get('/api/admin/line/stopReset');
              console.log('停止产线复位成功');
              // 添加成功提示，例如使用 Element UI 的 Message 组件
              this.$message.success('停止产线复位成功');
            } catch (error) {
              console.error('停止产线复位失败', error);
              // 添加失败提示，例如使用 Element UI 的 Message 组件
              this.$message.error('停止产线复位失败，请稍后重试');
            }
        },
        //“分割产线”函数
        splitLineDetails() {
          // 检查 modelInfo.lineDetails 是否存在，如果不存在返回空数组
          if (!this.modelInfo.lineDetails) return [];
          
          // 使用逗号分割 lineDetails，并返回分割后的数组
          return this.modelInfo.lineDetails.split(',');
        },
    }
  };
</script>
  
<style scoped>
  .container {
    padding: 20px;
    background-color: #ffffff; /* 设置背景颜色为纯白色 */
    border-radius: 8px; /* 添加圆角边框 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    padding: 10px;
    text-align: center; /* 居中对齐 */
    border-right: 1px solid #e0e0e0; /* 设置每一列的竖直分割线 */
    border-bottom: 1px solid #e0e0e0; /* 设置每一行的水平分割线 */
  }
  
  th:first-child, td:first-child {
    border-left: 1px solid #e0e0e0; /* 设置第一列的竖直分割线 */
  }
  
  th {
    background-color: #f5f5f5; /* 设置表头背景颜色为浅灰色 */
  }
  
  .btn {
    padding: 6px 12px;
    border: none;
    background-color: #007bff; /* 设置按钮背景颜色为蓝色 */
    color: #ffffff; /* 设置按钮文字颜色为白色 */
    border-radius: 4px; /* 添加圆角边框 */
    cursor: pointer;
    transition: background-color 0.3s ease; /* 添加过渡效果 */
    flex: 1; /* 使按钮占据等分的宽度 */
    margin: 0 30px; /* 设置按钮的外边距为 10px */
  }
  
  .btn:hover {
    background-color: #0056b3; /* 鼠标悬停时按钮背景颜色变深 */
  }

.btn:first-child {
  margin-left: 0; /* 第一个按钮左边距为 0 */
}

.btn:last-child {
  margin-right: 0; /* 最后一个按钮右边距为 0 */
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.close-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #0056b3;
}

/* 调整每行文字间距 */
.info-item {
  line-height: 1.5; /* 设置行高为1.5倍文字大小 */
}

.step-number {
  /* 添加边缘线样式 */
  border: 0.7px solid black; /* 边缘线样式：2px的黑色实线 */
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ffffff; /* 背景色 */
  color: #000000; /* 文字颜色 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px; /* 调整与文字之间的间距 */
}
</style>