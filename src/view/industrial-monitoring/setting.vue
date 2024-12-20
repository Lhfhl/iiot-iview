<template>
    <transition name="yh-setting-fade">
        <div class="setting" :class="{ settingShow: settingShow }" v-show="settingShow">
            <div class="setting_dislog" @click="settingShow = false">

            </div>
            <div class="setting_inner">
                <div class="setting_header">
                    设置
                </div>
                <div class="setting_body">
                    <!-- <div class="left_shu"> 实时监测</div> -->
                    <div class="left_shu"> 全局设置</div>
                      <div class="setting_item">
                        <span class="setting_label">
                            是否进行自动适配<span class="setting_label_tip">(默认分辨率1920*1080)</span>:
                        </span>
                        <div class="setting_content">
                            <el-radio-group v-model="isScaleradio" @change="(val) => radiochange(val, 'isScale')">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>

                        </div>
                    </div>
                    <div class="left_shu"> 实时监测</div>
                    <div class="setting_item">
                        <span class="setting_label">
                            实时预警轮播: <span class="setting_label_tip"></span>
                        </span>
                        <div class="setting_content">
                            <el-radio-group v-model="sbtxradio" @change="(val) => radiochange(val, 'sbtxSwiper')">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>

                        </div>
                    </div>
                    <div class="setting_item">
                        <span class="setting_label">
                            订单信息轮询:
                        </span>
                        <div class="setting_content">
                            <el-radio-group v-model="ssyjradio" @change="(val) => radiochange(val, 'ssyjSwiper')">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <!-- <el-button type="primary" round size="mini">确定</el-button> -->
                    </div>
                  <div>
                    <div class="left_shu"> 切换页面</div>
                    <Button size="large" type="text" @click="backHome">返回首页</Button>
                    <Button size="large" type="text" @click="backPrev">返回上一页</Button>
                  </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  // name: 'backBtnGroup',
  data() {
    return {
      settingShow: false,
      sbtxradio: true,
      ssyjradio: true,
      isScaleradio: true
    };
  },
  methods: {
    // 初始化设置面板
    init() {
      this.settingShow = true;
    },
    // 更改单选按钮的值
    radiochange(val, type) {
      this.$store.commit('setting/updateSwiper', { val, type });
      if (type === 'isScale') {
        // 如需刷新页面可取消注释以下一行
        // this.$router.go(0)
      }
    },
    // 返回首页
    backHome() {
      this.$router.replace({
        name: this.$config.homeName // 替换为首页路由名称
      });
    },
    // 返回上一页
    backPrev() {
      this.$router.go(-1);
    }
  },
  created() {
    // 初始化设置状态
    this.$store.commit('setting/initSwipers');
    this.sbtxradio = this.$store.state.setting.sbtxSwiper;
    this.ssyjradio = this.$store.state.setting.ssyjSwiper;
    this.isScaleradio = this.$store.state.setting.isScale;
  },
  mounted() {
    // 将当前组件的 DOM 节点插入到 body 中
    document.body.appendChild(this.$el);
  },
  destroyed() {
    // 在组件销毁时移除 DOM 节点
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};

</script>

<style scoped>
</style>
