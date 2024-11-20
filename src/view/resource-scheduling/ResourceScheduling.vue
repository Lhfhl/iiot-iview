<template>
  <div>
    <el-card>
      <el-row :gutter="10"> 
        <!-- 云边资源容器调度 -->
        <el-col :span="12"> 
          <el-card>
            <h2>云边资源容器调度</h2>
            <!-- <div class="tabs">
                <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基本信息</button>
                <button :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">容器配置</button>
            </div> -->
            <!-- 基本信息页面 -->
            <div style="margin: 10% 10% 0;" type="flex"  justify="center">
              <el-form  label-position="left" class="form-section" :rules="rules1" :model="form" label-width="auto" ref="form">
                <el-form-item label="部署名称：" prop="deployname" class="input_label">
                  <el-input placeholder="deploy-name" v-model="form.deployname" class="input_content"></el-input>
                </el-form-item>
                <el-form-item label="命名空间：" prop="namespace" class="input_label">
                  <el-input placeholder="default" v-model="form.namespace" class="input_content"></el-input>
                </el-form-item>
                <el-form-item label="副本数：" prop="replicas" class="input_label">
                  <el-input placeholder="1" v-model="form.replicas" class="input_content"></el-input>
                </el-form-item>
                <el-form-item label="调度器：" prop="scheduler">
                  <el-select v-model="form.scheduler" placeholder="请选择" :teleported="false">
                    <el-option label="k8s-default" :value="1"></el-option>
                    <el-option label="edge-sceduler" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="云边调度：" prop="scheduler_positon">
                  <el-select v-model="form.scheduler_positon" placeholder="请选择" >
                    <el-option label="边端" :value="1"></el-option>
                    <el-option label="云端" :value="0"></el-option>
                    <el-option label="任意" :value="2"></el-option>
                  </el-select>
                </el-form-item>

                <!-- 容器配置页面 -->
                <el-form-item label="容器名称：" prop="container_name">
                  <el-input placeholder="containerid-01" v-model="form.container_name" class="input_content"></el-input>
                </el-form-item>
                <el-form-item label="镜像名称：" prop="image_name">
                  <el-input placeholder="" v-model="form.image_name" class="input_content"></el-input>
                </el-form-item>
                <el-form-item label="镜像版本：" prop="image_version">
                  <el-input placeholder="latest" v-model="form.image_version" class="input_content"></el-input>
                </el-form-item>
                <!-- 容器 "CPU" 需求和限制 -->
                <div class="flex-container">
                  <el-form-item label="cpu需求：" prop="cpu_request" class="flex-item">
                    <el-input placeholder="200m" v-model="form.cpu_request" class="inputform"></el-input>
                  </el-form-item>
                  <el-form-item label="cpu限制：" prop="cpu_limit" class="flex-item">
                    <el-input placeholder="200m" v-model="form.cpu_limit" class="inputform"></el-input>
                  </el-form-item>
                </div>
                <!-- 容器 "内存" 需求和限制 -->
                <div class="flex-container">
                  <el-form-item label="mem需求：" prop="mem_request" class="flex-item">
                    <el-input placeholder="200Mi" v-model="form.mem_request" class="inputform"></el-input>
                  </el-form-item>
                  <el-form-item label="mem限制：" prop="mem_limit" class="flex-item">
                    <el-input placeholder="200Mi" v-model="form.mem_limit" class="inputform"></el-input>
                  </el-form-item>
                </div>
                <!-- 选择是否需要GPU -->
                <el-form-item label="使用gpu资源：" prop="use_gpu">
                  <el-select v-model="form.use_gpu" placeholder="请选择">
                    <el-option label="true" :value="1"></el-option>
                    <el-option label="false" :value="0"></el-option>
                    <el-option label="any" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 如果需要，则GPU需求和限制 -->
                <div class="flex-container">
                  <el-form-item v-if="form.use_gpu === 1" label="gpu需求：" prop="gpu_request" class="flex-item">
                    <el-input placeholder="2000m" v-model="form.gpu_request" class="inputform"></el-input>
                  </el-form-item>
                  <el-form-item v-if="form.use_gpu === 1" label="gpu限制：" prop="gpu_limit" class="flex-item">
                    <el-input placeholder="2000m" v-model="form.gpu_limit" class="inputform"></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <!-- 创建容器的按钮 -->
            <div style="display: flex; justify-content: center;">
              <el-button type="primary" @click="handleSubmit">创 建 部 署</el-button>
              <!-- <el-button @click="cancel">重 置</el-button> -->
            </div>
          </el-card>
        </el-col>
        
        <!-- 部署查询 -->
        <el-col :span="12"> 
          <el-card>
            <h2>部署查询</h2>
            <el-row type="flex" align="middle" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
              <el-col :span="3">
                <h4>命名空间：</h4>
              </el-col>
              <el-col :span="8">
                  <el-select v-model="selectedNamespace" placeholder="请选择命名空间" @change="fetchDeployments">
                    <el-option
                      v-for="namespace in namespaces"
                      :key="namespace"
                      :label="namespace"
                      :value="namespace">
                    </el-option>
                  </el-select>
              </el-col>
            </el-row>
            
            <!-- 部署列表 -->
            <el-row>
              <el-table :data="deployments">
                <el-table-column label="" align="center">
                  <template>
                    <span class="iconfont icon-guanli"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="deploy_name" label="部署名称" align="center" >
                </el-table-column>
                <el-table-column prop="position" label="位置" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.position === 1 ? '边' : '云' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="replicas" label="副本数量" align="center">
                </el-table-column>
              </el-table>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios, { formToJSON } from 'axios';
export default{
  props: {
    message: String
  },
  data() {
    return {
      activeTab: 'basic',
        form: {
            deployname: 'deploy-name',
            namespace: 'default',
            replicas: '1',
            scheduler: 'k8s-default',
            scheduler_positon: null,
            use_gpu: false,
            container_name: 'containerid-01',
            image_name: '',
            image_version: 'latest',
            cpu_request: '200m',
            cpu_limit: '200m',
            mem_request: '200Mi',
            mem_limit: '200Mi',
            gpu_request: '',
            gpu_limit: ''
        },
        rules1: {
          deployname: [
            { required: true, message: '请输入部署名称', trigger: 'blur' }
          ],
          scheduler_positon: [
            { required: true, message: '请选择调度位置', trigger: 'change' }
          ],
          container_name: [
            { required: true, message: '请输入容器名称', trigger: 'blur' }
          ],
          image_name: [
            { required: true, message: '请输入镜像名称', trigger: 'blur' }
          ]
        },
        namespaces: [], // 存储命名空间列表
        selectedNamespace: 'default', // 默认命名空间
        deployments: [], // 存储部署列表

    }
  },
  mounted() {
    this.fetchNamespaces(); // 页面加载时获取命名空间
    this.fetchDeployments(); // 页面加载时获取 default 命名空间的部署
  },
  methods: {
    async handleSubmit() {
      try {
        // 手动验证 scheduler_position 字段
        if (this.form.scheduler_positon === null || this.form.scheduler_positon === undefined) {
          this.$message.error('请选择云边调度');
          return;
        }
        const response = await axios.post('/schedulerfront/form', this.form);
        console.log('提交成功', response.data);
        console.log("表单数据：", this.form)
        this.$message.success(response.data["message"]);
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        })
     
        // 提交成功后，等待 2 秒，再重新获取部署数据
        setTimeout(async () => {
          await this.fetchDeployments();
        }, 2000);
        this.$forceUpdate(); // 确保在 DOM 更新后强制渲染
      } catch (error) {
        console.log("执行了catch(error)")
        console.log(error)
        this.$message.error("创建失败,reason:"+error.response.data["message"]);
        console.error('提交失败',"状态码：",error.response.status);
      }
    },
    // 获取命名空间
    async fetchNamespaces() {
      try {
        const response = await axios.get('/schedulerfront/namespace');
        // 得到的数据是一个数组，如上所示
        const namespaces = response.data;
        // 使用 Set 去重
        const uniqueNamespaces = Array.from(new Set(namespaces));
        this.namespaces = uniqueNamespaces; // 保存去重后的命名空间数组
      } catch (error) {
        console.error('获取命名空间失败:', error);
      }
    },
    // 获取部署
    async fetchDeployments() {
      try {
        const response = await axios.get(`/schedulerfront/podnode?namespace=${this.selectedNamespace}`);
        this.deployments = response.data; // 假设返回的部署数据包含图标、名字、位置、副本数量等字段
      } catch (error) {
        console.error('获取部署失败:', error);
      }
    }
  }
}
</script>

<style scoped>

  h2 {
    text-align: center;
  }
</style>