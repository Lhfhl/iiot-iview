<template>
  <div>
    <el-card style="width: 100%; height: 100%;display: flex; flex-direction: column;">
      <el-row :gutter="150" style="height: 100%;">
        <el-col :offset="1" :span="16" style="height: 100%;">
          <div style="height: 100%;">
            <EZUIKitJs style="width: 100%; height: 100%;"></EZUIKitJs>
          </div>
        </el-col>

        <el-col :span="6" style="display: flex; flex-direction: column;height: 100%; margin-top: 40px;">
          <data-card label="温度" :value="25" icon-class="iconfont icon-wendu" icon-size="50px" class="card-item"
            unit="℃" />

          <data-card label="湿度" :value="25" icon-class="iconfont icon-humidity" icon-size="50px" class="card-item"
            unit="%" />

          <data-card label="二氧化碳" :value="25" icon-class="iconfont icon-eryanghuatan" icon-size="50px" class="card-item"
            unit="ppm" />

          <data-card label="二氧化硫" :value="25" icon-class="iconfont icon-eryanghualiu" icon-size="50px" class="card-item"
            unit="ppm" />

          <data-card label="噪音" :value="25" icon-class="iconfont icon-zaoyin" icon-size="50px" class="card-item"
            unit="dB" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import EZUIKitJs from "@/view/industrial-monitoring/EZUIKitJs.vue";
import DataCard from "@/view/industrial-monitoring/DataCard.vue";

export default {
  components: {
    EZUIKitJs,
    DataCard
  },
}

</script>

<style scoped>
.card-item {
  margin-bottom: 5px;
}
</style>