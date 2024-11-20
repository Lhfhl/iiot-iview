<template>
  <div class="model-info" v-if="showTable">
    <h2>模型详情</h2>

    <!-- 基本信息 -->
    <div class="basic-info info-block">
      <h3>基本信息</h3>
      <div class="info-item">
        <span class="label">ID:</span>
        <span class="value">{{ modelInfo.id }}</span>
      </div>
      <div class="info-item">
        <span class="label">模型名称:</span>
        <span class="value">{{ modelInfo.name }}</span>
      </div>
      <div class="info-item">
          <span class="label">模型状态:</span>
          <span class="value" v-if="modelInfo.status === 1">
              可生产
          </span>
          <span class="value" v-else-if="modelInfo.status === 0">
              停产
          </span>
          <span class="value" v-else>
              未知状态
          </span>
          </div>
    </div>

    <!-- 模型生产线 -->
    <h2>模型生产线</h2>
    <div class="production-line info-block">
    <div class="step-grid">
      <div v-for="(step, index) in lineDetail" :key="index" class="step-item">
        <div class="step-content">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-details">{{ step }}</div>
          <div class="step-image">
            <img v-if="findStepInPipeline(step)" :src="findStepInPipeline(step).url" :alt="findStepInPipeline(step).process" />
          </div>
        </div>
      </div>
    </div>
    </div>
</div>
</template>

<script>
const axios = require('axios');

export default {
  data() {
    return {
      showTable: false,
      modelInfo: {}, // 初始化模型信息对象
      lineDetail: [],
      pipeline: [{
          class:"铣床",
          process: "路径参数设置",
         url: "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3535650726,1744382531&fm=199&app=68&f=JPEG?w=750&h=750&s=B291356064A682BE9AA928160100D0E2",
          seen: "true",
        },
        {class:"料库",
          process: "订单出库",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1925937780,3311737653&fm=199&app=68&f=JPEG?w=750&h=750&s=3D8870334E377388CEC814C70100A0A0",
          seen: "true",
        },
        {class:"料库",
          process: "料库>>>铣床",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2565862764,3139638590&fm=199&app=68&f=JPEG?w=640&h=640&s=02B0632266C7B3AFFA18C1B6010050E2",
          seen: "true",
        },
        {class:"铣床",
          process: "铣床加工",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3900055160,970367034&fm=199&app=68&f=JPEG?w=640&h=640&s=11B8EC3044E667ABEF311DC70100E0E1",
          seen: "true",
        },
        {class:"铣床",
          process: "铣床>>>车床",
          url: "https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2252806894,2420454989&fm=199&app=68&f=JPEG?w=640&h=640&s=479AE52208B74FA91B3989D7010080E2",
          seen: "true",
        },
        {class:"车床",
          process: "车床加工",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2565862764,3139638590&fm=199&app=68&f=JPEG?w=640&h=640&s=02B0632266C7B3AFFA18C1B6010050E2",
          seen: "true",
        },
        {class:"车床",
          process: "车床>>>检测",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1925937780,3311737653&fm=199&app=68&f=JPEG?w=750&h=750&s=3D8870334E377388CEC814C70100A0A0",
          seen: "true",
        },
        {class:"检测",
          process: "视觉检测",
          url: "https://jmy-pic.baidu.com/0/pic/-1105111569_1549761291_1684186752.png",
          seen: "true",
        },
        {class:"组装",
          process: "组装",
          url: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3900055160,970367034&fm=199&app=68&f=JPEG?w=640&h=640&s=11B8EC3044E667ABEF311DC70100E0E1",
          seen: "true",
        },
        {class:"铣床",
          process: "入库",
          url: "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3535650726,1744382531&fm=199&app=68&f=JPEG?w=750&h=750&s=B291356064A682BE9AA928160100D0E2",
          seen: "true",
        },
     
    ],
    };
  },
  created() {
    // 获取路由传递的 ID
    const id = this.$route.query.id;
    // 获取模型信息
    this.fetchModelInfo(id);
  },
  methods: {
    async fetchModelInfo(id) {
      try {
        const url = `/api/admin/model/getById?id=${id}`;
        const response = await axios.get(url);
        //分割产线字符串
        this.modelInfo = response.data.data; // 将获取到的数据保存到组件数据中
        this.lineDetail = this.splitLineDetails();
        this.showTable = true; // 设置条件为true，显示table
      } catch (error) {
        console.error('Failed to fetch model information:', error);
      }
    },
    //“分割产线”函数
    splitLineDetails() {
      // 检查 modelInfo.lineDetails 是否存在，如果不存在返回空数组
      if (!this.modelInfo.lineDetails) return [];
      
      // 使用逗号分割 lineDetails，并返回分割后的数组
      return this.modelInfo.lineDetails.split(',');
    },
    
    findStepInPipeline(oneStep) {
      // 遍历 pipeline 数组
      for (let i = 0; i < this.pipeline.length; i++) {
          // 如果找到了与 lineStep 相匹配的步骤，则返回该步骤
          if (this.pipeline[i].process === oneStep) {
              return this.pipeline[i];
          }
      }
      // 如果未找到匹配的步骤，则返回 null 或者其他适当的值
      return null;
    }

  }
};
</script>

<style scoped>
.model-info {
  padding: 20px;
}

.info-block {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

.info-block h3 {
  margin-bottom: 10px;
}

.info-item {
  margin-bottom: 5px;
}

.label {
  font-weight: bold;
  margin-right: 5px;
}

.value {
  color: #333;
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

.production-line {
    margin-top: 20px;
  }

  .step-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 每个格子最小200px宽度，自动填充 */
    gap: 10px; /* 设置格子之间的间距 */
  }

  .step-item {
    border: 1px solid #ccc;
    padding: 10px;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .step-number {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .step-image img {
    max-width: 100px;
    max-height: 100px;
  }
</style>
