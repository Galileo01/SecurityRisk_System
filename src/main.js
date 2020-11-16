import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/antd.js'

// import VueCharts from 'v-charts'
// import VueAMap from 'vue-amap'
Vue.config.productionTip = false
// Vue.use(VueCharts)
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: '6e350de4372aea6e14e89161fe4816c0',
//   //注册要使用的 系统组件
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictSearch'],
//   // 默认高德 sdk 版本为 1.4.4
//   v: '1.4.4'
// });
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
