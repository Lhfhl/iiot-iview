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
    <h2>信息模型</h2>
    <pre style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd; overflow-x: auto;" class="basic-info info-block">
      <code v-html="highlightedXml"></code>
    </pre>
    <!-- <div class="production-line info-block">
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
    </div> -->
</div>
</template>

<script>
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";

const axios = require('axios');

export default {
  data() {
    return {
      highlightedXml: "", // 保存高亮后的 XML 内容
      showTable: false,
      modelInfo: {}, // 初始化模型信息对象
      lineDetail: [],
      id: 0
    };
  },
  created() {
    // 获取路由传递的 ID
    const id = this.$route.query.id;
    console.log("Model ID:", id);
    // 获取模型信息
    this.fetchModelInfo(id);
  },
  mounted() {
    this.loadXmlFile();
  },
  methods: {
    loadXmlFile() {
      const xmlFilePath = this.searchByID(); // 指定 XML 文件路径
      fetch(xmlFilePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          // 使用新的 highlight.js 方法
          hljs.registerLanguage('xml', xml);
          const result = hljs.highlight(data, { language: 'xml' });
          this.highlightedXml = result.value;
        })
        .catch((error) => {
          console.error("Error loading XML file:", error);
        });
    },
    async fetchModelInfo(id) {
      try {
        this.id = id;
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
    },

    searchByID() {
      if (this.id === 1) {
        return "/xml/IM.xml";
      } else {
        return "/xml/IM2.xml";
      }
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
