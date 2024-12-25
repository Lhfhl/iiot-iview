<template>
  <div>
    <el-card>
      <el-row :gutter="10"> 
        <!-- 云边资源容器调度 -->
        <el-col :span="10"> 
          <el-card>
            <h2>云边资源容器调度</h2>
            <!-- <div class="tabs">
                <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基本信息</button>
                <button :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">容器配置</button>
            </div> -->
            <!-- 基本信息页面 -->
            <div style="margin: 10% 10% 0;" type="flex"  justify="center">
              <el-form  label-position="left" class="form-section" :rules="rules1" :model="form" label-width="auto" ref="form">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="部署名称：" prop="deployname" style="font-weight: bold">
                      <el-input placeholder="deploy-name" v-model="form.deployname" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="命名空间：" prop="namespace" style="font-weight: bold">
                      <el-input placeholder="default" v-model="form.namespace" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="副本数：" prop="replicas" style="font-weight: bold">
                      <el-input placeholder="1" v-model="form.replicas" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="调度器：" prop="scheduler" style="font-weight: bold">
                      <el-select v-model="form.scheduler" placeholder="请选择" :teleported="false">
                        <el-option label="k8s-default" :value="1"></el-option>
                        <el-option label="edge-scheduler" :value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="云边调度：" prop="scheduler_positon" style="font-weight: bold">
                      <el-select v-model="form.scheduler_positon" placeholder="请选择" >
                        <el-option label="边端" :value="1"></el-option>
                        <el-option label="云端" :value="0"></el-option>
                        <el-option label="任意" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 容器配置页面 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="容器名称：" prop="container_name" style="font-weight: bold">
                      <el-input placeholder="containerid-01" v-model="form.container_name" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="镜像名称：" prop="image_name" style="font-weight: bold">
                      <el-input placeholder="" v-model="form.image_name" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="镜像版本：" prop="image_version" style="font-weight: bold">
                      <el-input placeholder="latest" v-model="form.image_version" class="input_content"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 配置命令 -->
                <el-form-item label="command：" prop="command" style="font-weight: bold">
                  <el-input placeholder="" v-model="form.command"></el-input>
                </el-form-item>

                <!-- 容器 "CPU" 需求和限制 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="cpu需求：" prop="cpu_request" style="font-weight: bold">
                      <el-input placeholder="200m" v-model="form.cpu_request"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="cpu限制：" prop="cpu_limit" style="font-weight: bold">
                      <el-input placeholder="200m" v-model="form.cpu_limit"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 容器 "内存" 需求和限制 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="mem需求：" prop="mem_request" style="font-weight: bold">
                      <el-input placeholder="200Mi" v-model="form.mem_request"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="mem限制：" prop="mem_limit" style="font-weight: bold">
                      <el-input placeholder="200Mi" v-model="form.mem_limit"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 选择是否需要GPU -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="使用gpu资源：" prop="use_gpu" style="font-weight: bold">
                      <el-select v-model="form.use_gpu" placeholder="请选择">
                        <el-option label="true" :value="1"></el-option>
                        <el-option label="false" :value="0"></el-option>
                        <el-option label="any" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 如果需要，则GPU需求和限制 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item v-if="form.use_gpu === 1" label="gpu需求：" prop="gpu_request" style="font-weight: bold">
                      <el-input placeholder="2000m" v-model="form.gpu_request" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="form.use_gpu === 1" label="gpu限制：" prop="gpu_limit" style="font-weight: bold">
                      <el-input placeholder="2000m" v-model="form.gpu_limit" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
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
        <el-col :span="14"> 
          <el-card>
            <h2>部署查询</h2>
            <el-row type="flex" align="middle" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
              <el-col :span="3">
                <h3>命名空间：</h3>
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

                <!-- 新增容器伸缩配置按钮列 -->
                <el-table-column label="容器配置" align="center">
                  <template slot-scope="scope">
                    <el-button @click="openScalingDialog(scope.row)">容器配置</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <!-- 容器伸缩配置弹窗 -->
            <el-dialog :visible.sync="scalingDialogVisible" title="容器配置">
            <el-form :model="scalingForm" label-width="120px">
              <!-- 将“当前副本数”和“预期副本数”放在同一行 -->
              <el-row>
                <el-col :span="4">
                  <el-form-item label="当前副本数：">
                    <span>{{ scalingForm.currentReplicas }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="预期副本数：">
                    <span>{{ scalingForm.expectedReplicas }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="选择操作：">
                <el-radio-group v-model="scalingForm.operation">
                  <el-radio label="expand">扩展</el-radio>
                  <el-radio label="shrink">缩减</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="改变的副本数量">
                <el-input-number v-model="scalingForm.changeAmount" :min="0" :max="20" label="数量" @change="updateExpectedReplicas"/>
              </el-form-item>
              
              <el-form-item>
                <el-button type="danger" @click="resetReplicas">删除</el-button>
                <el-button type="primary" @click="submitScaling">确定</el-button>
                <el-button @click="resetForm">取消</el-button>
              </el-form-item>
            </el-form>
            </el-dialog>
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
            command: '',
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
        scalingDialogVisible: false, // 控制弹窗显示
        // 默认值
        defaultScalingForm: {
          currentReplicas: 0,
          expectedReplicas: 0,
          operation: 'expand',
          changeAmount: 1,
          deployName: '',
          namespace: '',
        },
        //待提交的容器伸缩配置
        scalingForm: {
          currentReplicas: 0, // 当前副本数
          expectedReplicas: 0, // 预期副本数
          operation: 'expand', // 选择操作（扩展或缩减）
          changeAmount: 0, // 数量（默认为1）
          deployName: '', // 部署名称
          namespace: '', // 命名空间
        },
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
        console.log("表单数据：", this.form);
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
    },
    // 打开容器伸缩配置弹窗
    openScalingDialog(deployment) {
      this.scalingForm.deployName = deployment.deploy_name;
      this.scalingForm.namespace = this.selectedNamespace;
      this.scalingForm.currentReplicas = deployment.replicas;
      this.scalingForm.expectedReplicas = deployment.replicas;
      this.scalingDialogVisible = true;
    },
    // 删除操作：将预期副本数设为0
    resetReplicas() {
      this.scalingForm.expectedReplicas = 0;
      this.scalingForm.changeAmount = 0;
    },
    // 提交容器伸缩配置
    async submitScaling() {
      const { namespace, deployName, expectedReplicas } = this.scalingForm;
      if (expectedReplicas < 0 || expectedReplicas > 20) {
        this.$message.error('预期副本数必须在0到20之间');
        return;
      }
      if (expectedReplicas === this.scalingForm.currentReplicas) {
        this.$message.error('预期副本数与当前副本数相同');
        return;
      }
      
      // 调用API接口提交伸缩请求
      const requestData = {
        namespace,
        deployName,
        targetNum: expectedReplicas,
      };

      try {
        const response = await axios.post('/schedulerfront/scale', requestData);
        this.$message.success('伸缩配置成功');
        this.scalingDialogVisible = false;
        // 更新部署信息
        this.fetchDeployments();
      } catch (error) {
        this.$message.error('伸缩配置失败');
        console.error('伸缩配置失败:', error);
      }
    },
    // 计算预期副本数
    updateExpectedReplicas() {
      const { currentReplicas, operation, changeAmount } = this.scalingForm;
      if (operation === 'expand') {
        this.scalingForm.expectedReplicas = Math.min(20, currentReplicas + changeAmount);
      } else if (operation === 'shrink') {
        this.scalingForm.expectedReplicas = Math.max(0, currentReplicas - changeAmount);
      }
    },
    // 重置表单为默认值
    resetForm() {
      this.scalingForm = { ...this.defaultScalingForm }; // 恢复默认值
      this.scalingDialogVisible = false; // 关闭弹窗
    },
  },
  watch: {
    // 监听数量变化
    'scalingForm.changeAmount': function () {
      this.updateExpectedReplicas();
    },
    // 监听操作变化
    'scalingForm.operation': function () {
      this.updateExpectedReplicas();
    },
  },
}
</script>

<style scoped>

  h2 {
    text-align: center;
  }
</style>