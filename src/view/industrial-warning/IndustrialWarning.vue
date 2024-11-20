<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="3" :offset="1">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Indoor_relative_humidity"
            title="室内相对湿度"
            suffix="%"
            class="statistic"
          >
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Outdoor_relative_humidity"
            title="室外相对湿度"
            suffix="%"
          >
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Sun_light_in_east"
            title="东立面的阳光"
            suffix="lux"
          >
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Sun_light_in_west"
            title="西立面的阳光"
            suffix="lux"
          >
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Sun_irradiance"
            title="太阳辐照度"
          >
          <template #suffix>
            W/m<sup>2</sup>
          </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Wind_speed"
            title="风速"
            suffix="m/s"
          >
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="env_card">
          <el-statistic 
            :precision="2"
            :value="Rainfall_ratio"
            title="降雨比例"
          >
          </el-statistic>
          <div style="color: #999;text-align: center;margin-top: 5px; font-size: 10px;">最近15分钟</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 15px;" :gutter="20">
      <el-col :span="10">
        <el-card style="height: auto; display: flex; flex-direction: column; align-items: center;">
          <!-- 标题部分 -->
          <div style="text-align: center; margin-bottom: 10px;">
            <h3>安全头盔检测</h3>
          </div>
          <!-- 图片部分 -->
          <el-image
            :src="safety_helmet_identification_url"
            fit="contain"
          />
        </el-card>
      </el-col>
      
      <el-col :span="14">
          <el-card >
            <!-- 标题部分 -->
            <div style="text-align: center;">
              <h3>温度预警</h3>
            </div>
            <DynamicChart></DynamicChart>
          </el-card>
          <el-card style="margin-top: 40px; height: 100px; display: flex; flex-direction: column; justify-content: center;">
            <div style="width: 100%; display: inline-block; height: 100%;">
              <el-statistic :value="temperature" title="未来车间温度">
                <template slot="suffix">
                  <div> 
                    ℃ 无异常
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
import axios from 'axios';
import DynamicChart from '@/view/industrial-warning/DynamicChart.vue';

export default {
  components: {
    DynamicChart,
  },
  data() {
    return {
      /**
       * 七个指标
       */
      Indoor_relative_humidity: 0,  //室内相对湿度，%
      Outdoor_relative_humidity: 0, //室外相对湿度，%
      Sun_light_in_east: 0, //东立面的阳光，lux
      Sun_light_in_west: 0, //西立面的阳光，lux
      Sun_irradiance: 0,    //太阳辐照度，单位 W/m2
      Wind_speed: 0,        //风速，m/s
      Rainfall_ratio: 0,     //降雨比例
      /**
       * 安全头盔识别
       */
      safety_helmet_identification_url: '',
      intervalId: null, // 七个指标定时器 ID
      intervalIdHelmet: null,  //安全头盔定时器ID
      //未来第30分钟的温度
      temperature: null, // 存储第30个数据的温度
    };
  },
  created() {
    // 从后端获取数据
    this.fetchMetric();
    // 每5分钟刷新一次数据
    this.intervalId = setInterval(this.fetchMetric, 300000);
    // 每5分钟刷新一次头盔图片
    this.fetchHelmetImage();
    this.intervalIdHelmet = setInterval(this.fetchHelmetImage, 300000);
  },
  beforeDestroy() {
    // 组件销毁时清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.intervalIdHelmet) {
      clearInterval(this.intervalIdHelmet);
    }
  },
  mounted() {
    this.fetchTemperatureData();
  },
  methods: {
    /**
     * 
     * 获取七个指标
     * 
     */
    async fetchMetric() {
      try {
        const response = await axios.get('/schedulerfront/index');
        const data = response.data;

        this.Indoor_relative_humidity = Number(parseFloat(data.Relative_humidity_room).toFixed(2));
        this.Outdoor_relative_humidity = Number(parseFloat(data.Outdoor_relative_humidity_Sensor).toFixed(2));
        this.Sun_light_in_east = Number(parseFloat(data.Meteo_Sun_light_in_east_facade).toFixed(2));
        this.Sun_light_in_west = Number(parseFloat(data.Meteo_Sun_light_in_west_facade).toFixed(2));
        this.Sun_irradiance = Number(parseFloat(data.Meteo_Sun_irradiance).toFixed(2));
        this.Wind_speed = Number(parseFloat(data.Meteo_Wind).toFixed(2));
        this.Rainfall_ratio = Number(parseFloat(data.Meteo_Rain).toFixed(2));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    },
    /**
     * 
     *安全头盔识别
     * 
     */
    fetchHelmetImage() {
      // console.log("我刷新了一次")
      this.safety_helmet_identification_url = `/schedulerfront/helmet`;
    },
    /**
     * 
     * 取得未来第30分钟的温度
     * 
     */
    async fetchTemperatureData() {
      try {
        const response = await fetch('/schedulerfront/pretem');
        const data = await response.json();

        // 将数据转换为数组形式并获取第30个时间点的温度
        const temperatureEntries = Object.entries(data);
        if (temperatureEntries.length >= 30) {
          const temp = temperatureEntries[29][1]; // 第30个数据（索引从0开始）
          console.log(temperatureEntries)
          console.log("当前的温度",temp)
          this.temperature = Number(parseFloat(JSON.parse(String(temp))[0]).toFixed(2)); // 转换为数值
        } else {
          console.error('返回的数据不足30个');
        }
      } catch (error) {
        console.error('获取温度数据失败:', error);
      }
    },
  },
};
</script>

  
<style scoped>
.metric-card {
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-divider__text {
    font-weight: bold;
}

.env_card {
  height: 85px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>

  