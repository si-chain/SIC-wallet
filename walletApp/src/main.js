// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './vuex/store'
import { AjaxPlugin, ToastPlugin } from 'vux'
import i18n from './language/index'
import util from './libs/utils'
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.$http.defaults.baseURL = 'http://10.3.1.135:3000/v1'
Vue.prototype.$common = util
/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
