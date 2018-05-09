// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './vuex/store'
import { AjaxPlugin, ToastPlugin, ConfirmPlugin, ViewBox } from 'vux'
import i18n from './language/index'
import util from './libs/utils'
import Filters from './libs/filters'

Vue.component('view-box', ViewBox)
Filters(Vue)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(ConfirmPlugin)
FastClick.attach(document.body)

Vue.config.productionTip = false
// Vue.prototype.$http.defaults.baseURL = '${this.basePath}/v1'
Vue.prototype.$common = util
Vue.prototype.basePath = 'http://124.65.100.178:3000'
/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
