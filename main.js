import App from './App'

import store from './store'
import uniApi from '@/utils/uniApi.js'
import api from '@/config/request' // api接口调用
import router from '@/config/router' // 路由
import auth from '@/utils/auth' // 权限


// #ifndef VUE3
import Vue from 'vue'
const systemInfo = uni.getSystemInfoSync();
Vue.config.productionTip = false
Vue.prototype.$uniApi = uniApi;
Vue.prototype.$api = api; // api接口调用
Vue.prototype.$routerConfig = router; // 路由
Vue.prototype.$auth = auth; // 权限
// rpx转px单位
Vue.prototype.$rpx2px = (v) => {
	return parseInt(systemInfo.windowWidth * v / 750)
}

App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})

import uView from "uview-ui";
Vue.use(uView);

// 引入请求封装，将app参数传递到配置中
require('@/config/request/baseConfig.js')(app)

app.$mount()

import render from "@/utils/render.js";
Vue.prototype.$r = render;
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif