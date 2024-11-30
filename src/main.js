// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import ProgressBar from '@/components/charts/ProgressBar.vue' // 导入进度条组件
// 引入监控大屏组件
import { loading, borderBox13, digitalFlop, capsuleChart, borderBox8 } from '@jiaminghi/data-view'
// 引入监控大屏相关组件

// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  require('@/mock/index'); // 引入 mock/index.js
  require('@/mock/screen'); // 引入 mock/screen.js
}
Vue.component('ProgressBar', ProgressBar); // 注册全局组件

Vue.use(ElementUI, {
i18n: (key, value) => i18n.t(key, value)
})

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
// datav组件（监控大屏）
Vue.use(loading)
Vue.use(borderBox13)
Vue.use(borderBox8)
Vue.use(digitalFlop)
Vue.use(capsuleChart)
// datav组件（监控大屏）

importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
